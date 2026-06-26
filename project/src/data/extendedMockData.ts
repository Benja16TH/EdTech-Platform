import { CourseAssignment, Notification, SupportTicket, Analytics, User, UserEnrollment, FinalAssessment, UserAssessmentAttempt } from '../types';

export const mockCollaborators: User[] = [
  {
    id: '1',
    email: 'maria.garcia@empresa.com',
    name: 'María García',
    role: 'collaborator',
  },
  {
    id: '2',
    email: 'admin@empresa.com',
    name: 'Administrador',
    role: 'admin',
  },
  {
    id: '3',
    email: 'carlos.torres@empresa.com',
    name: 'Carlos Torres',
    role: 'collaborator',
  },
  {
    id: '4',
    email: 'ana.martinez@empresa.com',
    name: 'Ana Martínez',
    role: 'collaborator',
  },
  {
    id: '5',
    email: 'pedro.rodriguez@empresa.com',
    name: 'Pedro Rodríguez',
    role: 'collaborator',
  },
  {
    id: '6',
    email: 'lucia.hernandez@empresa.com',
    name: 'Lucía Hernández',
    role: 'collaborator',
  },
  {
    id: '7',
    email: 'miguel.sanchez@empresa.com',
    name: 'Miguel Sánchez',
    role: 'collaborator',
  },
  {
    id: '8',
    email: 'elena.diaz@empresa.com',
    name: 'Elena Díaz',
    role: 'collaborator',
  },
];

export const mockEnrollments: UserEnrollment[] = [
  // Maria Garcia (user 1) - Liderazgo course progress
  {
    id: 'enr1',
    userId: '1',
    courseId: '1',
    progress: 60,
    completedLessons: ['l1', 'l2', 'l3', 'l4'],
    enrolledAt: new Date('2024-01-15'),
  },
  // Carlos Torres (user 3) - Excel course progress
  {
    id: 'enr2',
    userId: '3',
    courseId: '1',
    progress: 25,
    completedLessons: ['l1', 'l2'],
    enrolledAt: new Date('2024-02-01'),
  },
  // Maria Garcia - Excel course (not started)
  {
    id: 'enr3',
    userId: '1',
    courseId: '2',
    progress: 0,
    completedLessons: [],
    enrolledAt: new Date('2024-02-10'),
  },
  // Carlos Torres - Excel course (completed)
  {
    id: 'enr4',
    userId: '3',
    courseId: '2',
    progress: 40,
    completedLessons: ['l1', 'l2'],
    enrolledAt: new Date('2024-01-20'),
  },
  // Ana Martinez - Servicio al cliente
  {
    id: 'enr5',
    userId: '4',
    courseId: '3',
    progress: 50,
    completedLessons: ['l1'],
    enrolledAt: new Date('2024-02-15'),
  },
  // Pedro Rodriguez - Liderazgo
  {
    id: 'enr6',
    userId: '5',
    courseId: '1',
    progress: 12,
    completedLessons: ['l1'],
    enrolledAt: new Date('2024-03-01'),
  },
];

