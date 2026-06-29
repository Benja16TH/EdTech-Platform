import { Course } from '../types';
import { mockCourses } from '../data/mockData';

let coursesData: Course[] = [...mockCourses];

export function getCourses(): Promise<Course[]> {
  return Promise.resolve([...coursesData]);
}

export function getCourseById(courseId: string): Promise<Course | undefined> {
  return Promise.resolve(coursesData.find(c => c.id === courseId));
}

export function createCourse(courseData: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
  const newCourse: Course = {
    ...courseData,
    id: courseData.id || `course_${Date.now()}`,
  };
  coursesData = [...coursesData, newCourse];
  return Promise.resolve(newCourse);
}

export function updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course | null> {
  const index = coursesData.findIndex(c => c.id === courseId);
  if (index === -1) return Promise.resolve(null);
  const updated = { ...coursesData[index], ...courseData };
  coursesData = [...coursesData.slice(0, index), updated, ...coursesData.slice(index + 1)];
  return Promise.resolve(updated);
}

export function deleteCourse(courseId: string): Promise<boolean> {
  const index = coursesData.findIndex(c => c.id === courseId);
  if (index === -1) return Promise.resolve(false);
  coursesData = [...coursesData.slice(0, index), ...coursesData.slice(index + 1)];
  return Promise.resolve(true);
}
