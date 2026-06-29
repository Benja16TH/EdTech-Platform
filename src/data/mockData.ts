import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Liderazgo y Gestión de Equipos',
    description: 'Curso integral para desarrollar habilidades de liderazgo, comunicación efectiva y gestión de equipos de alto rendimiento en entornos corporativos.',
    category: 'Gestión',
    level: 'Avanzado',
    duration: '4 horas',
    learningObjectives: [
      'Identificar los diferentes estilos de liderazgo y cuándo aplicarlos',
      'Desarrollar habilidades de comunicación asertiva',
      'Aprender técnicas de motivación y gestión de conflictos',
      'Implementar estrategias de coaching y mentoría en equipos',
    ],
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Fundamentos del Liderazgo',
        orderIndex: 1,
        lessons: [
          { id: 'l1', title: 'Introducción al liderazgo efectivo', description: 'Conoce los fundamentos del liderazgo y su impacto en el entorno laboral actual.', duration: '15 min' },
          { id: 'l2', title: 'Estilos de liderazgo', description: 'Explora los diferentes estilos de liderazgo y aprende a identificar cuál se adapta mejor a cada situación.', duration: '20 min' },
          { id: 'l3', title: 'Comunicación asertiva', description: 'Desarrolla habilidades de comunicación asertiva para mejorar las relaciones interpersonales en tu equipo.', duration: '18 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Gestión de Equipos',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Formación de equipos de alto rendimiento', description: 'Aprende las claves para construir equipos sólidos que trabajen de forma coordinada hacia objetivos comunes.', duration: '22 min' },
          { id: 'l5', title: 'Motivación y compromiso', description: 'Descubre técnicas efectivas para mantener la motivación y el compromiso dentro de tu equipo de trabajo.', duration: '25 min' },
          { id: 'l6', title: 'Resolución de conflictos', description: 'Domina estrategias para identificar, abordar y resolver conflictos de manera constructiva.', duration: '20 min' },
        ],
      },
      {
        id: 'm3',
        title: 'Módulo 3: Desarrollo de Talento',
        orderIndex: 3,
        lessons: [
          { id: 'l7', title: 'Coaching y mentoría', description: 'Implementa programas de coaching y mentoría para potenciar el desarrollo profesional de tu equipo.', duration: '30 min' },
          { id: 'l8', title: 'Evaluación del desempeño', description: 'Conoce metodologías efectivas para evaluar el rendimiento y proporcionar retroalimentación constructiva.', duration: '25 min' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Excel Avanzado para Negocios',
    description: 'Domina las funciones avanzadas de Excel para análisis de datos, tablas dinámicas y automatización de reportes empresariales.',
    category: 'Tecnología',
    level: 'Avanzado',
    duration: '6 horas',
    learningObjectives: [
      'Aplicar funciones lógicas y de búsqueda avanzadas',
      'Crear y gestionar tablas dinámicas para análisis de datos',
      'Automatizar reportes con validación y filtros avanzados',
      'Optimizar flujos de trabajo con fórmulas anidadas',
    ],
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Funciones Avanzadas',
        orderIndex: 1,
        lessons: [
          { id: 'l1', title: 'Funciones lógicas y condicionales', description: 'Aprende a usar SI, Y, O y otras funciones lógicas para automatizar decisiones en tus hojas de cálculo.', duration: '30 min' },
          { id: 'l2', title: 'BUSCARV y BUSCARH', description: 'Domina las funciones de búsqueda vertical y horizontal para encontrar datos rápidamente en grandes tablas.', duration: '25 min' },
          { id: 'l3', title: 'Funciones de texto', description: 'Conoce las funciones para manipular texto: concatenar, extraer, limpiar y transformar datos.', duration: '20 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Análisis de Datos',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Tablas dinámicas', description: 'Crea y gestiona tablas dinámicas para analizar grandes volúmenes de datos de forma interactiva.', duration: '40 min' },
          { id: 'l5', title: 'Filtrado y validación', description: 'Implementa filtros avanzados y validación de datos para mantener la integridad de tus reportes.', duration: '25 min' },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Servicio al Cliente de Excelencia',
    description: 'Aprende las mejores prácticas para brindar un servicio al cliente excepcional, manejar situaciones difíciles y fidelizar clientes.',
    category: 'Atención al Cliente',
    level: 'Intermedio',
    duration: '3 horas',
    learningObjectives: [
      'Comprender la importancia del servicio al cliente en el entorno empresarial',
      'Desarrollar habilidades de comunicación efectiva y empatía',
      'Aprender técnicas de gestión de quejas y reclamaciones',
      'Implementar estrategias de fidelización de clientes',
    ],
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Fundamentos del Servicio',
        orderIndex: 1,
        lessons: [
          { id: 'l1', title: 'La importancia del servicio al cliente', description: 'Comprende por qué un servicio excepcional es la clave del éxito empresarial y la fidelización.', duration: '15 min' },
          { id: 'l2', title: 'Comunicación efectiva con clientes', description: 'Desarrolla habilidades de comunicación verbal y no verbal para atender a tus clientes con profesionalismo.', duration: '20 min' },
          { id: 'l3', title: 'Empatía y escucha activa', description: 'Aprende a ponerte en el lugar del cliente y a escuchar activamente para entender sus necesidades reales.', duration: '18 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Manejo de Situaciones Difíciles',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Gestión de quejas y reclamaciones', description: 'Aprende el protocolo para manejar quejas de manera profesional y convertirlas en oportunidades de mejora.', duration: '25 min' },
          { id: 'l5', title: 'De-escalada de conflictos', description: 'Domina técnicas para reducir la tensión en situaciones conflictivas y encontrar soluciones colaborativas.', duration: '22 min' },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Transformación Digital',
    description: 'Conoce las claves de la transformación digital en las empresas y cómo implementar estrategias de innovación tecnológica.',
    category: 'Tecnología',
    level: 'Intermedio',
    duration: '5 horas',
    learningObjectives: [
      'Entender los fundamentos de la transformación digital',
      'Identificar tecnologías emergentes y su impacto empresarial',
      'Desarrollar estrategias de implementación digital',
      'Aprender a gestionar el cambio organizacional',
    ],
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Introducción a la Transformación Digital',
        orderIndex: 1,
        lessons: [
          { id: 'l1', title: '¿Qué es la transformación digital?', description: 'Descubre los fundamentos de la transformación digital y por qué es crucial para la competitividad empresarial.', duration: '20 min' },
          { id: 'l2', title: 'Tecnologías emergentes', description: 'Explora las tecnologías que están revolucionando los negocios: IA, IoT, blockchain y cloud computing.', duration: '25 min' },
          { id: 'l3', title: 'Impacto en los procesos empresariales', description: 'Analiza cómo la digitalización transforma los procesos operativos y la experiencia del cliente.', duration: '22 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Estrategia e Implementación',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Planificación de la transformación', description: 'Aprende a diseñar una hoja de ruta para implementar la transformación digital en tu organización.', duration: '30 min' },
          { id: 'l5', title: 'Gestión del cambio organizacional', description: 'Conoce estrategias para gestionar la resistencia al cambio y liderar la adopción de nuevas tecnologías.', duration: '28 min' },
          { id: 'l6', title: 'Casos de éxito', description: 'Analiza casos reales de empresas que lograron una transformación digital exitosa y las lecciones aprendidas.', duration: '25 min' },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Seguridad e Higiene en el Trabajo',
    description: 'Capacitación esencial en normativas de seguridad laboral, prevención de riesgos y uso correcto de equipos de protección personal.',
    category: 'Seguridad',
    level: 'Básico',
    duration: '2 horas',
    learningObjectives: [
      'Conocer la normativa de seguridad laboral vigente',
      'Identificar y prevenir riesgos laborales comunes',
      'Aprender el uso correcto de equipos de protección personal',
      'Aplicar protocolos de emergencia en el trabajo',
    ],
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/1260309/pexels-photo-1260309.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Normas de Seguridad',
        orderIndex: 1,
        lessons: [
          { id: 'l1', title: 'Normativa de seguridad laboral', description: 'Conoce las normativas vigentes en seguridad laboral y las obligaciones legales de la empresa y los trabajadores.', duration: '20 min' },
          { id: 'l2', title: 'Prevención de riesgos', description: 'Identifica los riesgos laborales más comunes y aprende las medidas preventivas para evitarlos.', duration: '25 min' },
          { id: 'l3', title: 'Equipo de protección personal', description: 'Aprende a seleccionar, usar y mantener correctamente los equipos de protección personal según cada tarea.', duration: '18 min' },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Gestión del Tiempo y Productividad',
    description: 'Aprende técnicas probadas para optimizar tu tiempo, priorizar tareas y aumentar tu productividad personal y profesional.',
    category: 'Desarrollo Personal',
    level: 'Básico',
    duration: '3 horas',
    learningObjectives: [
      'Dominar técnicas de gestión del tiempo como la Matriz de Eisenhower',
      'Aprender a priorizar tareas de forma efectiva',
      'Desarrollar hábitos productivos duraderos',
      'Eliminar distracciones y mejorar el enfoque',
    ],
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/1043514/pexels-photo-1043514.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Principios de Productividad',
        orderIndex: 1,
        lessons: [
          { id: 'l1', title: 'Técnicas de gestión del tiempo', description: 'Descubre las técnicas más efectivas para administrar tu tiempo y aumentar tu productividad diaria.', duration: '22 min' },
          { id: 'l2', title: 'Priorización de tareas', description: 'Aprende a identificar qué tareas son realmente importantes y urgentes para enfocar tu energía donde importa.', duration: '18 min' },
          { id: 'l3', title: 'Matriz de Eisenhower', description: 'Domina la matriz de Eisenhower para clasificar tareas y tomar decisiones rápidas sobre qué hacer primero.', duration: '20 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Optimización y Hábitos',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Creación de hábitos productivos', description: 'Aprende a construir hábitos sostenibles que mejoren tu productividad personal y profesional a largo plazo.', duration: '25 min' },
          { id: 'l5', title: 'Eliminación de distracciones', description: 'Identifica las principales fuentes de distracción y aplica técnicas para mantener el enfoque en tus tareas.', duration: '20 min' },
        ],
      },
    ],
  },
];
export const mockUsers = [
  {
    id: '1',
    email: 'maria.garcia@empresa.com',
    name: 'María García',
    password: 'password123',
    role: 'collaborator' as const,
  },
  {
    id: '2',
    email: 'juan.admin@empresa.com',
    name: 'Juan Administrador',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '3',
    email: 'carlos.torres@empresa.com',
    name: 'Carlos Torres',
    password: 'password123',
    role: 'collaborator' as const,
  },
];
