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
          { id: 'l1', title: 'Introducción al liderazgo efectivo', duration: '15 min' },
          { id: 'l2', title: 'Estilos de liderazgo', duration: '20 min' },
          { id: 'l3', title: 'Comunicación asertiva', duration: '18 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Gestión de Equipos',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Formación de equipos de alto rendimiento', duration: '22 min' },
          { id: 'l5', title: 'Motivación y compromiso', duration: '25 min' },
          { id: 'l6', title: 'Resolución de conflictos', duration: '20 min' },
        ],
      },
      {
        id: 'm3',
        title: 'Módulo 3: Desarrollo de Talento',
        orderIndex: 3,
        lessons: [
          { id: 'l7', title: 'Coaching y mentoría', duration: '30 min' },
          { id: 'l8', title: 'Evaluación del desempeño', duration: '25 min' },
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
          { id: 'l1', title: 'Funciones lógicas y condicionales', duration: '30 min' },
          { id: 'l2', title: 'BUSCARV y BUSCARH', duration: '25 min' },
          { id: 'l3', title: 'Funciones de texto', duration: '20 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Análisis de Datos',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Tablas dinámicas', duration: '40 min' },
          { id: 'l5', title: 'Filtrado y validación', duration: '25 min' },
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
          { id: 'l1', title: 'La importancia del servicio al cliente', duration: '15 min' },
          { id: 'l2', title: 'Comunicación efectiva con clientes', duration: '20 min' },
          { id: 'l3', title: 'Empatía y escucha activa', duration: '18 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Manejo de Situaciones Difíciles',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Gestión de quejas y reclamaciones', duration: '25 min' },
          { id: 'l5', title: 'De-escalada de conflictos', duration: '22 min' },
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
          { id: 'l1', title: '¿Qué es la transformación digital?', duration: '20 min' },
          { id: 'l2', title: 'Tecnologías emergentes', duration: '25 min' },
          { id: 'l3', title: 'Impacto en los procesos empresariales', duration: '22 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Estrategia e Implementación',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Planificación de la transformación', duration: '30 min' },
          { id: 'l5', title: 'Gestión del cambio organizacional', duration: '28 min' },
          { id: 'l6', title: 'Casos de éxito', duration: '25 min' },
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
          { id: 'l1', title: 'Normativa de seguridad laboral', duration: '20 min' },
          { id: 'l2', title: 'Prevención de riesgos', duration: '25 min' },
          { id: 'l3', title: 'Equipo de protección personal', duration: '18 min' },
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
          { id: 'l1', title: 'Técnicas de gestión del tiempo', duration: '22 min' },
          { id: 'l2', title: 'Priorización de tareas', duration: '18 min' },
          { id: 'l3', title: 'Matriz de Eisenhower', duration: '20 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2: Optimización y Hábitos',
        orderIndex: 2,
        lessons: [
          { id: 'l4', title: 'Creación de hábitos productivos', duration: '25 min' },
          { id: 'l5', title: 'Eliminación de distracciones', duration: '20 min' },
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
