import { useState } from 'react';
import { ArrowLeft, Plus, CreditCard as Edit2, Trash2, GripVertical, Save, X, Check, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { Course, Module, Lesson, User } from '../types';

interface ModuleManagementProps {
  courses: Course[];
  user: User;
  onUpdateCourse: (course: Course) => void;
  onBack: () => void;
  onManageAssessment?: (courseId: string) => void;
}

export default function ModuleManagement({ courses, user, onUpdateCourse, onBack, onManageAssessment }: ModuleManagementProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ module: Module; lesson: Lesson } | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    orderIndex: 0,
  });
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    duration: '15 min',
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setEditingModule(null);
    setEditingLesson(null);
    setShowModuleForm(false);
    setShowLessonForm(false);
  };

  // ===== MODULE FUNCTIONS =====
  const handleNewModule = () => {
    setModuleFormData({
      title: '',
      description: '',
      orderIndex: selectedCourse ? selectedCourse.modules.length + 1 : 1,
    });
    setEditingModule(null);
    setShowModuleForm(true);
  };

  const handleEditModule = (module: Module) => {
    setModuleFormData({
      title: module.title,
      description: module.description || '',
      orderIndex: module.orderIndex,
    });
    setEditingModule(module);
    setShowModuleForm(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse || !moduleFormData.title.trim()) return;

    const updatedModules = [...selectedCourse.modules];

    if (editingModule) {
      const index = updatedModules.findIndex(m => m.id === editingModule.id);
      if (index !== -1) {
        updatedModules[index] = {
          ...updatedModules[index],
          title: moduleFormData.title,
          description: moduleFormData.description,
          orderIndex: moduleFormData.orderIndex,
        };
      }
      setSuccessMessage('Módulo actualizado exitosamente');
    } else {
      const newModule: Module = {
        id: Date.now().toString(),
        title: moduleFormData.title,
        description: moduleFormData.description,
        orderIndex: moduleFormData.orderIndex,
        lessons: [],
      };
      updatedModules.push(newModule);
      setSuccessMessage('Módulo creado exitosamente');
    }

    updatedModules.sort((a, b) => a.orderIndex - b.orderIndex);

    onUpdateCourse({
      ...selectedCourse,
      modules: updatedModules,
    });

    setShowModuleForm(false);
    setEditingModule(null);
    setModuleFormData({ title: '', description: '', orderIndex: 0 });

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!selectedCourse) return;

    if (!confirm('¿Estás seguro de eliminar este módulo? Esto también eliminará todas sus lecciones.')) {
      return;
    }

    const updatedModules = selectedCourse.modules.filter(m => m.id !== moduleId);

    onUpdateCourse({
      ...selectedCourse,
      modules: updatedModules,
    });

    setSuccessMessage('Módulo eliminado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleMoveModule = (moduleId: string, direction: 'up' | 'down') => {
    if (!selectedCourse) return;

    const modules = [...selectedCourse.modules];
    const index = modules.findIndex(m => m.id === moduleId);

    if (direction === 'up' && index > 0) {
      [modules[index], modules[index - 1]] = [modules[index - 1], modules[index]];
      modules.forEach((m, i) => m.orderIndex = i + 1);
    } else if (direction === 'down' && index < modules.length - 1) {
      [modules[index], modules[index + 1]] = [modules[index + 1], modules[index]];
      modules.forEach((m, i) => m.orderIndex = i + 1);
    }

    onUpdateCourse({
      ...selectedCourse,
      modules,
    });

    setSuccessMessage('Orden de módulos actualizado');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // ===== LESSON FUNCTIONS =====
  const handleNewLesson = (module: Module) => {
    setLessonFormData({
      title: '',
      duration: '15 min',
    });
    setEditingLesson(null);
    setEditingModule(module);
    setShowLessonForm(true);
  };

  const handleEditLesson = (module: Module, lesson: Lesson) => {
    setLessonFormData({
      title: lesson.title,
      duration: lesson.duration,
    });
    setEditingModule(module);
    setEditingLesson({ module, lesson });
    setShowLessonForm(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse || !editingModule || !lessonFormData.title.trim()) return;

    const updatedModules = selectedCourse.modules.map(m => {
      if (m.id === editingModule.id) {
        if (editingLesson) {
          return {
            ...m,
            lessons: m.lessons.map(l =>
              l.id === editingLesson.lesson.id
                ? { ...l, title: lessonFormData.title, duration: lessonFormData.duration }
                : l
            ),
          };
        } else {
          const newLesson: Lesson = {
            id: `lesson_${Date.now()}`,
            title: lessonFormData.title,
            duration: lessonFormData.duration,
          };
          return {
            ...m,
            lessons: [...m.lessons, newLesson],
          };
        }
      }
      return m;
    });

    onUpdateCourse({
      ...selectedCourse,
      modules: updatedModules,
    });

    setSuccessMessage(editingLesson ? 'Lección actualizada exitosamente' : 'Lección agregada exitosamente');
    setShowLessonForm(false);
    setEditingLesson(null);
    setEditingModule(null);
    setLessonFormData({ title: '', duration: '15 min' });

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteLesson = (module: Module, lessonId: string) => {
    if (!selectedCourse) return;

    if (!confirm('¿Estás seguro de eliminar esta lección?')) {
      return;
    }

    const updatedModules = selectedCourse.modules.map(m => {
      if (m.id === module.id) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId),
        };
      }
      return m;
    });

    onUpdateCourse({
      ...selectedCourse,
      modules: updatedModules,
    });

    setSuccessMessage('Lección eliminada exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleMoveLessonUp = (module: Module, lessonId: string) => {
    if (!selectedCourse) return;

    const updatedModules = selectedCourse.modules.map(m => {
      if (m.id === module.id) {
        const lessons = [...m.lessons];
        const index = lessons.findIndex(l => l.id === lessonId);
        if (index > 0) {
          [lessons[index], lessons[index - 1]] = [lessons[index - 1], lessons[index]];
        }
        return { ...m, lessons };
      }
      return m;
    });

    onUpdateCourse({
      ...selectedCourse,
      modules: updatedModules,
    });
  };

  const handleMoveLessonDown = (module: Module, lessonId: string) => {
    if (!selectedCourse) return;

    const updatedModules = selectedCourse.modules.map(m => {
      if (m.id === module.id) {
        const lessons = [...m.lessons];
        const index = lessons.findIndex(l => l.id === lessonId);
        if (index < lessons.length - 1) {
          [lessons[index], lessons[index + 1]] = [lessons[index + 1], lessons[index]];
        }
        return { ...m, lessons };
      }
      return m;
    });

    onUpdateCourse({
      ...selectedCourse,
      modules: updatedModules,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver al Panel Admin</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Gestión de Módulos y Lecciones</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Módulos y Lecciones</h2>
          <p className="text-gray-600 mt-1">Administra los módulos y lecciones de cada curso</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center shadow-md">
            <Check className="w-5 h-5 mr-3 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">Cursos</h3>
                <p className="text-blue-100 text-sm">Selecciona un curso</p>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => handleSelectCourse(course.id)}
                    className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors ${
                      selectedCourseId === course.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{course.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{course.modules.length} módulos</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedCourse ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h3>
                    <p className="text-gray-600">{selectedCourse.category}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onManageAssessment?.(selectedCourse.id)}
                      className="flex items-center px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                    >
                      <Award className="w-5 h-5 mr-2" />
                      Evaluación Final
                    </button>
                    <button
                      onClick={handleNewModule}
                      className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo módulo
                    </button>
                  </div>
                </div>

                {/* MODULE FORM MODAL */}
                {showModuleForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                      <div className="flex items-center justify-between p-6 border-b">
                        <h4 className="text-xl font-bold text-gray-800">
                          {editingModule ? 'Editar módulo' : 'Crear nuevo módulo'}
                        </h4>
                        <button
                          onClick={() => setShowModuleForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveModule} className="p-6 space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Título del módulo *
                          </label>
                          <input
                            type="text"
                            value={moduleFormData.title}
                            onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                            placeholder="Ej: Módulo 1: Introducción"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción breve
                          </label>
                          <textarea
                            value={moduleFormData.description}
                            onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                            placeholder="Describe brevemente el contenido del módulo"
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Orden de secuencia
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={moduleFormData.orderIndex}
                            onChange={(e) => setModuleFormData({ ...moduleFormData, orderIndex: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex space-x-3 pt-4 border-t">
                          <button
                            type="button"
                            onClick={() => setShowModuleForm(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* LESSON FORM MODAL */}
                {showLessonForm && editingModule && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                      <div className="flex items-center justify-between p-6 border-b">
                        <h4 className="text-xl font-bold text-gray-800">
                          {editingLesson ? 'Editar lección' : 'Agregar lección'}
                        </h4>
                        <button
                          onClick={() => setShowLessonForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveLesson} className="p-6 space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Módulo
                          </label>
                          <p className="text-sm text-gray-600">{editingModule.title}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Título de la lección *
                          </label>
                          <input
                            type="text"
                            value={lessonFormData.title}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                            placeholder="Ej: Lección 1: Conceptos básicos"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duración
                          </label>
                          <input
                            type="text"
                            value={lessonFormData.duration}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, duration: e.target.value })}
                            placeholder="Ej: 15 min"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex space-x-3 pt-4 border-t">
                          <button
                            type="button"
                            onClick={() => setShowLessonForm(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* MODULES LIST */}
                {selectedCourse.modules.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-gray-600 mb-4">Este curso no tiene módulos</p>
                    <button
                      onClick={handleNewModule}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Crear primer módulo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedCourse.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* MODULE HEADER */}
                        <div className="p-6 flex items-center justify-between border-b bg-gradient-to-r from-gray-50 to-blue-50">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="text-gray-400">
                              <GripVertical className="w-6 h-6" />
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {moduleIndex + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800">{module.title}</h4>
                              {module.description && (
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMoveModule(module.id, 'up')}
                              disabled={moduleIndex === 0}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Subir"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveModule(module.id, 'down')}
                              disabled={moduleIndex === selectedCourse.modules.length - 1}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Bajar"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            >
                              {expandedModuleId === module.id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditModule(module)}
                              className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-all"
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module.id)}
                              className="flex items-center px-3 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-all"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </div>

                        {/* LESSONS SECTION */}
                        {expandedModuleId === module.id && (
                          <div className="p-6 bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-semibold text-gray-800">Lecciones ({module.lessons.length})</h5>
                              <button
                                onClick={() => handleNewLesson(module)}
                                className="flex items-center px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Agregar lección
                              </button>
                            </div>

                            {module.lessons.length === 0 ? (
                              <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                                <p className="text-gray-600 mb-3">Este módulo no tiene lecciones</p>
                                <button
                                  onClick={() => handleNewLesson(module)}
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Agregar primera lección
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200 hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex items-center space-x-3 flex-1">
                                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                        {lessonIndex + 1}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{lesson.title}</p>
                                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleMoveLessonUp(module, lesson.id)}
                                        disabled={lessonIndex === 0}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Subir lección"
                                      >
                                        <ChevronUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleMoveLessonDown(module, lesson.id)}
                                        disabled={lessonIndex === module.lessons.length - 1}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Bajar lección"
                                      >
                                        <ChevronDown className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleEditLesson(module, lesson)}
                                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all"
                                      >
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(module, lesson.id)}
                                        className="px-3 py-1 text-sm bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all"
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">Selecciona un curso para gestionar sus módulos y lecciones</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
