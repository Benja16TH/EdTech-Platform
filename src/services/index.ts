// v2.0.1 — Service layer prepared for Supabase migration.
// All services currently use in-memory mock data.
// When ready, swap implementations to use supabase from src/lib/supabaseClient.ts.

export * from './userService';
export * from './courseService';
export * from './enrollmentService';
export * from './certificateService';
export * from './activityService';
