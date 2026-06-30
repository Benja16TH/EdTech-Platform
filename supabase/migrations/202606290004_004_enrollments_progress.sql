-- v2.0.3 Enrollment & Progress tables (idempotent)

CREATE TABLE IF NOT EXISTS public.course_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS: admins can manage assignments; users can view their own
CREATE POLICY "Users can view own assignments"
  ON public.course_assignments FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'admin'
  ));

CREATE POLICY "Admins can manage assignments"
  ON public.course_assignments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'admin'
  ));

CREATE POLICY "Users can view own lesson progress"
  ON public.lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own lesson progress"
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE INDEX IF NOT EXISTS idx_ca_user ON public.course_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ca_course ON public.course_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_lp_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lp_lesson ON public.lesson_progress(lesson_id);
