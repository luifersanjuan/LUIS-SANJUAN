import { InductionModule, Badge, GlossaryItem, LearnerProfile, RegulationRuleItem } from '../types/induction';

export const DEFAULT_LEARNER: LearnerProfile = {
  fullName: 'Carlos Eduardo Ramírez Peña',
  documentType: 'CC',
  documentNumber: '1020304050',
  formationProgram: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  courseCode: '2904512',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Servicios Financieros',
  avatarSeed: 'cadet-green',
};

export const SENA_REGIONALES = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle',
  'Regional Atlántico',
  'Regional Santander',
  'Regional Bolívar',
  'Regional Cundinamarca',
  'Regional Caldas',
  'Regional Risaralda',
  'Regional Tolima',
  'Regional Huila',
  'Regional Boyacá',
  'Regional Nariño',
  'Regional Norte de Santander',
  'Regional Meta',
  'Regional Cesar',
  'Regional Córdoba',
  'Regional Cauca',
  'Regional Sucre',
  'Regional Quindío',
  'Regional Magdalena',
  'Regional La Guajira',
  'Regional Casanare',
  'Regional Chocó',
  'Regional Arauca',
  'Regional Caquetá',
  'Regional Putumayo',
  'Regional Amazonas',
  'Regional Guaviare',
  'Regional Guainía',
  'Regional Vaupés',
  'Regional Vichada',
  'Regional San Andrés y Providencia'
];

export const POPULAR_PROGRAMS = [
  'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  'Tecnólogo en Gestión Empresarial',
  'Tecnólogo en Gestión de Redes de Datos',
  'Tecnólogo en Contabilidad y Finanzas',
  'Tecnólogo en Animación Digital y 3D',
  'Tecnólogo en Producción Multimedia',
  'Técnico en Sistemas e Informática',
  'Técnico en Asistencia Administrativa',
  'Técnico en Cocina y Gastronomía',
  'Tecnólogo en Seguridad y Salud en el Trabajo',
  'Tecnólogo en Gestión Logística',
  'Tecnólogo en Mecatrónica Industrial'
];

/**
 * REGLAMENTO OFICIAL DEL APRENDIZ SENA - ACUERDO 007 DE 2012
 * Catálogo detallado de Derechos (Art. 7), Deberes (Art. 9) y Prohibiciones (Art. 10)
 */
