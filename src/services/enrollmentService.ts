import { UserEnrollment, CourseAssignment } from '../types';
import { mockEnrollments, mockAssignments } from '../data/extendedMockData';
// v2.0.1 — Prepared for Supabase migration. When ready, replace in-memory
// operations with supabase queries from src/lib/supabaseClient.ts.

let enrollmentsData: UserEnrollment[] = [...mockEnrollments];
let assignmentsData: CourseAssignment[] = [...mockAssignments];

export function getEnrollments(): Promise<UserEnrollment[]> {
  return Promise.resolve([...enrollmentsData]);
}

export function getEnrollmentsByUser(userId: string): Promise<UserEnrollment[]> {
  return Promise.resolve(enrollmentsData.filter(e => e.userId === userId));
}

export function getEnrollmentsByCourse(courseId: string): Promise<UserEnrollment[]> {
  return Promise.resolve(enrollmentsData.filter(e => e.courseId === courseId));
}

export function getAssignments(): Promise<CourseAssignment[]> {
  return Promise.resolve([...assignmentsData]);
}

export function getAssignmentsByUser(userId: string): Promise<CourseAssignment[]> {
  return Promise.resolve(assignmentsData.filter(a => a.userId === userId));
}

export function assignCourse(userId: string, courseId: string): Promise<CourseAssignment> {
  const assignment: CourseAssignment = {
    id: `assign_${Date.now()}`,
    userId,
    courseId,
    assignedAt: new Date(),
  };
  assignmentsData = [...assignmentsData, assignment];
  return Promise.resolve(assignment);
}

export function unassignCourse(userId: string, courseId: string): Promise<boolean> {
  const initialLength = assignmentsData.length;
  assignmentsData = assignmentsData.filter(a => !(a.userId === userId && a.courseId === courseId));
  return Promise.resolve(assignmentsData.length < initialLength);
}

export function updateEnrollment(enrollmentId: string, data: Partial<UserEnrollment>): Promise<UserEnrollment | null> {
  const index = enrollmentsData.findIndex(e => e.id === enrollmentId);
  if (index === -1) return Promise.resolve(null);
  const updated = { ...enrollmentsData[index], ...data };
  enrollmentsData = [...enrollmentsData.slice(0, index), updated, ...enrollmentsData.slice(index + 1)];
  return Promise.resolve(updated);
}
