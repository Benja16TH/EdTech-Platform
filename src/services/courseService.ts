import type { Course, Module, Lesson } from '../types';
import { mockCourses } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
// v2.0.2 — Supabase-aware. Reads from courses / modules / lessons tables
// when configured, falls back to mock data otherwise.

let coursesData: Course[] = [...mockCourses];

function mapCourseRow(row: Record<string, unknown>, modules: Module[] = []): Course {
  let learningObjectives: string[] = [];
  const lo = row.learning_objectives;
  if (Array.isArray(lo)) {
    learningObjectives = lo as string[];
  } else if (typeof lo === 'string') {
    try { learningObjectives = JSON.parse(lo); } catch { /* ignore */ }
  }

  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    category: row.category as string,
    level: row.level as 'Básico' | 'Intermedio' | 'Avanzado',
    duration: row.duration as string,
    learningObjectives,
    status: (row.status as 'active' | 'inactive') || 'active',
    thumbnail: row.thumbnail as string,
    modules,
  };
}

function mapModuleRow(row: Record<string, unknown>, lessons: Lesson[] = []): Module {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || undefined,
    orderIndex: row.order_index as number,
    lessons,
  };
}

function mapLessonRow(row: Record<string, unknown>): Lesson {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || undefined,
    duration: row.duration as string,
    videoUrl: (row.video_url as string) || undefined,
  };
}

async function fetchFullCourses(): Promise<Course[] | null> {
  const { data, error } = await supabase!
    .from('courses')
    .select('*, modules:modules(*, lessons:lessons(*))')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[courseService] Error fetching courses:', error.message);
    return null;
  }
  if (!data || data.length === 0) return [];

  return data.map((courseRow: Record<string, unknown>) => {
    const rawModules = (courseRow.modules as Record<string, unknown>[]) || [];
    const modules: Module[] = rawModules.map((modRow: Record<string, unknown>) => {
      const rawLessons = (modRow.lessons as Record<string, unknown>[]) || [];
      const lessons: Lesson[] = rawLessons.map(mapLessonRow);
      return mapModuleRow(modRow, lessons);
    });
    return mapCourseRow(courseRow, modules);
  });
}

async function fetchCourseWithModules(courseId: string): Promise<Course | null> {
  const { data, error } = await supabase!
    .from('courses')
    .select('*, modules:modules(*, lessons:lessons(*))')
    .eq('id', courseId)
    .single();

  if (error || !data) return null;

  const rawModules = (data.modules as Record<string, unknown>[]) || [];
  const modules: Module[] = rawModules.map((modRow: Record<string, unknown>) => {
    const rawLessons = (modRow.lessons as Record<string, unknown>[]) || [];
    const lessons: Lesson[] = rawLessons.map(mapLessonRow);
    return mapModuleRow(modRow, lessons);
  });

  return mapCourseRow(data, modules);
}

async function persistModules(courseId: string, modules: Module[]): Promise<Module[]> {
  const { data: existing } = await supabase!
    .from('modules')
    .select('id')
    .eq('course_id', courseId);

  const oldIds = (existing || []).map(m => m.id);
  if (oldIds.length > 0) {
    await supabase!.from('lessons').delete().in('module_id', oldIds);
    await supabase!.from('modules').delete().in('id', oldIds);
  }

  const savedModules: Module[] = [];
  for (let mi = 0; mi < modules.length; mi++) {
    const mod = modules[mi];
    const mid = mod.id.startsWith('m') ? crypto.randomUUID() : mod.id;
    const { data: mr, error: me } = await supabase!
      .from('modules')
      .insert({
        id: mid,
        course_id: courseId,
        title: mod.title,
        description: mod.description || '',
        order_index: mi + 1,
      })
      .select()
      .single();

    if (me || !mr) continue;

    const savedLessons: Lesson[] = [];
    for (let li = 0; li < mod.lessons.length; li++) {
      const les = mod.lessons[li];
      const lid = les.id.startsWith('l') ? crypto.randomUUID() : les.id;
      const { data: lr, error: le } = await supabase!
        .from('lessons')
        .insert({
          id: lid,
          module_id: mid,
          title: les.title,
          description: les.description || null,
          duration: les.duration,
          video_url: les.videoUrl || null,
          order_index: li + 1,
        })
        .select()
        .single();

      if (!le && lr) savedLessons.push(mapLessonRow(lr));
    }

    savedModules.push(mapModuleRow(mr, savedLessons));
  }

  return savedModules;
}

