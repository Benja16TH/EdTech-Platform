import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Circle, Play, Lock, Award, Video, FileText } from 'lucide-react';
import { Course, UserEnrollment } from '../types';

interface VirtualClassroomProps {
  course: Course;
  userEnrollment?: UserEnrollment;
  onBack: () => void;
  onProgressUpdate: (courseId: string, lessonId: string) => void;
  onStartAssessment?: () => void;
}

export default function VirtualClassroom({ course, userEnrollment, onBack, onProgressUpdate, onStartAssessment }: VirtualClassroomProps) {
  const completedLessonIds = userEnrollment?.completedLessons || [];

  const allLessons = course.modules.flatMap(module =>
    module.lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title,
      moduleId: module.id,
      completed: completedLessonIds.includes(lesson.id),
    }))
  );

  const currentLessonIndex = allLessons.findIndex(l => !l.completed);
  const [activeLessonIndex, setActiveLessonIndex] = useState(
    currentLessonIndex >= 0 ? currentLessonIndex : 0
  );

  const activeLesson = allLessons[activeLessonIndex];
  const completedCount = allLessons.filter(l => l.completed).length;
  const progressPercentage = Math.round((completedCount / allLessons.length) * 100);

  useEffect(() => {
    setActiveLessonIndex(currentLessonIndex >= 0 ? currentLessonIndex : 0);
  }, [currentLessonIndex, userEnrollment?.userId]);

  const handlePreviousLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  const handleCompleteAndNext = () => {
    onProgressUpdate(course.id, activeLesson.id);
    if (activeLessonIndex < allLessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const getLessonGlobalIndex = (moduleIndex: number, lessonIndex: number) => {
    return course.modules
      .slice(0, moduleIndex)
      .reduce((sum, m) => sum + m.lessons.length, 0) + lessonIndex;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver al inicio</span>
              </button>
              <div className="hidden md:block w-px h-6 bg-gray-300" />
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-800">{course.title}</h1>
                <p className="text-sm text-gray-500">{course.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Progreso total</p>
                <p className="text-lg font-bold text-blue-600">{progressPercentage}%</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke="#0891b2" strokeWidth="6" fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeLesson?.videoUrl ? (
              <div className="bg-black rounded-xl overflow-hidden shadow-xl mb-6 aspect-video">
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl mb-6 aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10" />
                <div className="relative z-10 text-center text-white">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-lg font-medium">{activeLesson?.title}</p>
                  <p className="text-sm text-gray-400 mt-2">Contenido sin video — material de lectura</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                {activeLesson?.videoUrl ? (
                  <Video className="w-5 h-5 text-blue-500" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-500" />
                )}
                <h2 className="text-2xl font-bold text-gray-800">{activeLesson?.title}</h2>
              </div>

              {activeLesson?.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">{activeLesson.description}</p>
              )}

              {!activeLesson?.description && (
                <p className="text-gray-500 mb-6 italic">Sin descripción disponible para esta lección.</p>
              )}

              {activeLessonIndex === 0 && activeLesson?.completed === false && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Acerca de este curso</h3>
                  <p className="text-sm text-blue-700 mb-3">{course.description}</p>
                  {course.learningObjectives.length > 0 && (
                    <>
                      <h4 className="font-semibold text-blue-800 text-sm mb-1">Objetivos de aprendizaje:</h4>
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {course.learningObjectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handlePreviousLesson}
                  disabled={activeLessonIndex === 0}
                  className="flex items-center px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Lección anterior
                </button>

                <button
                  onClick={handleCompleteAndNext}
                  disabled={activeLessonIndex === allLessons.length - 1 && activeLesson?.completed}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeLesson?.completed ? 'Siguiente lección' : 'Completar y continuar'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">Contenido del curso</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {completedCount} de {allLessons.length} lecciones completadas
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border-b last:border-b-0">
                    <div className="px-6 py-3 bg-gray-50 border-l-4 border-blue-500">
                      <h4 className="font-bold text-gray-800 text-sm">{module.title}</h4>
                      {module.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{module.description}</p>
                      )}
                    </div>

                    {module.lessons.map((lesson, lessonIndex) => {
                      const globalIndex = getLessonGlobalIndex(moduleIndex, lessonIndex);
                      const isActive = globalIndex === activeLessonIndex;
                      const isCompleted = completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonIndex(globalIndex)}
                          className={`w-full px-6 py-3 flex items-start space-x-3 hover:bg-blue-50 transition-colors ${
                            isActive ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isActive ? 'text-blue-600' : isCompleted ? 'text-gray-600' : 'text-gray-800'
                            }`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500">{lesson.duration}</span>
                              {lesson.videoUrl && (
                                <span className="inline-flex items-center text-xs text-blue-500">
                                  <Video className="w-3 h-3 mr-0.5" />
                                  Video
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {progressPercentage === 100 && (
                <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
                  <button
                    onClick={onStartAssessment}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <Award className="w-5 h-5" />
                    Evaluación Final
                  </button>
                  <p className="text-xs text-amber-700 mt-2 text-center">
                    Todas las lecciones completadas. ¡Listo para la evaluación!
                  </p>
                </div>
              )}

              {progressPercentage < 100 && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Evaluación disponible al completar todas las lecciones</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