export const ACUERDO_007_RULES: RegulationRuleItem[] = [
  // DERECHOS (Artículo 7 - Acuerdo 007 de 2012)
  {
    id: 'der_1',
    numeral: 'Numeral 1',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Formación Profesional Integral de Calidad',
    description: 'Recibir formación profesional integral acorde con el programa a desarrollar, y al crecimiento de sus dimensiones humanas (física, afectiva, cognitiva, social, ética y laboral).',
    practicalApplication: 'El aprendiz tiene derecho a instructores competentes, metodologías activas y proyectos formativos reales.'
  },
  {
    id: 'der_2',
    numeral: 'Numeral 2',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Inducción Oportuna al Ingreso',
    description: 'Recibir al iniciar el proceso de formación la inducción sobre la entidad, la formación profesional integral, la estructura del centro, su proyección socioeconómica y el reglamento.',
    practicalApplication: 'Es obligatorio que todo nuevo aprendiz curse la fase de inducción antes de las sesiones técnicas regulares.'
  },
  {
    id: 'der_3',
    numeral: 'Numeral 3',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Disposición de Recursos y Ambientes',
    description: 'Disponer en el Centro de Formación de los recursos físicos, didácticos, técnicos, tecnológicos y bibliográficos requeridos para su proceso formativo.',
    practicalApplication: 'Acceso a talleres dotados, conectividad a internet, simuladores y préstamo de libros o bases de datos del Sistema de Bibliotecas.'
  },
  {
    id: 'der_4',
    numeral: 'Numeral 4',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Beneficios de Bienestar al Aprendiz',
    description: 'Disfrutar de los programas institucionales de Bienestar al Aprendiz orientados a garantizar su permanencia y desarrollo integral.',
    practicalApplication: 'Convocatorias de apoyos de sostenimiento (regular y FIC), monitorías de aprendizaje, actividades deportivas, de salud preventiva y culturales.'
  },
  {
    id: 'der_5',
    numeral: 'Numeral 5',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Carné Institucional de Aprendiz',
    description: 'Recibir oportunamente el carné estudiantil que lo acredita como Aprendiz del SENA una vez legalizada la matrícula.',
    practicalApplication: 'El carné debe expedirse de forma ágil y es su documento oficial de identidad en sedes y ante empresas patrocinadoras.'
  },
  {
    id: 'der_6',
    numeral: 'Numeral 8',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Evaluación Justa y Retroalimentación Oportuna',
    description: 'Ser evaluado con objetividad y justicia, y conocer dentro de los términos establecidos el resultado de las evaluaciones y el plan de mejoramiento cuando aplique.',
    practicalApplication: 'El instructor debe registrar oportunamente los juicios en el sistema y socializar las observaciones pedagógicas.'
  },
  {
    id: 'der_7',
    numeral: 'Numeral 9',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Derecho a Solicitar Revisión de Evaluaciones',
    description: 'Solicitar la revisión de las evaluaciones y valoraciones ante el instructor dentro de los dos (2) días hábiles siguientes a la publicación; y ante el Comité si persiste desacuerdo.',
    practicalApplication: 'Garantía de no indefensión frente a posibles inconsistencias en las rúbricas o juicios de evaluación.'
  },
  {
    id: 'der_8',
    numeral: 'Numeral 10',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Participación y Representación Democrática',
    description: 'Elegir y ser elegido como Vocero de Grupo o Ficha, y como Representante de los Aprendices del Centro de Formación.',
    practicalApplication: 'Participación en el Consejo Directivo, mesas de concertación y comités con voz y representación estudiantil.'
  },
  {
    id: 'der_9',
    numeral: 'Numeral 15',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Garantía del Debido Proceso Disciplinario',
    description: 'Ser escuchado en descargos, aportar y controvertir pruebas en cualquier procedimiento académico o disciplinario, respetando la presunción de inocencia.',
    practicalApplication: 'Ningún aprendiz puede ser sancionado sin previa citación motivada y oportunidad procesal de presentar descargos.'
  },
  {
    id: 'der_10',
    numeral: 'Numeral 20',
    category: 'derecho',
    article: 'Artículo 7',
    title: 'Certificación Oportuna',
    description: 'Recibir oportunamente la certificación o título académico que le corresponda, una vez culminadas y aprobadas las etapas lectiva y productiva.',
    practicalApplication: 'Trámite digital de paz y salvo y expedición del título de Técnico o Tecnólogo por la plataforma oficial.'
  },

  // DEBERES (Artículo 9 - Acuerdo 007 de 2012)
  {
    id: 'deb_1',
    numeral: 'Numeral 1',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Cumplimiento Integral de Actividades',
    description: 'Cumplir con todas las actividades propias de su proceso de aprendizaje o del plan de mejoramiento, participando activamente en sesiones presenciales o virtuales.',
    practicalApplication: 'Entrega puntual de evidencias de aprendizaje según el cronograma acordado con el equipo ejecutor.'
  },
  {
    id: 'deb_2',
    numeral: 'Numeral 2',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Puntualidad y Justificación de Inasistencias',
    description: 'Asistir con puntualidad a las actividades programadas y presentar justificación por escrito con soportes válidos dentro de los tres (3) días hábiles siguientes.',
    practicalApplication: 'Calamidad doméstica o incapacidad médica expedida o validada por EPS/medicina legal radicada dentro de 72 horas hábiles.'
  },
  {
    id: 'deb_3',
    numeral: 'Numeral 4',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Porte Permanente y Visible del Carné',
    description: 'Portar permanentemente y en lugar visible el carné institucional dentro de las instalaciones del SENA y en los eventos donde actúe como aprendiz.',
    practicalApplication: 'El carné es indispensable para el ingreso a las sedes, préstamo de herramientas en pañoles y uso de equipos.'
  },
  {
    id: 'deb_4',
    numeral: 'Numeral 8',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Uso Obligatorio de EPP y Dotación',
    description: 'Utilizar adecuadamente la dotación y los Elementos de Protección Personal (EPP) exigidos para el ingreso y permanencia en talleres y laboratorios.',
    practicalApplication: 'Gafas de seguridad, calzado dieléctrico, overol o bata según la norma de seguridad y salud en el trabajo del centro.'
  },
  {
    id: 'deb_5',
    numeral: 'Numeral 10',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Cuidado y Protección de Bienes Institucionales',
    description: 'Hacer uso apropiado y cuidar los recursos físicos, tecnológicos, maquinarias, mobiliario e instalaciones del SENA y de las empresas patrocinadoras.',
    practicalApplication: 'Responder por el buen trato de equipos de cómputo, maquinaria CNC, soldadura, cocinas y biblioteca.'
  },
  {
    id: 'deb_6',
    numeral: 'Numeral 14',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Informar Oportunamente Novedades de Práctica',
    description: 'Dar a conocer oportunamente al instructor o coordinador la consecución de contrato de aprendizaje u otra alternativa de etapa productiva.',
    practicalApplication: 'Registrar la alternativa en el aplicativo Caprendizaje y legalizar la matrícula productiva con su respectiva ARL y EPS.'
  },
  {
    id: 'deb_7',
    numeral: 'Numeral 15',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Honestidad Intelectual y Respeto al Derecho de Autor',
    description: 'Desarrollar de manera personal las evidencias, reconociendo y citando las fuentes consultadas y respetando los derechos de propiedad intelectual.',
    practicalApplication: 'Uso obligatorio de normas de citación (APA / IEEE). Prohibido terminantemente el plagio o compra de proyectos formativos.'
  },
  {
    id: 'deb_8',
    numeral: 'Numeral 22',
    category: 'deber',
    article: 'Artículo 9',
    title: 'Respeto a la Comunidad Educativa',
    description: 'Tratar con respeto, decoro y dignidad a todos los miembros de la comunidad educativa (instructores, aprendices, administrativos, directivos y visitantes).',
    practicalApplication: 'Promover un ambiente libre de violencia verbal, acoso, matoneo o discriminación en aulas y plataformas virtuales.'
  },

  // PROHIBICIONES (Artículo 10 - Acuerdo 007 de 2012)
  {
    id: 'proh_1',
    numeral: 'Numeral 1',
    category: 'prohibicion',
    article: 'Artículo 10',
    title: 'Sustancias Psicoactivas y Bebidas Alcohólicas',
    description: 'Ingresar, consumir o comercializar bebidas alcohólicas o sustancias psicoactivas dentro de las instalaciones del SENA o ingresar bajo sus efectos.',
    practicalApplication: 'Constituye falta disciplinaria de la mayor gravedad que pone en riesgo la vida y seguridad en el centro.'
  },
  {
    id: 'proh_2',
    numeral: 'Numeral 2',
    category: 'prohibicion',
    article: 'Artículo 10',
    title: 'Ingreso o Porte de Armas',
    description: 'Portar o ingresar armas de fuego, cortopunzantes, contundentes o artefactos explosivos a las sedes o actividades institucionales.',
    practicalApplication: 'Prohibición absoluta con implicaciones administrativas y penales ante las autoridades judiciales.'
  },
  {
    id: 'proh_3',
    numeral: 'Numeral 4',
    category: 'prohibicion',
    article: 'Artículo 10',
    title: 'Plagio, Fraude y Suplantación',
    description: 'Cometer plagio en actividades o proyectos, suplantar a compañeros en listas o evaluaciones, o alterar firmas y juicios evaluativos.',
    practicalApplication: 'Falta académica grave que acarrea plan de mejoramiento o cancelación de matrícula según la reincidencia.'
  },
  {
    id: 'proh_4',
    numeral: 'Numeral 12',
    category: 'prohibicion',
    article: 'Artículo 10',
    title: 'Agresión Física, Verbal o Acoso Digital',
    description: 'Practicar cualquier acto de violencia física, intimidación, acoso laboral o sexual, o ciberacoso contra miembros de la comunidad.',
    practicalApplication: 'Tolerancia cero institucional frente a cualquier tipo de vulneración a la integridad personal.'
  }
];

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'identidad',
    order: 1,
    title: 'Módulo 1: Identidad y Naturaleza SENA',
    subtitle: 'Misión, visión, símbolos institucionales y formación profesional integral',
    iconName: 'Building2',
    color: '#39A900',
    passingScore: 80,
    lessons: [
      {
        id: 'm1_l1',
        title: '¿Qué es el SENA y cuál es su misión?',
        subtitle: 'El Servicio Nacional de Aprendizaje al servicio de Colombia desde 1957',
        icon: 'Award',
        summary: 'El SENA es un establecimiento público del orden nacional con personería jurídica, patrimonio propio e independiente y autonomía administrativa, adscrito al Ministerio del Trabajo. Ofrece formación profesional integral gratuita a todos los colombianos.',
        keyPoints: [
          {
            title: 'Misión Institucional',
            description: 'Invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral para su incorporación en actividades productivas.',
            tag: 'Misión'
          },
          {
            title: 'Visión Institucional',
            description: 'Ser una entidad referente global en formación para el trabajo, innovación y emprendimiento, con pertinencia tecnológica y enfoque humano.',
            tag: 'Visión'
          },
          {
            title: 'Gratuidad Absoluta',
            description: 'Ningún funcionario o tercero puede cobrar por inscripciones, matrículas, guías, certificados ni intermediación de la Agencia Pública de Empleo (APE).',
            tag: 'Principio Fundamental'
          }
        ],
        practicalTip: 'El SENA no solo capacita en habilidades duras, sino en competencias humanas e integrales para la convivencia laboral y ciudadana.'
      },
      {
        id: 'm1_l2',
        title: 'Símbolos Institucionales y Plataformas',
        subtitle: 'Escudo, bandera, himno y plataformas digitales Zajuna / Sofía Plus',
        icon: 'Compass',
        summary: 'Conocer y respetar los símbolos institucionales representa el orgullo y compromiso con el país y tu formación como futuro egresado.',
        keyPoints: [
          {
            title: 'El Escudo',
            description: 'Refleja los tres sectores económicos de la economía: primario (campo/cafeto), secundario (industria/rueda dentada) y terciario (servicios/caduceo de mercurio).',
            tag: 'Símbolo'
          },
          {
            title: 'El Logotipo',
            description: 'Representa al aprendiz avanzando con los brazos en alto hacia el futuro, apoyado firmemente en el camino del conocimiento.',
            tag: 'Símbolo'
          },
          {
            title: 'Ecosistema Digital: Sofía Plus y Zajuna',
            description: 'Sofía Plus administra matrículas, novedades y certificaciones. Zajuna es la plataforma LMS de ambiente virtual de aprendizaje donde interactúas con guías y foros.',
            tag: 'Tecnología'
          }
        ],
        practicalTip: 'Guarda tus credenciales de Sofía Plus en lugar seguro. Son personales e intransferibles bajo el reglamento.'
      }
    ],
    questions: [
      {
        id: 'q_id_1',
        question: '¿Cuál es el carácter financiero de los programas de formación profesional impartidos por el SENA?',
        options: [
          'Tienen un copago moderado semestral según estrato socioeconómico.',
          'Son completamente gratuitos y nadie puede cobrar por su acceso, matrícula ni certificación.',
          'Requieren pagar una póliza obligatoria de seguro estudiantil privado.',
          'Son gratuitos solo para el nivel técnico, pero pagos para tecnólogos.'
        ],
        correctAnswer: 1,
        explanation: 'En el SENA todos los programas de formación profesional son 100% gratuitos y públicos, garantizados por el Estado colombiano.',
        articleRef: 'Acuerdo 007 de 2012 - Principios Generales',
        points: 50
      },
      {
        id: 'q_id_2',
        question: '¿Qué representan los elementos del escudo institucional del SENA?',
        options: [
          'Las tres cordilleras de Colombia y sus fuentes hídricas.',
          'Los tres sectores económicos del país: Primario (agro), Secundario (industria) y Terciario (servicios).',
          'Los tres tipos de contrato de aprendizaje existentes en la legislación laboral.',
          'Las tres modalidades de evaluación del instructor: inicial, formativa y sumativa.'
        ],
        correctAnswer: 1,
        explanation: 'El escudo del SENA plasma la rueda dentada (industria), el caduceo (comercio y servicios) y la planta de café (sector primario y agrícola).',
        articleRef: 'Identidad y Símbolos SENA',
        points: 50
      },
      {
        id: 'q_id_3',
        question: '¿Cuál es la función primordial de la plataforma Zajuna en el SENA?',
        options: [
          'Gestionar únicamente las cesantías de los instructores.',
          'Servir como plataforma LMS (Ambiente Virtual de Aprendizaje) para contenidos, foros, tareas y retroalimentación.',
          'Reemplazar la firma física de los contratos de aprendizaje de las empresas.',
          'Tramitar únicamente la expedición del carné estudiantil físico.'
        ],
        correctAnswer: 1,
        explanation: 'Zajuna es el Ambiente Virtual de Aprendizaje (LMS) oficial del SENA donde los aprendices acceden a guías de aprendizaje y envían evidencias.',
        articleRef: 'Entorno Digital del Aprendiz',
        points: 50
      }
    ]
  },
  {
    id: 'derechos',
    order: 2,
    title: 'Módulo 2: Derechos del Aprendiz SENA',
    subtitle: 'Artículo 7 del Acuerdo 007 de 2012: Garantías, bienestar, carné y debido proceso',
    iconName: 'Scale',
    color: '#0284c7',
    passingScore: 80,
    lessons: [
      {
        id: 'm2_l1',
        title: 'Derechos Formativos y Académicos (Artículo 7)',
        subtitle: 'Tus garantías desde el momento en que legalizas la matrícula',
        icon: 'ShieldCheck',
        summary: 'El Artículo 7 del Acuerdo 007 de 2012 establece 21 derechos fundamentales y formativos que garantizan tu dignidad humana y excelencia educativa.',
        keyPoints: [
          {
            title: 'Formación Integral Gratuita (Num. 1)',
            description: 'Recibir formación profesional acorde con el diseño curricular, con instructores idóneos y desarrollo de competencias técnicas y humanas.',
            tag: 'Art. 7 Num. 1'
          },
          {
            title: 'Inducción Oportuna y Carné (Num. 2 y 5)',
            description: 'Recibir una inducción clara al ingresar y portar el carné oficial que acredita tu calidad de Aprendiz SENA legalizado.',
            tag: 'Art. 7 Num. 2 y 5'
          },
          {
            title: 'Disposición de Recursos y Bibliotecas (Num. 3)',
            description: 'Utilizar los ambientes de aprendizaje, laboratorios, maquinaria, herramientas tecnológicas, software y el Sistema de Bibliotecas SENA.',
            tag: 'Art. 7 Num. 3'
          },
          {
            title: 'Revisión de Evaluaciones en 2 Días Hábiles (Num. 8 y 9)',
            description: 'Conocer oportunamente las valoraciones y solicitar revisión argumentada ante el instructor dentro de los dos (2) días hábiles siguientes.',
            tag: 'Art. 7 Num. 9'
          }
        ],
        practicalTip: 'Tienes derecho a solicitar la revisión de tus evaluaciones ante el equipo ejecutor si consideras que hubo una discrepancia con la rúbrica de la guía.'
      },
      {
        id: 'm2_l2',
        title: 'Bienestar al Aprendiz y Debido Proceso (Artículo 7)',
        subtitle: 'Servicios de apoyo socioeconómico, salud, vocería y comités',
        icon: 'HeartHandshake',
        summary: 'El SENA garantiza tu permanencia educativa mediante el Plan de Bienestar y el respeto irrestricto al debido proceso consagrado en la Constitución.',
        keyPoints: [
          {
            title: 'Plan de Bienestar al Aprendiz (Num. 4)',
            description: 'Acceso a convocatorias de apoyos de sostenimiento (regular y FIC), monitorías académicas, comedores o bonos alimentarios, cultura y deporte.',
            tag: 'Art. 7 Num. 4'
          },
          {
            title: 'Representación y Liderazgo (Num. 10)',
            description: 'Elegir y ser elegido democráticamente como Vocero de Ficha o Representante de los Aprendices del Centro de Formación.',
            tag: 'Art. 7 Num. 10'
          },
          {
            title: 'Garantía del Debido Proceso (Num. 15)',
            description: 'Ser escuchado en descargos ante cualquier queja, aportar pruebas, ser notificado formalmente por escrito y contar con recurso de reposición.',
            tag: 'Art. 7 Num. 15'
          }
        ],
        practicalTip: 'El debido proceso te protege de sanciones arbitrarias. Ninguna sanción puede aplicarse sin citación previa y derecho a presentar descargos ante el Comité.'
      }
    ],
    questions: [
      {
        id: 'q_der_1',
        question: 'Según el Artículo 7 (Numeral 9) del Acuerdo 007 de 2012, ¿cuántos días hábiles tiene el aprendiz para solicitar la revisión formal de su evaluación ante el instructor?',
        options: [
          'Dentro de los dos (2) días hábiles siguientes a la publicación del resultado.',
          'Hasta un mes después de finalizado el trimestre.',
          'No existe derecho a solicitar revisión de notas.',
          'Diez (10) días calendario.'
        ],
        correctAnswer: 0,
        explanation: 'El Artículo 7 Numeral 9 consagra el derecho a solicitar por escrito la revisión de la evaluación dentro de los dos (2) días hábiles siguientes.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 7 Numeral 9',
        points: 50
      },
      {
        id: 'q_der_2',
        question: '¿Cuál de los siguientes es un beneficio del área de Bienestar al Aprendiz SENA según el Artículo 7 Numeral 4?',
        options: [
          'Venta de diplomas y certificados express.',
          'Convocatorias de apoyos de sostenimiento, monitorías, actividades deportivas, de salud preventiva y culturales.',
          'Préstamos de dinero bancario con interés comercial para compras personales.',
          'Exención de asistir a clases y talleres prácticos.'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 7 Numeral 4 garantiza el acceso a los programas de bienestar para incentivar la permanencia y el desarrollo integral del aprendiz.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 7 Numeral 4',
        points: 50
      },
      {
        id: 'q_der_3',
        question: 'En caso de que a un aprendiz se le señale una presunta falta disciplinaria, ¿qué derecho consagra el Artículo 7 Numeral 15?',
        options: [
          'Sanción automática sumaria sin citación.',
          'Garantía al Debido Proceso, presunción de inocencia, derecho a ser escuchado en descargos y controvertir pruebas.',
          'Cancelación inmediata de la matrícula por simple reporte telefónico.',
          'Publicar el nombre del aprendiz en carteleras públicas.'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 7 Numeral 15 consagra el debido proceso y el derecho a presentar descargos y pruebas en todas las instancias del centro.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 7 Numeral 15',
        points: 50
      }
    ],
    caseStudy: {
      id: 'caso_derechos',
      title: 'Caso de Estudio: La Revisión de la Evidencia Técnica',
      character: 'Laura (Aprendiz de Gestión Logística)',
      scenario: 'Laura entregó a tiempo su proyecto de cadena de suministro con todas las especificaciones de la guía. Sin embargo, el sistema le arrojó "No Aprobado" sin ninguna retroalimentación ni comentario del instructor.',
      situation: 'Laura se siente frustrada porque sabe que su trabajo cumplió la rúbrica y necesita la retroalimentación para mejorar o aclarar.',
      choices: [
        {
          text: 'Acercarse de forma respetuosa al instructor dentro de los dos (2) días hábiles solicitando retroalimentación técnica y revisión de la rúbrica (Art. 7 Num. 9).',
          isCorrect: true,
          feedback: '¡Excelente decisión! El Artículo 7 Numeral 9 del Acuerdo 007 de 2012 faculta al aprendiz para solicitar la revisión formal argumentada en 2 días hábiles.',
          regulationImpact: 'Amparado por el Artículo 7 Numeral 9 del Acuerdo 007 de 2012.'
        },
        {
          text: 'Faltar a las siguientes sesiones del instructor a manera de protesta silenciosa.',
          isCorrect: false,
          feedback: 'Incorrecto. La inasistencia injustificada incurre en incumplimiento de deberes y puede derivar en deserción o plan de mejoramiento.',
          regulationImpact: 'Infracción al deber de asistencia regular (Art. 9).'
        },
        {
          text: 'Presentar una queja anónima en internet sin antes hablar con el instructor ni con el vocero.',
          isCorrect: false,
          feedback: 'Incorrecto. Los conductos regulares institucionales exigen diálogo directo, apoyo del vocero de ficha y coordinación académica.',
          regulationImpact: 'Incumplimiento del conducto regular institucional.'
        }
      ],
      resolutionSummary: 'Laura ejerció su derecho a la revisión técnica por el conducto regular en los 2 días hábiles, el instructor aclaró un error en la plataforma y aprobó la competencia con felicitación.'
    }
  },
  {
    id: 'deberes',
    order: 3,
    title: 'Módulo 3: Deberes y Prohibiciones',
    subtitle: 'Artículos 9 y 10 del Acuerdo 007 de 2012: Asistencia, carné, EPP y faltas éticas',
    iconName: 'ShieldAlert',
    color: '#d97706',
    passingScore: 80,
    lessons: [
      {
        id: 'm3_l1',
        title: 'Deberes del Aprendiz SENA (Artículo 9)',
        subtitle: '28 deberes éticos, académicos y sociales del Acuerdo 007 de 2012',
        icon: 'CheckCircle2',
        summary: 'El Artículo 9 del Acuerdo 007 de 2012 establece los deberes que asume el aprendiz para garantizar la excelencia académica y la convivencia armónica.',
        keyPoints: [
          {
            title: 'Asistencia y Justificación en 3 Días (Num. 1 y 2)',
            description: 'Cumplir con puntualidad el horario lectivo y productivo. Justificar inasistencias por escrito dentro de los 3 días hábiles siguientes con soporte legal o médico.',
            tag: 'Art. 9 Num. 1 y 2'
          },
          {
            title: 'Porte Permanente del Carné en Lugar Visible (Num. 4)',
            description: 'Portar permanentemente y en lugar visible el carné institucional dentro de las sedes SENA y empresas patrocinadoras.',
            tag: 'Art. 9 Num. 4'
          },
          {
            title: 'Cuidado de Bienes y Uso de EPP (Num. 8 y 10)',
            description: 'Cuidar maquinaria, herramientas, equipos de cómputo y aulas. Usar obligatoriamente Elementos de Protección Personal (EPP) en talleres.',
            tag: 'Art. 9 Num. 8 y 10'
          },
          {
            title: 'Honestidad Intelectual y Citación (Num. 15)',
            description: 'Desarrollar de forma personal las evidencias y respetar los derechos de autor con normas de citación (evitar plagio o uso fraudulento de trabajos ajenos).',
            tag: 'Art. 9 Num. 15'
          }
        ],
        practicalTip: 'El carné no solo te identifica; es tu llave de acceso para préstamo de equipos, biblioteca y garantía de seguridad en el centro de formación.'
      },
      {
        id: 'm3_l2',
        title: 'Prohibiciones Expresas (Artículo 10)',
        subtitle: '31 prohibiciones taxativas del Acuerdo 007 de 2012',
        icon: 'AlertTriangle',
        summary: 'El Artículo 10 tipifica las conductas expresamente prohibidas para preservar el orden, la integridad y el buen nombre institucional.',
        keyPoints: [
          {
            title: 'Sustancias, Alcohol y Armas (Num. 1 y 2)',
            description: 'Ingresar, consumir o comercializar bebidas alcohólicas o sustancias psicoactivas, o ingresar armas de cualquier índole al SENA.',
            tag: 'Falta Muy Grave'
          },
          {
            title: 'Plagio y Fraude en Evaluaciones (Num. 4)',
            description: 'Cometer plagio total o parcial en tareas o proyectos, suplantar a compañeros en listas o evaluaciones virtuales o presenciales.',
            tag: 'Falta Académica Grave'
          },
          {
            title: 'Agresión, Violencia o Acoso (Num. 12 y 13)',
            description: 'Practicar cualquier forma de intimidación, acoso laboral o sexual, matoneo físico, verbal o a través de medios digitales a cualquier miembro de la comunidad.',
            tag: 'Falta Gravísima'
          },
          {
            title: 'Uso Indebido de Tecnologías y Redes (Num. 17)',
            description: 'Usar la red institucional para descargar contenido ilícito, juegos no pedagógicos o publicar información falsa que dañe el buen nombre del SENA.',
            tag: 'Prohibición'
          }
        ],
        practicalTip: 'El plagio en un proyecto formativo puede acarrear la cancelación inmediata de matrícula y sanción de no inscripción en el SENA.'
      }
    ],
    questions: [
      {
        id: 'q_deb_1',
        question: 'Según el Artículo 9 Numeral 2 del Acuerdo 007 de 2012, ¿cuántos días hábiles tiene el aprendiz para presentar la justificación con soportes de una inasistencia?',
        options: [
          'Dentro de los tres (3) días hábiles siguientes a la inasistencia.',
          'Hasta treinta (30) días calendario después.',
          'No es necesario justificar si el vocero de ficha avisa por WhatsApp.',
          'El último día del trimestre lectivo.'
        ],
        correctAnswer: 0,
        explanation: 'El Artículo 9 Numeral 2 fija con precisión el término perentorio de tres (3) días hábiles siguientes al hecho para radicar la justificación por escrito.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 9 Numeral 2',
        points: 50
      },
      {
        id: 'q_deb_2',
        question: '¿Qué dispone el Artículo 9 Numeral 4 del Acuerdo 007 de 2012 sobre el carné institucional?',
        options: [
          'Portarlo permanentemente y en lugar visible en todas las sedes del SENA y empresas patrocinadoras.',
          'Es un trámite voluntario que solo sirve para pedir libros en la biblioteca.',
          'Solo se debe mostrar el primer día de inducción.',
          'Se puede prestar a amigos o familiares para que ingresen al centro.'
        ],
        correctAnswer: 0,
        explanation: 'El carné debe portarse en lugar visible de forma obligatoria por motivos de seguridad institucional e identificación del aprendiz.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 9 Numeral 4',
        points: 50
      },
      {
        id: 'q_deb_3',
        question: '¿Cuál de las siguientes acciones está expresamente prohibida en el Artículo 10 (Numerales 1 y 2) del Acuerdo 007 de 2012?',
        options: [
          'Formular preguntas al instructor durante la sesión de clase.',
          'Ingresar al centro en estado de embriaguez, portar armas o consumir sustancias psicoactivas.',
          'Solicitar aplazamiento por motivos de enfermedad certificada.',
          'Postularse como candidato a vocero de grupo.'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 10 Numerales 1 y 2 prohíbe taxativamente el ingreso de armas, alcohol o estupefacientes a las instalaciones del SENA.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 10 Numerales 1 y 2',
        points: 50
      }
    ],
    caseStudy: {
      id: 'caso_deberes',
      title: 'Caso de Estudio: El Trabajo Colaborativo y los Créditos de Autor',
      character: 'Mateo (Aprendiz de Programación de Software)',
      scenario: 'Para la entrega de la fase de análisis, Mateo descargó un repositorio completo de internet desarrollado por otra persona, le cambió el logo y lo entregó como autoría propia de su equipo de trabajo.',
      situation: 'El instructor detectó que el código fue copiado textualmente sin citación ni desarrollo propio de los aprendices.',
      choices: [
        {
          text: 'Asumir la responsabilidad, reconocer el error ante el instructor, y acogerse al plan de mejoramiento pedagógico sobre propiedad intelectual (Art. 9 Num. 15).',
          isCorrect: true,
          feedback: 'Correcto. La honestidad académica es innegociable bajo el Artículo 9 Numeral 15. El aprendiz asume el error y desarrolla la evidencia original con normas de citación.',
          regulationImpact: 'Cumplimiento del Artículo 9 Numeral 15 del Acuerdo 007 de 2012.'
        },
        {
          text: 'Culpar a su compañero de equipo y negar cualquier conocimiento del trabajo.',
          isCorrect: false,
          feedback: 'Incorrecto. El falso testimonio y la deshonestidad agravan la calificación de la falta ante el Comité de Evaluación.',
          regulationImpact: 'Circunstancia de agravación de la falta disciplinaria.'
        },
        {
          text: 'Argumentar que todo lo que esté en internet es libre y no requiere ninguna citación ni trabajo propio.',
          isCorrect: false,
          feedback: 'Incorrecto. La ley colombiana de derechos de autor y el reglamento SENA sancionan expresamente el plagio y la copia no autorizada.',
          regulationImpact: 'Violación directa al Artículo 10 Numeral 4 del Reglamento.'
        }
      ],
      resolutionSummary: 'El instructor citó al equipo a una sesión de retroalimentación pedagógica sobre propiedad intelectual y aplicó un Plan de Mejoramiento Académico para desarrollar la evidencia original.'
    }
  },
  {
    id: 'etapas',
    order: 4,
    title: 'Módulo 4: Etapas de Formación y Trámites',
    subtitle: 'Capítulos V y VI del Acuerdo 007 de 2012: Etapa productiva, aplazamiento y deserción',
    iconName: 'GraduationCap',
    color: '#7c3aed',
    passingScore: 80,
    lessons: [
      {
        id: 'm4_l1',
        title: 'Etapa Lectiva y Etapa Productiva (Capítulo V)',
        subtitle: 'El ciclo completo hacia tu titulación como Técnico o Tecnólogo',
        icon: 'Briefcase',
        summary: 'La formación en el SENA es teórico-práctica. Se compone de dos etapas complementarias reguladas en los Artículos 12 al 18 del Acuerdo 007 de 2012.',
        keyPoints: [
          {
            title: 'Etapa Lectiva (Art. 12)',
            description: 'Periodo de adquisición y desarrollo de competencias en aulas, talleres y ambientes virtuales con guías de aprendizaje y proyectos formativos.',
            tag: 'Fase Teórico-Práctica'
          },
          {
            title: 'Etapa Productiva (Art. 13)',
            description: 'Periodo donde el aprendiz aplica, complementa y consolida sus conocimientos en un entorno productivo real durante mínimo seis (6) meses.',
            tag: 'Fase Aplicada'
          },
          {
            title: 'Seguimiento a la Productiva (Art. 15)',
            description: 'Durante la etapa productiva un instructor de seguimiento evalúa tus bitácoras quincenales y realiza visitas de concertación y evaluación final.',
            tag: 'Requisito de Certificación'
          }
        ],
        practicalTip: 'No puedes graduarte sin haber culminado y aprobado con juicio de "Aprobado" tanto la etapa lectiva como la etapa productiva.'
      },
      {
        id: 'm4_l2',
        title: 'Alternativas de Etapa Productiva y Trámites (Capítulo VI)',
        subtitle: 'Contrato de aprendizaje, proyecto, pasantía, aplazamiento y traslados',
        icon: 'FileText',
        summary: 'El Artículo 14 consagra las alternativas válidas de etapa productiva, y el Capítulo VI regula los trámites académicos y administrativos.',
        keyPoints: [
          {
            title: 'Alternativas de Práctica (Art. 14)',
            description: '1. Contrato de Aprendizaje (apoyo económico + EPS/ARL). 2. Vínculo Laboral relacionado. 3. Pasantía en entidad pública/ONG. 4. Proyecto Productivo / Fondo Emprender. 5. Monitoría en el SENA.',
            tag: 'Art. 14 Acuerdo 007'
          },
          {
            title: 'Aplazamiento por Justa Causa (Art. 21)',
            description: 'Solicitud formal para suspender el proceso formativo por justa causa demostrable (salud, servicio militar, etc.) hasta por un máximo de seis (6) meses continuos.',
            tag: 'Art. 21'
          },
          {
            title: 'Traslado y Reingreso (Art. 22 y 23)',
            description: 'Solicitar cambio de ficha, jornada o centro previa verificación de cupos y similitud curricular de competencias.',
            tag: 'Trámite Académico'
          },
          {
            title: 'Deserción por Inasistencia (Art. 24)',
            description: 'Inasistencia injustificada durante tres (3) días hábiles consecutivos en lectiva o abandono injustificado en productiva.',
            tag: 'Art. 24 Deserción'
          }
        ],
        practicalTip: 'Gestiona tu alternativa de etapa productiva a través del aplicativo Caprendizaje y la Agencia Pública de Empleo (APE).'
      }
    ],
    questions: [
      {
        id: 'q_eta_1',
        question: '¿Cuál de las siguientes NO es una alternativa válida de Etapa Productiva según el Artículo 14 del Acuerdo 007 de 2012?',
        options: [
          'Contrato de Aprendizaje con empresa patrocinadora.',
          'Proyecto Productivo o creación de empresa avalado por el SENA.',
          'Trabajo informal en una labor sin ninguna relación con las competencias del programa.',
          'Pasantía técnica en una institución pública o privada.'
        ],
        correctAnswer: 2,
        explanation: 'El Artículo 14 exige que toda alternativa de etapa productiva esté directamente vinculada a las competencias y perfil ocupacional del programa cursado.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 14',
        points: 50
      },
      {
        id: 'q_eta_2',
        question: 'Según el Artículo 21 del Acuerdo 007 de 2012, ¿cuál es el tiempo máximo de aplazamiento que puede solicitar un aprendiz por justa causa?',
        options: [
          'Hasta por un periodo máximo de seis (6) meses continuos prorrogables excepcionalmente por causa de fuerza mayor.',
          'Hasta por dos (2) años consecutivos sin justificar.',
          'Por el tiempo indefinido que determine el vocero de la ficha.',
          'Solo se permite aplazar por 24 horas.'
        ],
        correctAnswer: 0,
        explanation: 'El Artículo 21 estipula que el aplazamiento se concede hasta por seis (6) meses con el debido soporte documental.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 21',
        points: 50
      },
      {
        id: 'q_eta_3',
        question: '¿Qué consecuencia establece el Artículo 24 si un aprendiz acumula tres (3) días hábiles consecutivos de inasistencia injustificada?',
        options: [
          'El instructor le asigna automáticamente la calificación máxima.',
          'Se inicia el trámite de reporte de Deserción, otorgándole 5 días hábiles para justificar antes de la cancelación de matrícula.',
          'Se le traslada automáticamente de centro de formación.',
          'Se le suspende el carné por un solo día lectivo.'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 24 define como causal de deserción la inasistencia injustificada por más de tres días consecutivos y fija el debido requerimiento de descargos.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 24 (Deserción)',
        points: 50
      }
    ]
  },
  {
    id: 'faltas_medidas',
    order: 5,
    title: 'Módulo 5: Faltas, Medidas Formativas y Comités',
    subtitle: 'Capítulos VIII, IX y X del Acuerdo 007 de 2012: Calificación, medidas, sanciones y recursos',
    iconName: 'Gavel',
    color: '#e11d48',
    passingScore: 80,
    lessons: [
      {
        id: 'm5_l1',
        title: 'Clasificación de Faltas (Capítulo VIII)',
        subtitle: 'Faltas académicas vs. disciplinarias: leves, graves y gravísimas',
        icon: 'AlertOctagon',
        summary: 'Los Artículos 27 al 32 del Acuerdo 007 de 2012 tipifican las faltas y los criterios objetivos para su calificación en leves, graves y gravísimas.',
        keyPoints: [
          {
            title: 'Faltas Académicas (Art. 27)',
            description: 'Incumplimiento injustificado de deberes de aprendizaje, no entrega de evidencias o fraude en pruebas formativas.',
            tag: 'Académico'
          },
          {
            title: 'Faltas Disciplinarias (Art. 28)',
            description: 'Conductas que vulneran los deberes de convivencia, transgresión de prohibiciones o alteración del orden institucional.',
            tag: 'Disciplinario'
          },
          {
            title: 'Criterios de Calificación (Art. 30)',
            description: 'Se evalúa: el daño causado, el grado de participación, la reincidencia, si actuó bajo coacción o si intentó ocultar la falta.',
            tag: 'Leve / Grave / Gravísima'
          }
        ],
        practicalTip: 'El SENA privilegia siempre el sentido pedagógico y formativo antes que el punitivo.'
      },
      {
        id: 'm5_l2',
        title: 'Medidas Formativas y Sanciones (Capítulos IX y X)',
        subtitle: 'Planes de mejoramiento, llamados de atención y Comité de Evaluación',
        icon: 'Landmark',
        summary: 'El Acuerdo 007 de 2012 diferencia con claridad las medidas formativas (preventivas) de las sanciones disciplinarias impuestas por el Subdirector.',
        keyPoints: [
          {
            title: 'Medidas Formativas Pedagógicas (Art. 33)',
            description: '1. Llamado de atención verbal (sin antecedente en hoja de vida). 2. Plan de mejoramiento académico o disciplinario (nuevas metas y fechas concertadas).',
            tag: 'Art. 33 Preventivo'
          },
          {
            title: 'Sanciones Disciplinarias (Art. 34)',
            description: '1. Llamado de atención escrito con copia a la hoja de vida. 2. Condicionamiento de matrícula. 3. Cancelación de matrícula (con inhabilidad de 6 meses a 3 años para reingreso).',
            tag: 'Art. 34 Sanción'
          },
          {
            title: 'Comité de Evaluación y Seguimiento (Art. 38)',
            description: 'Órgano asesor colegiado del Centro de Formación que analiza casos, escucha al aprendiz en descargos y recomienda medidas motivadas al Subdirector.',
            tag: 'Art. 38 Comité'
          },
          {
            title: 'Recurso de Reposición en 5 Días Hábiles (Art. 43)',
            description: 'Contra la resolución sancionatoria del Subdirector procede el recurso de reposición interpuesto por escrito dentro de los cinco (5) días hábiles siguientes.',
            tag: 'Art. 43 Defensa'
          }
        ],
        practicalTip: 'Aprovecha siempre el Plan de Mejoramiento. Es tu oportunidad de nivelar y demostrar tu compromiso formativo.'
      }
    ],
    questions: [
      {
        id: 'q_fal_1',
        question: 'Según el Artículo 33 del Acuerdo 007 de 2012, ¿cuál de las siguientes opciones es una MEDIDA FORMATIVA y NO una sanción disciplinaria?',
        options: [
          'Cancelación inmediata de la matrícula con sanción en el sistema.',
          'Plan de Mejoramiento Académico o Disciplinario concertado con el instructor.',
          'Llamado de atención escrito radicado en la hoja de vida del aprendiz.',
          'Suspensión definitiva del contrato de aprendizaje.'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 33 define el Plan de Mejoramiento como una medida formativa pedagógica concertada orientada a subsanar falencias sin carácter de sanción formal.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 33',
        points: 50
      },
      {
        id: 'q_fal_2',
        question: 'Según los Artículos 34 y 38 del Acuerdo 007 de 2012, ¿quién es la única autoridad competente para imponer las sanciones disciplinarias en el centro?',
        options: [
          'El personal de vigilancia de la portería.',
          'Cualquier aprendiz vocero de la jornada.',
          'El Subdirector del Centro de Formación correspondiente, previo concepto del Comité de Evaluación y Seguimiento.',
          'El instructor técnico sin consultar a nadie.'
        ],
        correctAnswer: 2,
        explanation: 'El Subdirector de Centro es el único funcionario con competencia legal sancionatoria mediante acto administrativo motivado, tras el debido concepto del Comité.',
        articleRef: 'Acuerdo 007 de 2012 - Artículos 34 y 38',
        points: 50
      },
      {
        id: 'q_fal_3',
        question: '¿Cuántos días hábiles tiene el aprendiz para interponer el Recurso de Reposición contra un acto sancionatorio según el Artículo 43 del Acuerdo 007 de 2012?',
        options: [
          'Cinco (5) días hábiles contados a partir de la notificación personal del acto administrativo.',
          'Treinta (30) días calendario.',
          'No existe posibilidad alguna de presentar recurso legal.',
          'Un año después de terminado el programa.'
        ],
        correctAnswer: 0,
        explanation: 'El Artículo 43 fija un plazo perentorio de cinco (5) días hábiles siguientes a la notificación formal de la resolución sancionatoria para presentar el recurso de reposición.',
        articleRef: 'Acuerdo 007 de 2012 - Artículo 43',
        points: 50
      }
    ],
    caseStudy: {
      id: 'caso_comite',
      title: 'Simulador del Comité: La Inasistencia por Calamidad Doméstica',
      character: 'Julián (Aprendiz de Mecatrónica Industrial)',
      scenario: 'Julián faltó durante 4 días seguidos debido a una urgencia médica grave de su madre en otra ciudad. Al regresar al centro, encontró un correo notificándole citación a Comité de Evaluación y Seguimiento por presunta deserción.',
      situation: 'El Comité está reunido para estudiar la situación de Julián. Tú eres el miembro asesor del Comité bajo el Acuerdo 007 de 2012.',
      choices: [
        {
          text: 'Presentar ante el Comité la constancia médica de la clínica, explicar la situación de fuerza mayor y solicitar la reposición de las guías mediante un Plan de Mejoramiento (Art. 33).',
          isCorrect: true,
          feedback: '¡Perfecto! La calamidad doméstica y la fuerza mayor debidamente soportadas desvirtúan la deserción injustificada. El Comité acogerá la justificación y autorizará el plan de contingencia formativa.',
          regulationImpact: 'Amparo de causal eximente de responsabilidad en el Acuerdo 007 de 2012.'
        },
        {
          text: 'No asistir a la citación del Comité porque "de todas formas ya tienen la decisión tomada".',
          isCorrect: false,
          feedback: 'Incorrecto. No presentarse a rendir descargos impide que el Comité conozca las causas de fuerza mayor y la falta será juzgada con las pruebas existentes.',
          regulationImpact: 'Pérdida de la oportunidad procesal de rendir descargos (Art. 38).'
        },
        {
          text: 'Entregar una justificación falsa comprada en la calle para evitar cualquier trámite.',
          isCorrect: false,
          feedback: 'Incorrecto. La falsedad en documento público o privado es una falta disciplinaria gravísima que genera cancelación inmediata de matrícula e implicaciones penales.',
          regulationImpact: 'Incurre en falta gravísima del Artículo 10.'
        }
      ],
      resolutionSummary: 'Julián presentó sus descargos formales con los certificados médicos, el Comité archivó el reporte de deserción y el instructor le programó un plan de mejoramiento exitoso.'
    }
  }
];

export const SENA_BADGES: Badge[] = [
  {
    id: 'badge_escudo',
    title: 'Identidad y Orgullo SENA',
    description: 'Superaste el Módulo 1 sobre la historia, misión y valores institucionales del SENA.',
    icon: 'Building2',
    category: 'progress',
    unlocked: false
  },
  {
    id: 'badge_derechos',
    title: 'Defensor de Derechos',
    description: 'Completaste con éxito el Módulo 2 y dominas los 21 derechos del Artículo 7 del Acuerdo 007 de 2012.',
    icon: 'Scale',
    category: 'progress',
    unlocked: false
  },
  {
    id: 'badge_reglamento',
    title: 'Guardián del Reglamento',
    description: 'Dominaste los 28 deberes y prohibiciones de los Artículos 9 y 10 del Acuerdo 007 de 2012.',
    icon: 'ShieldCheck',
    category: 'progress',
    unlocked: false
  },
  {
    id: 'badge_etapas',
    title: 'Rumbo a la Productiva',
    description: 'Conoces las alternativas de etapa práctica, trámites de aplazamiento y normativas de los Capítulos V y VI.',
    icon: 'GraduationCap',
    category: 'progress',
    unlocked: false
  },
  {
    id: 'badge_comite',
    title: 'Maestro de la Convivencia',
    description: 'Resolviste los dilemas del Comité de Evaluación y conoces las medidas formativas y sanciones.',
    icon: 'Gavel',
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'badge_induccion_completa',
    title: 'Aprendiz Integral Certificado',
    description: 'Aprobaste la totalidad de los 5 módulos de inducción del SENA con calificación sobresaliente.',
    icon: 'Award',
    category: 'special',
    unlocked: false
  }
];

export const SENA_GLOSSARY: GlossaryItem[] = [
  {
    term: 'Aprendiz SENA',
    chapter: 'Capítulo I',
    definition: 'Toda persona natural matriculada en programas de formación profesional integral, ya sea en modalidad presencial, virtual o a distancia en cualquiera de sus niveles.',
    practicalExample: 'Adquieres la condición de aprendiz legalmente al formalizar la matrícula y culminar tu proceso de inducción institucional.'
  },
  {
    term: 'Debido Proceso',
    chapter: 'Capítulo II y X',
    definition: 'Garantía fundamental (Artículo 7 Numeral 15 y Artículo 38) que asegura que nadie sea sancionado sin haber sido citado formalmente, oído en descargos y con oportunidad de controvertir pruebas y apelar.',
    practicalExample: 'Si se formula una queja en tu contra, debes ser citado formalmente al Comité y contar con tiempo para preparar tu defensa escrita o verbal.'
  },
  {
    term: 'Derecho a Revisión de Evaluación',
    chapter: 'Capítulo II',
    definition: 'Facultad consagrada en el Artículo 7 Numeral 9 que permite al aprendiz solicitar la revisión de una calificación o juicio valorativo dentro de los dos (2) días hábiles siguientes.',
    practicalExample: 'Si el resultado de una evidencia no refleja los criterios de la guía, radicas solicitud respetuosa ante el instructor para reevaluación.'
  },
  {
    term: 'Justificación de Inasistencia',
    chapter: 'Capítulo III',
    definition: 'Deber fijado en el Artículo 9 Numeral 2 de presentar por escrito la incapacidad médica o prueba de fuerza mayor dentro de los tres (3) días hábiles siguientes a la inasistencia.',
    practicalExample: 'Si tuviste una cita médica prioritaria el martes, tienes plazo hasta el viernes hábil para radicar el certificado médico formal.'
  },
  {
    term: 'Contrato de Aprendizaje',
    chapter: 'Capítulo V',
    definition: 'Alternativa de etapa productiva regulada por la Ley 789 de 2002 y el Artículo 14 del Acuerdo 007 de 2012 donde una empresa patrocinadora brinda apoyo económico y cobertura integral en EPS y ARL.',
    practicalExample: 'Durante la etapa lectiva recibes el apoyo de sostenimiento mínimo legal y en productiva desarrollas actividades afines a tu formación técnica.'
  },
  {
    term: 'Plan de Mejoramiento',
    chapter: 'Capítulo IX',
    definition: 'Medida formativa pedagógica concertada (Artículo 33) entre el aprendiz y el instructor para fijar nuevas actividades de aprendizaje que subsanen falencias dentro de un plazo perentorio.',
    practicalExample: 'Si no alcanzaste el resultado de aprendizaje en algoritmos, se firma un acta con nueva fecha de sustentación sin constituir antecedente disciplinario.'
  },
  {
    term: 'Deserción',
    chapter: 'Capítulo VI',
    definition: 'Causal de cancelación de matrícula (Artículo 24) por inasistencia injustificada durante tres (3) días hábiles consecutivos en etapa lectiva o abandono en etapa productiva.',
    practicalExample: 'Si tienes una emergencia familiar, avisa de inmediato al instructor antes de que el sistema active la alerta de deserción al tercer día hábil.'
  },
  {
    term: 'Comité de Evaluación y Seguimiento',
    chapter: 'Capítulo X',
    definition: 'Órgano consultor colegiado (Artículo 38) del Centro de Formación encargado de evaluar el desempeño académico y disciplinario de los aprendices y recomendar medidas al Subdirector.',
    practicalExample: 'En el Comité participan el vocero de ficha y el representante del centro velando por las garantías procesales del aprendiz.'
  },
  {
    term: 'Recurso de Reposición',
    chapter: 'Capítulo X',
    definition: 'Mecanismo legal de defensa consagrado en el Artículo 43 que permite controvertir una sanción impuesta por el Subdirector de Centro dentro de los cinco (5) días hábiles siguientes a su notificación.',
    practicalExample: 'Si consideras que la sanción impuesta desconoció pruebas aportadas, radicas un escrito de reposición ante el despacho del Subdirector.'
  },
  {
    term: 'Vocero de Ficha',
    chapter: 'Capítulo II',
    definition: 'Aprendiz elegido democráticamente por sus compañeros de grupo (Artículo 7 Numeral 10) para actuar como puente constructivo de comunicación con el equipo de instructores y directivas.',
    practicalExample: 'El vocero recoge las inquietudes del grupo y participa con voz en las reuniones pedagógicas periódicas del centro.'
  }
];

export const STRUCTURED_PLAN_CONTENT = {
  title: 'Plan Estructurado de Inducción SENA',
  subtitle: 'Estrategia pedagógica gamificada alineada al Reglamento del Aprendiz (Acuerdo 007 de 2012 del Consejo Directivo Nacional)',
  phases: [
    {
      phaseNumber: 'Fase 1',
      name: 'Alistamiento, Identidad y Caracterización',
      duration: 'Jornada 1',
      objective: 'Familiarizar al aprendiz con la historia, misión, principios de gratuidad y el entorno del Centro de Formación.',
      activities: [
        'Registro y personalización del perfil institucional (Ficha, Regional, Centro y Programa).',
        'Inmersión en los símbolos institucionales (Escudo, Bandera, Himno, Mascota y Plataformas Zajuna/Sofía Plus).',
        'Diagnóstico inicial de expectativas formativas y competencias previas.'
      ],
      legalGrounding: 'Capítulo I - Principios y Naturaleza de la Formación Profesional Integral (Acuerdo 007 de 2012).'
    },
    {
      phaseNumber: 'Fase 2',
      name: 'Apropiación de Derechos, Deberes y Convivencia',
      duration: 'Jornadas 2 y 3',
      objective: 'Empoderar al aprendiz en sus garantías formativas, bienestar, y en sus compromisos éticos con el centro y el país.',
      activities: [
        'Desglose analítico de los Derechos (Artículo 7 Numerales 1 al 21): formación gratuita, carnetización, biblioteca, apoyos de bienestar y debido proceso.',
        'Análisis de Deberes (Artículo 9 Numerales 1 al 28) y Prohibiciones (Artículo 10 Numerales 1 al 31): asistencia, porte visible del carné, uso de EPP y respeto ético.',
        'Trivia gamificada por niveles con multiplicador de combo y badges de reconocimiento.'
      ],
      legalGrounding: 'Capítulos II, III y IV del Reglamento del Aprendiz SENA (Acuerdo 007 de 2012).'
    },
    {
      phaseNumber: 'Fase 3',
      name: 'Ruta hacia la Etapa Productiva y Trámites',
      duration: 'Jornada 4',
      objective: 'Conocer las 5 alternativas oficiales para desarrollar la etapa práctica y los conductos regulares para trámites administrativos.',
      activities: [
        'Comparador de alternativas (Artículo 14): Contrato de Aprendizaje, Vínculo Laboral, Pasantía, Proyecto Productivo SENA / Fondo Emprender y Monitoría.',
        'Simulación de trámites (Capítulo VI): Aplazamiento justificado (hasta 6 meses, Art. 21), Traslado, Reingreso y prevención de deserción (Art. 24).',
        'Taller interactivo de uso del aplicativo Caprendizaje y hoja de vida institucional.'
      ],
      legalGrounding: 'Capítulos V y VI del Reglamento del Aprendiz SENA (Acuerdo 007 de 2012).'
    },
    {
      phaseNumber: 'Fase 4',
      name: 'Simulador del Comité y Resolución de Dilemas',
      duration: 'Jornada 5',
      objective: 'Fortalecer el juicio ético y el conocimiento del debido proceso ante faltas, planes de mejoramiento y comités.',
      activities: [
        'Simulador de casos de estudio reales: Plagio vs. Citación ética, Inasistencia justificada por fuerza mayor, y manejo de conflictos.',
        'Distinción clara entre Medidas Formativas (Plan de Mejoramiento, Art. 33) y Sanciones Disciplinarias (Llamado escrito, condicionamiento y cancelación, Art. 34).',
        'Evaluación sumativa gamificada con retroalimentación inmediata basada en artículos y numerales del Acuerdo 007 de 2012.'
      ],
      legalGrounding: 'Capítulos VIII, IX y X del Reglamento del Aprendiz SENA (Acuerdo 007 de 2012).'
    },
    {
      phaseNumber: 'Fase 5',
      name: 'Evaluación de Salida y Certificación Digital Oficial',
      duration: 'Cierre de Inducción',
      objective: 'Verificar el cumplimiento del estándar de inducción y expedir el certificado oficial verificable al aprendiz.',
      activities: [
        'Verificación de aprobación con puntaje igual o superior al 80% en los 5 módulos.',
        'Generación automática del Certificado Digital de Inducción con código QR y Hash criptográfico de verificación.',
        'Descarga e impresión en PDF del certificado para ser adjuntado a la carpeta del aprendiz en Sofía Plus / Zajuna.'
      ],
      legalGrounding: 'Acuerdo 007 de 2012 - Sistema de Evaluación y Certificación de la Formación Profesional Integral.'
    }
  ]
};
