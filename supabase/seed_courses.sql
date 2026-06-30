-- Seed: Insert 6 mock courses with modules and lessons into Supabase
-- Run this AFTER the column migration (002_add_user_fields and 003_add_course_fields)

-- ── Course 1: Liderazgo y Gestión de Equipos ──
INSERT INTO public.courses (id, title, description, category, level, duration, learning_objectives, status, thumbnail)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'Liderazgo y Gestión de Equipos',
  'Curso integral para desarrollar habilidades de liderazgo, comunicación efectiva y gestión de equipos de alto rendimiento en entornos corporativos.',
  'Gestión', 'Avanzado', '4 horas',
  '["Identificar los diferentes estilos de liderazgo y cuándo aplicarlos","Desarrollar habilidades de comunicación asertiva","Aprender técnicas de motivación y gestión de conflictos","Implementar estrategias de coaching y mentoría en equipos"]'::jsonb,
  'active',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800'
);

-- Module 1.1
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Módulo 1: Fundamentos del Liderazgo', '', 1);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Introducción al liderazgo efectivo', 'Conoce los fundamentos del liderazgo y su impacto en el entorno laboral actual.', '15 min', NULL, 1),
  ('c0000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Estilos de liderazgo', 'Explora los diferentes estilos de liderazgo y aprende a identificar cuál se adapta mejor a cada situación.', '20 min', NULL, 2),
  ('c0000003-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'Comunicación asertiva', 'Desarrolla habilidades de comunicación asertiva para mejorar las relaciones interpersonales en tu equipo.', '18 min', NULL, 3);

-- Module 1.2
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000002-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Módulo 2: Gestión de Equipos', '', 2);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000004-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000002', 'Formación de equipos de alto rendimiento', 'Aprende las claves para construir equipos sólidos que trabajen de forma coordinada hacia objetivos comunes.', '22 min', NULL, 1),
  ('c0000005-0000-0000-0000-000000000005', 'b0000002-0000-0000-0000-000000000002', 'Motivación y compromiso', 'Descubre técnicas efectivas para mantener la motivación y el compromiso dentro de tu equipo de trabajo.', '25 min', NULL, 2),
  ('c0000006-0000-0000-0000-000000000006', 'b0000002-0000-0000-0000-000000000002', 'Resolución de conflictos', 'Domina estrategias para identificar, abordar y resolver conflictos de manera constructiva.', '20 min', NULL, 3);

-- Module 1.3
INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000003-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'Módulo 3: Desarrollo de Talento', '', 3);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000007-0000-0000-0000-000000000007', 'b0000003-0000-0000-0000-000000000003', 'Coaching y mentoría', 'Implementa programas de coaching y mentoría para potenciar el desarrollo profesional de tu equipo.', '30 min', NULL, 1),
  ('c0000008-0000-0000-0000-000000000008', 'b0000003-0000-0000-0000-000000000003', 'Evaluación del desempeño', 'Conoce metodologías efectivas para evaluar el rendimiento y proporcionar retroalimentación constructiva.', '25 min', NULL, 2);

-- ── Course 2: Excel Avanzado para Negocios ──
INSERT INTO public.courses (id, title, description, category, level, duration, learning_objectives, status, thumbnail)
VALUES (
  'a0000002-0000-0000-0000-000000000002',
  'Excel Avanzado para Negocios',
  'Domina las funciones avanzadas de Excel para análisis de datos, tablas dinámicas y automatización de reportes empresariales.',
  'Tecnología', 'Avanzado', '6 horas',
  '["Aplicar funciones lógicas y de búsqueda avanzadas","Crear y gestionar tablas dinámicas para análisis de datos","Automatizar reportes con validación y filtros avanzados","Optimizar flujos de trabajo con fórmulas anidadas"]'::jsonb,
  'active',
  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000004-0000-0000-0000-000000000004', 'a0000002-0000-0000-0000-000000000002', 'Módulo 1: Funciones Avanzadas', '', 1);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000009-0000-0000-0000-000000000009', 'b0000004-0000-0000-0000-000000000004', 'Funciones lógicas y condicionales', 'Aprende a usar SI, Y, O y otras funciones lógicas para automatizar decisiones en tus hojas de cálculo.', '30 min', NULL, 1),
  ('c0000010-0000-0000-0000-000000000010', 'b0000004-0000-0000-0000-000000000004', 'BUSCARV y BUSCARH', 'Domina las funciones de búsqueda vertical y horizontal para encontrar datos rápidamente en grandes tablas.', '25 min', NULL, 2),
  ('c0000011-0000-0000-0000-000000000011', 'b0000004-0000-0000-0000-000000000004', 'Funciones de texto', 'Conoce las funciones para manipular texto: concatenar, extraer, limpiar y transformar datos.', '20 min', NULL, 3);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000005-0000-0000-0000-000000000005', 'a0000002-0000-0000-0000-000000000002', 'Módulo 2: Análisis de Datos', '', 2);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000012-0000-0000-0000-000000000012', 'b0000005-0000-0000-0000-000000000005', 'Tablas dinámicas', 'Crea y gestiona tablas dinámicas para analizar grandes volúmenes de datos de forma interactiva.', '40 min', NULL, 1),
  ('c0000013-0000-0000-0000-000000000013', 'b0000005-0000-0000-0000-000000000005', 'Filtrado y validación', 'Implementa filtros avanzados y validación de datos para mantener la integridad de tus reportes.', '25 min', NULL, 2);

