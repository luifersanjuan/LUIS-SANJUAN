import { InductionProgress } from '../types/induction';

export interface SyncedApprenticeRow {
  timestamp: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  formationProgram: string;
  courseCode: string;
  regional: string;
  trainingCenter: string;
  completedModulesCount: number;
  averageScore: number;
  totalXp: number;
  status: string;
  certificateHash: string;
  certificateDate: string;
}

export interface SpreadsheetInfo {
  id: string;
  name: string;
  webViewLink: string;
}

export const SPREADSHEET_TITLE = 'Inducción Aprendices SENA - Registro Oficial';
export const SHEET_NAME = 'Aprendices';

export const SHEET_HEADERS = [
  'Marca Temporal',
  'Tipo Documento',
  'Número Documento',
  'Nombre del Aprendiz',
  'Programa de Formación',
  'Número Ficha',
  'Regional SENA',
  'Centro de Formación',
  'Módulos Aprobados (x/5)',
  'Puntaje Promedio (%)',
  'Puntos XP',
  'Estado Inducción',
  'Código Verificación Certificado',
  'Fecha de Certificación'
];

const CACHE_KEY = 'sena_induction_sheet_info';

/**
 * Returns locally cached spreadsheet info if previously created or found.
 */
export function getCachedSpreadsheet(): SpreadsheetInfo | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as SpreadsheetInfo;
    }
  } catch {
    // Ignore cache error
  }
  return null;
}

/**
 * Searches Google Drive for an existing spreadsheet with the title.
 */
export async function findExistingSpreadsheet(accessToken: string): Promise<SpreadsheetInfo | null> {
  // Try cached sheet ID first for instant lookup
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as SpreadsheetInfo;
      if (parsed.id) {
        const verify = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${parsed.id}?fields=spreadsheetId,properties.title`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (verify.ok) {
          return parsed;
        }
      }
    }
  } catch {
    // Ignore cache error
  }

  const query = encodeURIComponent(`name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.warn('Error al buscar hoja existente en Drive:', errorBody);
    return null;
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    const info: SpreadsheetInfo = {
      id: data.files[0].id,
      name: data.files[0].name,
      webViewLink: data.files[0].webViewLink || `https://docs.google.com/spreadsheets/d/${data.files[0].id}/edit`
    };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(info));
    } catch {
      // ignore
    }
    return info;
  }

  return null;
}

/**
 * Creates a brand new Google Spreadsheet with stylized headers and frozen top row.
 */