export async function getCourses(): Promise<Course[]> {
  if (isSupabaseConfigured()) {
    const result = await fetchFullCourses();
    if (result !== null) {
      if (result.length > 0) {
        coursesData = result;
      }
      return [...result];
    }
  }
  return [...coursesData];
}

export async function getCourseById(courseId: string): Promise<Course | undefined> {
  if (isSupabaseConfigured()) {
    const course = await fetchCourseWithModules(courseId);
    if (course) return course;
  }
  return coursesData.find(c => c.id === courseId);
}

export async function createCourse(courseData: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
  if (isSupabaseConfigured()) {
    const { modules, ...courseFields } = courseData;
    const courseId = courseData.id || crypto.randomUUID();

    const { data: cr, error: ce } = await supabase!
      .from('courses')
      .insert({
        id: courseId,
        title: courseFields.title,
        description: courseFields.description,
        category: courseFields.category,
        level: courseFields.level,
        duration: courseFields.duration,
        learning_objectives: JSON.stringify(courseFields.learningObjectives || []),
        status: courseFields.status,
        thumbnail: courseFields.thumbnail,
      })
      .select()
      .single();

    if (!ce && cr) {
      const savedModules = modules ? await persistModules(courseId, modules) : [];
      const course = mapCourseRow(cr, savedModules);
      coursesData = [...coursesData, course];
      return course;
    }
  }

  const newCourse: Course = {
    ...courseData,
    id: courseData.id || `course_${Date.now()}`,
  };
  coursesData = [...coursesData, newCourse];
  return newCourse;
}

export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course | null> {
  if (isSupabaseConfigured()) {
    const existing = await fetchCourseWithModules(courseId);
    if (existing) {
      const payload: Record<string, unknown> = {};
      if (courseData.title !== undefined) payload.title = courseData.title;
      if (courseData.description !== undefined) payload.description = courseData.description;
      if (courseData.category !== undefined) payload.category = courseData.category;
      if (courseData.level !== undefined) payload.level = courseData.level;
      if (courseData.duration !== undefined) payload.duration = courseData.duration;
      if (courseData.learningObjectives !== undefined) payload.learning_objectives = JSON.stringify(courseData.learningObjectives);
      if (courseData.status !== undefined) payload.status = courseData.status;
      if (courseData.thumbnail !== undefined) payload.thumbnail = courseData.thumbnail;

      if (Object.keys(payload).length > 0) {
        const { data: cr, error: ce } = await supabase!
          .from('courses')
          .update(payload)
          .eq('id', courseId)
          .select()
          .single();

        if (!ce && cr) {
          const modules = courseData.modules !== undefined
            ? await persistModules(courseId, courseData.modules)
            : await (async () => {
                const { data: full } = await supabase!
                  .from('courses')
                  .select('*, modules:modules(*, lessons:lessons(*))')
                  .eq('id', courseId)
                  .single();
                if (!full) return [];
                const rawModules = (full.modules as Record<string, unknown>[]) || [];
                return rawModules.map((mr: Record<string, unknown>) => {
                  const rawLessons = (mr.lessons as Record<string, unknown>[]) || [];
                  return mapModuleRow(mr, rawLessons.map(mapLessonRow));
                });
              })();

          const updated = mapCourseRow(cr, modules);
          const idx = coursesData.findIndex(c => c.id === courseId);
          if (idx !== -1) coursesData = [...coursesData.slice(0, idx), updated, ...coursesData.slice(idx + 1)];
          else coursesData = [...coursesData, updated];
          return updated;
        }
      }
    }
  }

  const index = coursesData.findIndex(c => c.id === courseId);
  if (index === -1) return null;
  const updated = { ...coursesData[index], ...courseData };
  coursesData = [...coursesData.slice(0, index), updated, ...coursesData.slice(index + 1)];
  return updated;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from('courses').delete().eq('id', courseId);
    if (!error) {
      coursesData = coursesData.filter(c => c.id !== courseId);
      return true;
    }
  }
  const index = coursesData.findIndex(c => c.id === courseId);
  if (index === -1) return false;
  coursesData = [...coursesData.slice(0, index), ...coursesData.slice(index + 1)];
  return true;
}
