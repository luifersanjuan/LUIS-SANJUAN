# Sincronización Automática en Segundo Plano con Google Sheets (SENA)

Sistema de sincronización continua, transparente y autónoma que almacena y actualiza el progreso, evaluaciones, casos de estudio y certificaciones de los aprendices en Google Drive y Google Sheets sin intervención manual recurrente.

## Decisiones Críticas Confirmadas por el Usuario

> [!IMPORTANT]
> A partir de tus respuestas en la fase de aclaración, la arquitectura se ajustará con los siguientes acuerdos fundamentales:

- **Momentos de Sincronización Automática**: El prototipo transmitirá los datos inmediatamente cada vez que el aprendiz apruebe una evaluación de módulo ($\ge 80\%$), resuelva satisfactoriamente un caso de estudio ético/disciplinario, actualice los datos de su ficha/perfil o genere su certificado digital de inducción.
- **Visualización No Intrusiva**: En lugar de mostrar modales o alertas emergentes que interrumpan el flujo de aprendizaje, se incorporará un indicador discreto de nube en la barra superior (`Header`) que muestra el estado en tiempo real (Nube conectada, Sincronizando datos con sutil animación de giro, y Sincronizado correctamente).
- **Persistencia de Conexión**: La vinculación con Google Drive se activa una sola vez; el prototipo almacena de forma segura la preferencia y metadatos de la hoja (`Inducción Aprendices SENA - Registro Oficial`) para realizar las actualizaciones subsecuentes en segundo plano de manera continua sin volver a solicitar confirmaciones manuales.

---

## 1. Visión General y Concepto Central

- **Propósito**: Eliminar la fricción de sincronización manual para aprendices e instructores. Tan pronto un aprendiz interactúa con el material y valida sus competencias, la plataforma garantiza que la fila correspondiente a su documento de identidad en la hoja de Google Drive quede actualizada con sus calificaciones, módulos completados, puntos XP, estado de aprobación y código de verificación.
- **Audiencia Objetivo**: Aprendices SENA en jornada de inducción institucional e instructores/coordinadores que monitorean el avance en vivo desde su propia hoja de cálculo en Google Drive.
- **Valor Agregado**: Cero clics adicionales requeridos para reportar avances. Transparencia total mediante el enlace directo a la hoja accesible en cualquier momento desde el indicador superior.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujo de Usuario Autónomo
1. **Conexión Inicial Única**: El usuario autoriza la conexión con Google Drive una sola vez al pulsar el botón de vinculación en la barra superior o en el modal de bienvenida.
2. **Navegación Fluida del Aprendiz**: El aprendiz avanza por los 5 módulos normativos (Acuerdo 007 de 2012), resuelve casos y presenta pruebas.
3. **Sincronización en Segundo Plano**:
   - Al hacer clic en "Enviar Evaluación" y obtener puntaje aprobatorio, el sistema envía los datos a Google Sheets de inmediato.
   - En la esquina superior derecha, el icono de nube transiciona suavemente a un estado de pulso sutil con el mensaje `"Sincronizando..."`.
   - Al cabo de 1–2 segundos, el indicador muestra un check sutil de color verde SENA (`#39A900`) con el texto `"Guardado en Drive"`.
4. **Acceso al Enlace de la Hoja**: Al hacer clic en el indicador de la nube, se despliega un panel minimalista con el botón para abrir directamente la hoja en una nueva pestaña y copiar el enlace para compartir con el instructor.

### Estilo e Identidad Visual (Tokens y Filosofía SENA)
- **Cumplimiento Anti-Slop y Minimalismo**: Cero tarjetas flotantes genéricas ni modales invasivos continuos. Tipografía limpia y proporciones armónicas de acuerdo a la paleta institucional SENA:
  - Canvas Neutro: Fondo claro `#F8FAFC` y modo oscuro `#090D16` con desenfoque de fondo respetado.
  - Color Primario Institucional: Verde SENA `#39A900` para estados de éxito y acentos.
  - Indicador de Nube: Componente compacto integrado en el `Header`, respetando el contrato de barra superior de 3 zonas.