-- ── Course 3: Servicio al Cliente de Excelencia ──
INSERT INTO public.courses (id, title, description, category, level, duration, learning_objectives, status, thumbnail)
VALUES (
  'a0000003-0000-0000-0000-000000000003',
  'Servicio al Cliente de Excelencia',
  'Aprende las mejores prácticas para brindar un servicio al cliente excepcional, manejar situaciones difíciles y fidelizar clientes.',
  'Atención al Cliente', 'Intermedio', '3 horas',
  '["Comprender la importancia del servicio al cliente en el entorno empresarial","Desarrollar habilidades de comunicación efectiva y empatía","Aprender técnicas de gestión de quejas y reclamaciones","Implementar estrategias de fidelización de clientes"]'::jsonb,
  'active',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000006-0000-0000-0000-000000000006', 'a0000003-0000-0000-0000-000000000003', 'Módulo 1: Fundamentos del Servicio', '', 1);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000014-0000-0000-0000-000000000014', 'b0000006-0000-0000-0000-000000000006', 'La importancia del servicio al cliente', 'Comprende por qué un servicio excepcional es la clave del éxito empresarial y la fidelización.', '15 min', NULL, 1),
  ('c0000015-0000-0000-0000-000000000015', 'b0000006-0000-0000-0000-000000000006', 'Comunicación efectiva con clientes', 'Desarrolla habilidades de comunicación verbal y no verbal para atender a tus clientes con profesionalismo.', '20 min', NULL, 2),
  ('c0000016-0000-0000-0000-000000000016', 'b0000006-0000-0000-0000-000000000006', 'Empatía y escucha activa', 'Aprende a ponerte en el lugar del cliente y a escuchar activamente para entender sus necesidades reales.', '18 min', NULL, 3);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000007-0000-0000-0000-000000000007', 'a0000003-0000-0000-0000-000000000003', 'Módulo 2: Manejo de Situaciones Difíciles', '', 2);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000017-0000-0000-0000-000000000017', 'b0000007-0000-0000-0000-000000000007', 'Gestión de quejas y reclamaciones', 'Aprende el protocolo para manejar quejas de manera profesional y convertirlas en oportunidades de mejora.', '25 min', NULL, 1),
  ('c0000018-0000-0000-0000-000000000018', 'b0000007-0000-0000-0000-000000000007', 'De-escalada de conflictos', 'Domina técnicas para reducir la tensión en situaciones conflictivas y encontrar soluciones colaborativas.', '22 min', NULL, 2);

-- ── Course 4: Transformación Digital ──
INSERT INTO public.courses (id, title, description, category, level, duration, learning_objectives, status, thumbnail)
VALUES (
  'a0000004-0000-0000-0000-000000000004',
  'Transformación Digital',
  'Conoce las claves de la transformación digital en las empresas y cómo implementar estrategias de innovación tecnológica.',
  'Tecnología', 'Intermedio', '5 horas',
  '["Entender los fundamentos de la transformación digital","Identificar tecnologías emergentes y su impacto empresarial","Desarrollar estrategias de implementación digital","Aprender a gestionar el cambio organizacional"]'::jsonb,
  'active',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'
);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000008-0000-0000-0000-000000000008', 'a0000004-0000-0000-0000-000000000004', 'Módulo 1: Introducción a la Transformación Digital', '', 1);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000019-0000-0000-0000-000000000019', 'b0000008-0000-0000-0000-000000000008', '¿Qué es la transformación digital?', 'Descubre los fundamentos de la transformación digital y por qué es crucial para la competitividad empresarial.', '20 min', NULL, 1),
  ('c0000020-0000-0000-0000-000000000020', 'b0000008-0000-0000-0000-000000000008', 'Tecnologías emergentes', 'Explora las tecnologías que están revolucionando los negocios: IA, IoT, blockchain y cloud computing.', '25 min', NULL, 2),
  ('c0000021-0000-0000-0000-000000000021', 'b0000008-0000-0000-0000-000000000008', 'Impacto en los procesos empresariales', 'Analiza cómo la digitalización transforma los procesos operativos y la experiencia del cliente.', '22 min', NULL, 3);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000009-0000-0000-0000-000000000009', 'a0000004-0000-0000-0000-000000000004', 'Módulo 2: Estrategia e Implementación', '', 2);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000022-0000-0000-0000-000000000022', 'b0000009-0000-0000-0000-000000000009', 'Planificación de la transformación', 'Aprende a diseñar una hoja de ruta para implementar la transformación digital en tu organización.', '30 min', NULL, 1),
  ('c0000023-0000-0000-0000-000000000023', 'b0000009-0000-0000-0000-000000000009', 'Gestión del cambio organizacional', 'Conoce estrategias para gestionar la resistencia al cambio y liderar la adopción de nuevas tecnologías.', '28 min', NULL, 2),
  ('c0000024-0000-0000-0000-000000000024', 'b0000009-0000-0000-0000-000000000009', 'Casos de éxito', 'Analiza casos reales de empresas que lograron una transformación digital exitosa y las lecciones aprendidas.', '25 min', NULL, 3);

