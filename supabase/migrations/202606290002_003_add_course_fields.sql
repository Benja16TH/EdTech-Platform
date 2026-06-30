-- v2.0.2 — Add missing columns to courses and lessons tables.
-- Run this after the initial schema migration.

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'Básico'
    CHECK (level IN ('Básico', 'Intermedio', 'Avanzado')),
  ADD COLUMN IF NOT EXISTS learning_objectives jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive'));

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS video_url text;