- **Animaciones y Rendimiento**: Micro-transición de rotación y opacidad limitada a $\le 200\text{ms}$ utilizando transformaciones aceleradas por hardware.

---

## 3. Decisiones Clave de Producto y Arquitectura

- **Estrategia de Actualización (Upsert Inteligente por Cédula)**:
  - *Enfoque*: Cada vez que se dispara un evento de sincronización, el servicio busca si ya existe una fila para el `Número de Documento` del aprendiz. Si existe, actualiza únicamente esa fila sin duplicar registros. Si es un aprendiz nuevo, añade una nueva fila con formato SENA.
  - *Ventaja*: La hoja de cálculo se mantiene limpia, ordenada y libre de duplicados redundantes.
- **Mecanismo de Cola Local y Resiliencia**:
  - *Enfoque*: Si en el momento de completar un examen no hay conexión a internet o el token expira, el progreso queda resguardado en `localStorage` y se sincroniza automáticamente en cuanto se restablece la conectividad.
- **Desacoplamiento de la Interfaz**:
  - Las acciones educativas del aprendiz (responder preguntas, ver contenido) no se bloquean mientras Google Sheets responde a la petición HTTP en segundo plano.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama del Sistema y Flujo de Sincronización Automática

```
┌────────────────────────────────────────────────────────────────────────┐
│                          APRENDIZ EN PROTOTIPO                         │
│  [Presenta Evaluación]  ───>  [Resuelve Caso]  ───>  [Genera Certificado] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Emite evento de progreso
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MOTOR DE AUTO-SYNC (useAutoSync)                     │
│  - Detecta cambios clave en módulos aprobados, XP y puntajes           │
│  - Verifica sesión activa de Google y token en memoria                │
│  - Encola si está ocupado / Previene llamadas duplicadas               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Petición HTTP en segundo plano
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│        GOOGLE DRIVE & SHEETS      │ │   INDICADOR EN HEADER            │
│  1. Verifica hoja de cálculo      │ │  - Icono de nube animado         │
│  2. Localiza fila por Cédula/TI   │ │  - Tooltip: "Guardado en Drive"  │
│  3. Actualiza fila con formato    │ │  - Acceso directo al enlace      │
└───────────────────────────────────┘ └──────────────────────────────────┘
```

### Componentes y Módulos a Implementar / Ajustar:
1. **Hook `useAutoSheetsSync` (`src/hooks/useAutoSheetsSync.ts`)**:
   - Gestiona el estado de sincronización (`idle`, `syncing`, `success`, `error`).
   - Escucha los hitos del aprendiz (`completedModules`, `scores`, `caseStudies`, `certificate`).
   - Llama a `syncApprenticeToSheet` de forma no bloqueante.
2. **Indicador de Nube en `Header.tsx`**:
   - Muestra el estado actual de sincronización (Nube verde con check cuando está al día, animación discreta cuando está enviando datos).
   - Menú desplegable ligero que muestra el enlace activo de Google Sheets para abrirlo con un clic.
3. **Disparadores Automáticos en `App.tsx`**:
   - Enlace directo en `handleQuizComplete`, `handleCaseSolve`, `handleProfileSave` y `handleCertify`.
4. **Resguardo de Sesión en `src/services/firebaseAuth.ts`**:
   - Preserva la referencia a la cuenta conectada para que no requiera reconfigurar la vinculación entre visitas.

---

## 5. Criterios de Aceptación y Verificación

1. Al aprobar cualquier evaluación de módulo, el aprendiz ve el indicador en la barra superior cambiar a sincronizando y luego a guardado sin abrir ningún diálogo modal intrusivo.
2. La hoja de cálculo en Google Drive refleja la nueva calificación y porcentaje inmediatamente.
3. El usuario puede ver y abrir el enlace de la hoja en cualquier momento desde el botón de la nube en la barra superior.
4. Si la hoja aún no existía en Google Drive, el sistema la crea automáticamente con sus encabezados verdes institucionales en la primera sincronización.
