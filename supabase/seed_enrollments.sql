-- Seed: course_assignments and lesson_progress
-- Uses subqueries to map emails → user UUIDs, course titles → course UUIDs
-- Idempotent via ON CONFLICT DO NOTHING

-- ── Assignments ──────────────────────────────────
INSERT INTO public.course_assignments (user_id, course_id, assigned_at, progress)
SELECT u.id, c.id, '2024-01-15'::timestamptz, 60
FROM public.users u, public.courses c
WHERE u.email = 'maria.colaborador@empresa.com'
  AND c.title = 'Liderazgo y Gestión de Equipos'
ON CONFLICT (user_id, course_id) DO NOTHING;

INSERT INTO public.course_assignments (user_id, course_id, assigned_at, progress)
SELECT u.id, c.id, '2024-02-10'::timestamptz, 0
FROM public.users u, public.courses c
WHERE u.email = 'maria.colaborador@empresa.com'
  AND c.title = 'Excel Avanzado para Negocios'
ON CONFLICT (user_id, course_id) DO NOTHING;

INSERT INTO public.course_assignments (user_id, course_id, assigned_at, progress)
SELECT u.id, c.id, '2024-03-01'::timestamptz, 12
FROM public.users u, public.courses c
WHERE u.email = 'maria.colaborador@empresa.com'
  AND c.title = 'Transformación Digital'
ON CONFLICT (user_id, course_id) DO NOTHING;

-- ── Lesson progress for Maria (Curso 1) ──────────
-- Lesson IDs from seed_courses.sql (c0000001..c0000008 for Course 1)
INSERT INTO public.lesson_progress (user_id, lesson_id, completed, completed_at)
SELECT u.id, l.id, true, now()
FROM public.users u, public.lessons l
WHERE u.email = 'maria.colaborador@empresa.com'
  AND l.id IN (
    'c0000001-0000-0000-0000-000000000001',
    'c0000002-0000-0000-0000-000000000002',
    'c0000003-0000-0000-0000-000000000003',
    'c0000004-0000-0000-0000-000000000004'
  )
ON CONFLICT (user_id, lesson_id) DO NOTHING;