-- ── Course 5: Seguridad e Higiene en el Trabajo ──
INSERT INTO public.courses (id, title, description, category, level, duration, learning_objectives, status, thumbnail)
VALUES (
  'a0000005-0000-0000-0000-000000000005',
  'Seguridad e Higiene en el Trabajo',
  'Capacitación esencial en normativas de seguridad laboral, prevención de riesgos y uso correcto de equipos de protección personal.',
  'Seguridad', 'Básico', '2 horas',
  '["Conocer la normativa de seguridad laboral vigente","Identificar y prevenir riesgos laborales comunes","Aprender el uso correcto de equipos de protección personal","Aplicar protocolos de emergencia en el trabajo"]'::jsonb,
  'active',
  'https://images.pexels.com/photos/1260309/pexels-photo-1260309.jpeg?auto=compress&cs=tinysrgb&w=800'
);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000010-0000-0000-0000-000000000010', 'a0000005-0000-0000-0000-000000000005', 'Módulo 1: Normas de Seguridad', '', 1);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000025-0000-0000-0000-000000000025', 'b0000010-0000-0000-0000-000000000010', 'Normativa de seguridad laboral', 'Conoce las normativas vigentes en seguridad laboral y las obligaciones legales de la empresa y los trabajadores.', '20 min', NULL, 1),
  ('c0000026-0000-0000-0000-000000000026', 'b0000010-0000-0000-0000-000000000010', 'Prevención de riesgos', 'Identifica los riesgos laborales más comunes y aprende las medidas preventivas para evitarlos.', '25 min', NULL, 2),
  ('c0000027-0000-0000-0000-000000000027', 'b0000010-0000-0000-0000-000000000010', 'Equipo de protección personal', 'Aprende a seleccionar, usar y mantener correctamente los equipos de protección personal según cada tarea.', '18 min', NULL, 3);

-- ── Course 6: Gestión del Tiempo y Productividad ──
INSERT INTO public.courses (id, title, description, category, level, duration, learning_objectives, status, thumbnail)
VALUES (
  'a0000006-0000-0000-0000-000000000006',
  'Gestión del Tiempo y Productividad',
  'Aprende técnicas probadas para optimizar tu tiempo, priorizar tareas y aumentar tu productividad personal y profesional.',
  'Desarrollo Personal', 'Básico', '3 horas',
  '["Dominar técnicas de gestión del tiempo como la Matriz de Eisenhower","Aprender a priorizar tareas de forma efectiva","Desarrollar hábitos productivos duraderos","Eliminar distracciones y mejorar el enfoque"]'::jsonb,
  'active',
  'https://images.pexels.com/photos/1043514/pexels-photo-1043514.jpeg?auto=compress&cs=tinysrgb&w=800'
);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000011-0000-0000-0000-000000000011', 'a0000006-0000-0000-0000-000000000006', 'Módulo 1: Principios de Productividad', '', 1);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000028-0000-0000-0000-000000000028', 'b0000011-0000-0000-0000-000000000011', 'Técnicas de gestión del tiempo', 'Descubre las técnicas más efectivas para administrar tu tiempo y aumentar tu productividad diaria.', '22 min', NULL, 1),
  ('c0000029-0000-0000-0000-000000000029', 'b0000011-0000-0000-0000-000000000011', 'Priorización de tareas', 'Aprende a identificar qué tareas son realmente importantes y urgentes para enfocar tu energía donde importa.', '18 min', NULL, 2),
  ('c0000030-0000-0000-0000-000000000030', 'b0000011-0000-0000-0000-000000000011', 'Matriz de Eisenhower', 'Domina la matriz de Eisenhower para clasificar tareas y tomar decisiones rápidas sobre qué hacer primero.', '20 min', NULL, 3);

INSERT INTO public.modules (id, course_id, title, description, order_index)
VALUES ('b0000012-0000-0000-0000-000000000012', 'a0000006-0000-0000-0000-000000000006', 'Módulo 2: Optimización y Hábitos', '', 2);
INSERT INTO public.lessons (id, module_id, title, description, duration, video_url, order_index) VALUES
  ('c0000031-0000-0000-0000-000000000031', 'b0000012-0000-0000-0000-000000000012', 'Creación de hábitos productivos', 'Aprende a construir hábitos sostenibles que mejoren tu productividad personal y profesional a largo plazo.', '25 min', NULL, 1),
  ('c0000032-0000-0000-0000-000000000032', 'b0000012-0000-0000-0000-000000000012', 'Eliminación de distracciones', 'Identifica las principales fuentes de distracción y aplica técnicas para mantener el enfoque en tus tareas.', '20 min', NULL, 2);