export async function createSpreadsheet(accessToken: string): Promise<SpreadsheetInfo> {
  const createPayload = {
    properties: {
      title: SPREADSHEET_TITLE
    },
    sheets: [
      {
        properties: {
          title: SHEET_NAME,
          gridProperties: {
            frozenRowCount: 1
          }
        }
      }
    ]
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPayload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error creando la hoja en Google Sheets: ${errText}`);
  }

  const createdSheet = await response.json();
  const spreadsheetId = createdSheet.spreadsheetId;
  const webViewLink = createdSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers to Row 1
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}!A1:N1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `${SHEET_NAME}!A1:N1`,
        majorDimension: 'ROWS',
        values: [SHEET_HEADERS]
      })
    }
  );

  // Apply styling to header row (SENA Green #39A900 background with bold white text)
  try {
    const firstSheetId = createdSheet.sheets?.[0]?.properties?.sheetId || 0;
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: firstSheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SHEET_HEADERS.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.224, // 57/255 ≈ 0.224 (#39)
                    green: 0.663, // 169/255 ≈ 0.663 (#A9)
                    blue: 0.0 // 0/255 = 0 (#00)
                  },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 10
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: firstSheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: SHEET_HEADERS.length
              }
            }
          }
        ]
      })
    });
  } catch (formatErr) {
    console.warn('No se pudo aplicar el formato estilizado a las cabeceras:', formatErr);
  }

    const info: SpreadsheetInfo = {
      id: spreadsheetId,
      name: SPREADSHEET_TITLE,
      webViewLink
    };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(info));
    } catch {
      // ignore
    }

    return info;
  }

/**
 * Gets or creates the induction spreadsheet.
 */
export async function getOrCreateSpreadsheet(accessToken: string): Promise<SpreadsheetInfo> {
  const existing = await findExistingSpreadsheet(accessToken);
  if (existing) {
    return existing;
  }
  return await createSpreadsheet(accessToken);
}

/**
 * Fetches all apprentice rows from the spreadsheet for display.
 */
export async function fetchSpreadsheetRows(
  accessToken: string,
  spreadsheetId: string
): Promise<SyncedApprenticeRow[]> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}!A2:N500`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const rawRows: string[][] = data.values || [];

  return rawRows.map((cols) => ({
    timestamp: cols[0] || '',
    documentType: cols[1] || 'CC',
    documentNumber: cols[2] || '',
    fullName: cols[3] || '',
    formationProgram: cols[4] || '',
    courseCode: cols[5] || '',
    regional: cols[6] || '',
    trainingCenter: cols[7] || '',
    completedModulesCount: Number(cols[8]?.split('/')[0]) || 0,
    averageScore: Number(cols[9]) || 0,
    totalXp: Number(cols[10]) || 0,
    status: cols[11] || 'En Proceso',
    certificateHash: cols[12] || '',
    certificateDate: cols[13] || ''
  }));
}

/**
 * Formats an InductionProgress instance into a spreadsheet row.
 */
export function buildRowFromProgress(progress: InductionProgress): (string | number)[] {
  const learner = progress.learner;
  const scores = Object.values(progress.moduleScores);
  const avg = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const isDone = progress.completedModules.length >= 5 && progress.certificateIssued;

  const nowFormatted = new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return [
    nowFormatted,
    learner.documentType,
    learner.documentNumber,
    learner.fullName,
    learner.formationProgram,
    learner.courseCode,
    learner.regional,
    learner.trainingCenter,
    `${progress.completedModules.length}/5`,
    avg,
    progress.totalXp,
    isDone ? 'Certificado (Inducción Culminada)' : 'En Inducción Formativa',
    progress.certificateHash || 'Pendiente de emisión',
    progress.certificateDate || (isDone ? new Date().toLocaleDateString('es-CO') : 'Sin culminar')
  ];
}

/**
 * Syncs the current learner progress into Google Sheets.
 * If the learner's document number already exists in a row, it updates that row.
 * Otherwise, it appends a new row at the bottom.
 */
export async function syncLearnerProgress(
  accessToken: string,
  progress: InductionProgress
): Promise<{
  spreadsheet: SpreadsheetInfo;
  action: 'updated' | 'appended';
  rowNumber: number;
}> {
  const spreadsheet = await getOrCreateSpreadsheet(accessToken);
  const rowData = buildRowFromProgress(progress);
  const targetDocNumber = String(progress.learner.documentNumber).trim();

  // Read column C (document numbers) to check if apprentice exists
  const checkResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}/values/${SHEET_NAME}!C2:C500`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  let existingRowIndex = -1;
  if (checkResponse.ok) {
    const checkData = await checkResponse.json();
    const existingDocs: string[][] = checkData.values || [];
    existingRowIndex = existingDocs.findIndex((row) => row[0]?.trim() === targetDocNumber);
  }

  if (existingRowIndex >= 0) {
    // Row exists: 0-indexed in array corresponds to sheet row (existingRowIndex + 2)
    const targetRowNumber = existingRowIndex + 2;
    const updateRange = `${SHEET_NAME}!A${targetRowNumber}:N${targetRowNumber}`;

    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}/values/${updateRange}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: updateRange,
          majorDimension: 'ROWS',
          values: [rowData]
        })
      }
    );

    if (!updateResponse.ok) {
      const err = await updateResponse.text();
      throw new Error(`Error actualizando el registro en Google Sheets: ${err}`);
    }

    return {
      spreadsheet,
      action: 'updated',
      rowNumber: targetRowNumber
    };
  } else {
    // Append new row at the end of the sheet
    const appendRange = `${SHEET_NAME}!A1`;
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: appendRange,
          majorDimension: 'ROWS',
          values: [rowData]
        })
      }
    );

    if (!appendResponse.ok) {
      const err = await appendResponse.text();
      throw new Error(`Error guardando nuevo registro en Google Sheets: ${err}`);
    }

    const appendData = await appendResponse.json();
    const updatedRange: string = appendData.updates?.updatedRange || '';
    const match = updatedRange.match(/!A(\d+)/);
    const rowNumber = match ? parseInt(match[1], 10) : 2;

    return {
      spreadsheet,
      action: 'appended',
      rowNumber
    };
  }
}

/**
 * Fetches all apprentice rows from the configured Google Sheet for the Instructor Dashboard.
 */
export async function fetchApprenticesFromSheet(accessToken: string, spreadsheetId: string): Promise<SyncedApprenticeRow[]> {
  try {
    const range = `${SHEET_NAME}!A2:N500`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!response.ok) {
      console.warn('No se pudieron leer las filas de la hoja de cálculo:', await response.text());
      return [];
    }

    const data = await response.json();
    const rows = data.values || [];

    return rows
      .filter((r: any[]) => r && r[2]) // Filter rows with at least a document number
      .map((r: any[]) => ({
        timestamp: r[0] || '',
        documentType: r[1] || 'CC',
        documentNumber: String(r[2] || ''),
        fullName: r[3] || 'Aprendiz',
        formationProgram: r[4] || 'Programa SENA',
        courseCode: String(r[5] || ''),
        regional: r[6] || 'Regional SENA',
        trainingCenter: r[7] || 'Centro de Formación',
        completedModulesCount: parseInt(r[8] || '0', 10),
        averageScore: parseInt(r[9] || '0', 10),
        totalXp: parseInt(r[10] || '0', 10),
        status: r[11] || 'En Progreso',
        certificateHash: r[12] || '',
        certificateDate: r[13] || ''
      }));
  } catch (error) {
    console.error('Error al obtener aprendices de Google Sheets:', error);
    return [];
  }
}

