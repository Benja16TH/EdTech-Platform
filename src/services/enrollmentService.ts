import type { UserEnrollment, CourseAssignment } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { mockEnrollments, mockAssignments } from '../data/extendedMockData';

let enrollmentsData: UserEnrollment[] = [...mockEnrollments];
let assignmentsData: CourseAssignment[] = [...mockAssignments];

function mapEnrollment(row: Record<string, unknown>, lessonIds: string[] = []): UserEnrollment {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    courseId: row.course_id as string,
    progress: (row.progress as number) || 0,
    completedLessons: lessonIds,
    enrolledAt: row.assigned_at ? new Date(row.assigned_at as string) : new Date(),
    courseCompleted: row.completed_at ? true : undefined,
  };
}

function mapAssignment(row: Record<string, unknown>): CourseAssignment {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    courseId: row.course_id as string,
    assignedAt: row.assigned_at ? new Date(row.assigned_at as string) : new Date(),
  };
}

async function fetchEnrollments(): Promise<UserEnrollment[] | null> {
  const { data: rows, error } = await supabase!
    .from('course_assignments')
    .select('*')
    .order('assigned_at', { ascending: false });

  if (error) {
    console.error('[enrollmentService] fetchEnrollments error:', error.message);
    return null;
  }
  if (!rows || rows.length === 0) return [];

  const userIds = [...new Set(rows.map(r => r.user_id as string))];
  const { data: lpRows } = await supabase!
    .from('lesson_progress')
    .select('*')
    .in('user_id', userIds);

  const byUser: Record<string, string[]> = {};
  for (const lp of lpRows || []) {
    const uid = lp.user_id as string;
    if (!byUser[uid]) byUser[uid] = [];
    byUser[uid].push(lp.lesson_id as string);
  }

  return rows.map(r => {
    const uid = r.user_id as string;
    return mapEnrollment(r, byUser[uid] || []);
  });
}

async function fetchAssignments(): Promise<CourseAssignment[] | null> {
  const { data, error } = await supabase!
    .from('course_assignments')
    .select('*')
    .order('assigned_at', { ascending: false });

  if (error) {
    console.error('[enrollmentService] fetchAssignments error:', error.message);
    return null;
  }
  if (!data) return [];
  return data.map(mapAssignment);
}

export async function getEnrollments(): Promise<UserEnrollment[]> {
  if (isSupabaseConfigured()) {
    const result = await fetchEnrollments();
    if (result !== null) {
      if (result.length > 0) enrollmentsData = result;
      return [...result];
    }
  }
  return [...enrollmentsData];
}

export async function getEnrollmentsByUser(userId: string): Promise<UserEnrollment[]> {
  if (isSupabaseConfigured()) {
    const all = await getEnrollments();
    return all.filter(e => e.userId === userId);
  }
  return enrollmentsData.filter(e => e.userId === userId);
}

export async function getEnrollmentsByCourse(courseId: string): Promise<UserEnrollment[]> {
  if (isSupabaseConfigured()) {
    const all = await getEnrollments();
    return all.filter(e => e.courseId === courseId);
  }
  return enrollmentsData.filter(e => e.courseId === courseId);
}

export async function getAssignments(): Promise<CourseAssignment[]> {
  if (isSupabaseConfigured()) {
    const result = await fetchAssignments();
    if (result !== null) {
      if (result.length > 0) assignmentsData = result;
      return [...result];
    }
  }
  return [...assignmentsData];
}

export async function getAssignmentsByUser(userId: string): Promise<CourseAssignment[]> {
  if (isSupabaseConfigured()) {
    const all = await getAssignments();
    return all.filter(a => a.userId === userId);
  }
  return assignmentsData.filter(a => a.userId === userId);
}

export async function assignCourse(userId: string, courseId: string): Promise<CourseAssignment | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from('course_assignments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();

    if (!error && data) {
      const assignment = mapAssignment(data);
      assignmentsData = [...assignmentsData, assignment];
      return assignment;
    }
    console.error('[enrollmentService] assignCourse error:', error?.message);
  }

  const assignment: CourseAssignment = {
    id: `assign_${Date.now()}`,
    userId,
    courseId,
    assignedAt: new Date(),
  };
  assignmentsData = [...assignmentsData, assignment];
  return assignment;
}

export async function unassignCourse(userId: string, courseId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!
      .from('course_assignments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (!error) {
      assignmentsData = assignmentsData.filter(a => !(a.userId === userId && a.courseId === courseId));
      return true;
    }
    console.error('[enrollmentService] unassignCourse error:', error?.message);
  }

  const initialLength = assignmentsData.length;
  assignmentsData = assignmentsData.filter(a => !(a.userId === userId && a.courseId === courseId));
  return assignmentsData.length < initialLength;
}

export async function updateEnrollment(
  enrollmentId: string, 
  data: Partial<UserEnrollment>
): Promise<UserEnrollment | null> {
  if (isSupabaseConfigured()) {
    const current = enrollmentsData.find(e => e.id === enrollmentId);
    if (!current) return null;

    if (data.progress !== undefined || data.courseCompleted !== undefined) {
      const updatePayload: Record<string, unknown> = {};
      if (data.progress !== undefined) updatePayload.progress = data.progress;
      if (data.courseCompleted) updatePayload.completed_at = new Date().toISOString();

      if (Object.keys(updatePayload).length > 0) {
        const { error: ue } = await supabase!
          .from('course_assignments')
          .update(updatePayload)
          .eq('id', enrollmentId);

        if (ue) console.error('[enrollmentService] updateEnrollment error:', ue.message);
      }
    }

    if (data.completedLessons !== undefined) {
      const oldLessons = current.completedLessons;
      const newLessons = data.completedLessons;
      const toAdd = newLessons.filter(lid => !oldLessons.includes(lid));
      const toRemove = oldLessons.filter(lid => !newLessons.includes(lid));

      if (toAdd.length > 0) {
        await supabase!
          .from('lesson_progress')
          .insert(toAdd.map(lid => ({
            user_id: current.userId,
            lesson_id: lid,
            completed: true,
            completed_at: new Date().toISOString(),
          })));
      }

      if (toRemove.length > 0) {
        await supabase!
          .from('lesson_progress')
          .delete()
          .eq('user_id', current.userId)
          .in('lesson_id', toRemove);
      }
    }
  }

  const index = enrollmentsData.findIndex(e => e.id === enrollmentId);
  if (index === -1) return null;
  const updated = { ...enrollmentsData[index], ...data };
  enrollmentsData = [...enrollmentsData.slice(0, index), updated, ...enrollmentsData.slice(index + 1)];
  return updated;
}
