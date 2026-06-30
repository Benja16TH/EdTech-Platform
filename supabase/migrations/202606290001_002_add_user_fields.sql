-- v2.0.2 — Add position, department, and active columns to public.users
-- Run this after the initial schema migration.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
