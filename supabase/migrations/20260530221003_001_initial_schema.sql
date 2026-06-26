/*
  # Initial Schema for Corporate Learning Platform

  1. New Tables
    - `courses` - Course catalog
    - `modules` - Course modules with ordering
    - `lessons` - Individual lessons within modules
    - `users` - User profiles (extends auth.users)
    - `course_assignments` - Course assignments to collaborators
    - `notifications` - User notifications
    - `support_tickets` - Technical support requests
  
  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users based on role and ownership
*/

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'collaborator' CHECK (role IN ('collaborator', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  duration text NOT NULL,
  thumbnail text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Course assignments
CREATE TABLE IF NOT EXISTS public.course_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_course', 'reminder', 'completed', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all users"
  ON public.users FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for courses
CREATE POLICY "Courses are viewable by all authenticated users"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for modules
CREATE POLICY "Modules are viewable by authenticated users"
  ON public.modules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for lessons
CREATE POLICY "Lessons are viewable by authenticated users"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_assignments
CREATE POLICY "Users can view own assignments"
  ON public.course_assignments FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'admin'));

CREATE POLICY "Admins can manage assignments"
  ON public.course_assignments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'admin'));

-- RLS Policies for lesson_progress
CREATE POLICY "Users can view own progress"
  ON public.lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'admin'));

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own tickets"
  ON public.support_tickets FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.course_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.course_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);