export const mockAssignments: CourseAssignment[] = [
  // María García (user 1) - assigned courses
  {
    id: 'assign_1',
    userId: '1',
    courseId: '1',
    assignedAt: new Date('2024-01-15'),
  },
  {
    id: 'assign_2',
    userId: '1',
    courseId: '2',
    assignedAt: new Date('2024-02-10'),
  },
  // Carlos Torres (user 3) - assigned courses
  {
    id: 'assign_3',
    userId: '3',
    courseId: '2',
    assignedAt: new Date('2024-02-01'),
  },
  {
    id: 'assign_4',
    userId: '3',
    courseId: '3',
    assignedAt: new Date('2024-02-15'),
  },
  // Ana Martínez (user 4) - assigned courses
  {
    id: 'assign_5',
    userId: '4',
    courseId: '3',
    assignedAt: new Date('2024-02-10'),
  },
  {
    id: 'assign_6',
    userId: '4',
    courseId: '4',
    assignedAt: new Date('2024-03-01'),
  },
  // Pedro Rodríguez (user 5) - assigned courses
  {
    id: 'assign_7',
    userId: '5',
    courseId: '1',
    assignedAt: new Date('2024-02-15'),
  },
  // Lucía Hernández (user 6) - assigned courses
  {
    id: 'assign_8',
    userId: '6',
    courseId: '4',
    assignedAt: new Date('2024-03-01'),
  },
  {
    id: 'assign_9',
    userId: '6',
    courseId: '5',
    assignedAt: new Date('2024-03-05'),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'new_course',
    title: 'Nuevo curso asignado',
    message: 'Se te ha asignado el curso "Liderazgo y Gestión de Equipos". ¡Comienza ahora!',
    read: false,
    createdAt: new Date('2024-03-15T10:30:00'),
  },
  {
    id: '2',
    userId: '1',
    type: 'reminder',
    title: 'Recordatorio de capacitación',
    message: 'Tienes un curso en progreso con bajo avance. ¡No dejes para mañana lo que puedes aprender hoy!',
    read: false,
    createdAt: new Date('2024-03-14T09:00:00'),
  },
  {
    id: '3',
    userId: '1',
    type: 'completed',
    title: 'Curso completado',
    message: '¡Felicitaciones! Has completado exitosamente el curso "Excel Avanzado para Negocios".',
    read: true,
    createdAt: new Date('2024-03-10T14:20:00'),
  },
  {
    id: '4',
    userId: '1',
    type: 'system',
    title: 'Actualización del sistema',
    message: 'Hemos mejorado la plataforma con nuevas funcionalidades. ¡Descúbrelas!',
    read: false,
    createdAt: new Date('2024-03-12T08:00:00'),
  },
  {
    id: '5',
    userId: '3',
    type: 'new_course',
    title: 'Nuevo curso disponible',
    message: 'El curso "Gestión del Tiempo y Productividad" ya está disponible.',
    read: false,
    createdAt: new Date('2024-03-13T11:00:00'),
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: '1',
    subject: 'Video no se reproduce',
    description: 'El video de la lección 3 del curso de Liderazgo no carga correctamente. Se queda en buffer indefinidamente.',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2024-03-15T16:45:00'),
  },
  {
    id: '2',
    userId: '3',
    subject: 'Error al guardar progreso',
    description: 'Mi progreso no se está guardando correctamente. Cada vez que entro al curso, aparece en 0%.',
    priority: 'medium',
    status: 'in_progress',
    createdAt: new Date('2024-03-14T10:30:00'),
  },
  {
    id: '3',
    userId: '1',
    subject: 'Preguntas sobre certificado',
    description: '¿Cómo puedo descargar mi certificado después de completar un curso?',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date('2024-03-10T09:15:00'),
  },
];

export const mockAnalytics: Analytics = {
  totalCollaborators: 8,
  completedCourses: 12,
  inProgressCourses: 8,
  completionRate: 68,
  totalHours: 145,
  coursesByCategory: [
    { category: 'Gestión', count: 15 },
    { category: 'Tecnología', count: 22 },
    { category: 'Atención al Cliente', count: 10 },
    { category: 'Seguridad', count: 8 },
    { category: 'Desarrollo Personal', count: 12 },
  ],
  monthlyProgress: [
    { month: 'Ene', completed: 3, enrolled: 8 },
    { month: 'Feb', completed: 5, enrolled: 10 },
    { month: 'Mar', completed: 4, enrolled: 7 },
    { month: 'Abr', completed: 6, enrolled: 9 },
    { month: 'May', completed: 8, enrolled: 12 },
    { month: 'Jun', completed: 7, enrolled: 11 },
  ],
};

export const mockFinalAssessments: FinalAssessment[] = [
  {
    id: 'assess_1',
    courseId: '1',
    passingPercentage: 70,
    questions: [
      {
        id: 'q1_1',
        courseId: '1',
        question: '¿Cuál es el primer paso para construir un equipo de alto desempeño?',
        options: [
          'Establecer metas claras',
          'Reclutar a los mejores talentos',
          'Implementar sistemas de control',
          'Crear un ambiente de confianza y comunicación',
        ],
        correctAnswerIndex: 3,
        orderIndex: 0,
      },
      {
        id: 'q1_2',
        courseId: '1',
        question: '¿Qué caracteriza a un líder efectivo?',
        options: [
          'Tomar todas las decisiones solo',
          'Escuchar, inspirar y desarrollar a su equipo',
          'Usar solo la autoridad formal',
          'Minimizar la comunicación',
        ],
        correctAnswerIndex: 1,
        orderIndex: 1,
      },
      {
        id: 'q1_3',
        courseId: '1',
        question: '¿Cuál es el impacto de la retroalimentación constructiva?',
        options: [
          'Desmoraliza al equipo',
          'Promueve el desarrollo y mejora del desempeño',
          'No tiene efecto significativo',
          'Solo es necesaria en situaciones de crisis',
        ],
        correctAnswerIndex: 1,
        orderIndex: 2,
      },
      {
        id: 'q1_4',
        courseId: '1',
        question: '¿Cómo se resuelven los conflictos en un equipo de alto desempeño?',
        options: [
          'Ignorándolos y esperando que se resuelvan solos',
          'Mediante diálogo abierto, empatía y búsqueda de soluciones colaborativas',
          'Dejando que el líder imponga la solución',
          'Separando a las personas en conflicto permanentemente',
        ],
        correctAnswerIndex: 1,
        orderIndex: 3,
      },
      {
        id: 'q1_5',
        courseId: '1',
        question: '¿Cuál es la importancia de la delegación en la gestión de equipos?',
        options: [
          'No es importante, el líder debe hacer todo',
          'Permite desarrollar talento, multiplicar capacidad y mejorar motivación',
          'Solo es útil en empresas grandes',
          'Reduce la responsabilidad del líder',
        ],
        correctAnswerIndex: 1,
        orderIndex: 4,
      },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'assess_2',
    courseId: '2',
    passingPercentage: 75,
    questions: [
      {
        id: 'q2_1',
        courseId: '2',
        question: '¿Cuál es la función principal de la función VLOOKUP en Excel?',
        options: [
          'Buscar un valor en la primera fila de una tabla',
          'Buscar un valor en la primera columna y devolver un valor de la misma fila',
          'Crear gráficos automáticamente',
          'Aplicar formato condicional',
        ],
        correctAnswerIndex: 1,
        orderIndex: 0,
      },
      {
        id: 'q2_2',
        courseId: '2',
        question: '¿Qué herramienta se utiliza para analizar tendencias en datos?',
        options: [
          'Tabla pivote',
          'Análisis de datos y gráficos',
          'Validación de datos',
          'Filtro automático',
        ],
        correctAnswerIndex: 0,
        orderIndex: 1,
      },
      {
        id: 'q2_3',
        courseId: '2',
        question: '¿Cuál es la diferencia entre una referencia relativa y una absoluta?',
        options: [
          'No hay diferencia',
          'La referencia relativa cambia al copiar, la absoluta se mantiene igual',
          'La referencia absoluta siempre usa texto',
          'Solo se aplican a tablas pivote',
        ],
        correctAnswerIndex: 1,
        orderIndex: 2,
      },
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'assess_3',
    courseId: '3',
    passingPercentage: 70,
    questions: [
      {
        id: 'q3_1',
        courseId: '3',
        question: '¿Cuál es el principio fundamental del servicio al cliente?',
        options: [
          'Vender lo más rápido posible',
          'Entender y satisfacer las necesidades del cliente',
          'Minimizar el tiempo de atención',
          'Siempre tener la razón',
        ],
        correctAnswerIndex: 1,
        orderIndex: 0,
      },
      {
        id: 'q3_2',
        courseId: '3',
        question: '¿Cómo se maneja un cliente insatisfecho de forma efectiva?',
        options: [
          'Argumentar por qué tiene razón la empresa',
          'Escuchar, empatizar y buscar una solución',
          'Terminar la conversación rápidamente',
          'Ofrecer el reembolso sin discusión',
        ],
        correctAnswerIndex: 1,
        orderIndex: 1,
      },
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const mockUserAssessmentAttempts: UserAssessmentAttempt[] = [];

import { Certificate } from '../types';

export const mockCertificates: Certificate[] = [];