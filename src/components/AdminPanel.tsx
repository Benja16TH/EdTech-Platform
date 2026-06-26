import { useState } from 'react';
import { Plus, CreditCard as Edit2, X, ArrowLeft, Save, BookOpen, Users, BarChart3, Layers, Trash2, Check, Headphones } from 'lucide-react';
import { Course, User, CourseLevel, CourseStatus } from '../types';

interface AdminPanelProps {
  courses: Course[];
  user: User;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onBack: () => void;
  onNavigate: (
  view:
    | 'modules'
    | 'assignment'
    | 'analytics'
    | 'admin-support'
    | 'certificates'
    | 'user-management'
) => void;
}

interface CourseForm {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel | '';
  duration: string;
  learningObjectives: string[];
  status: CourseStatus | '';
  thumbnail: string;
}

const initialFormState: CourseForm = {
  id: '',
  title: '',
  description: '',
  category: '',
  level: '',
  duration: '',
  learningObjectives: [''],
  status: 'active',
  thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const levelOptions: CourseLevel[] = ['Básico', 'Intermedio', 'Avanzado'];

const durationOptions = [
  '2 horas',
  '4 horas',
  '8 horas',
  '12 horas',
  '16 horas',
  '20 horas',
  '24 horas',
  '40 horas',
];

export default function AdminPanel({ courses, user, onAddCourse, onUpdateCourse, onDeleteCourse, onBack, onNavigate }: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseForm>(initialFormState);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenNewForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setFormData({
      id: course.id,
      title: course.title,
      description: course.description || '',
      category: course.category,
      level: (course.level as CourseLevel) || '',
      duration: course.duration,
      learningObjectives: course.learningObjectives?.length > 0 ? [...course.learningObjectives] : [''],
      status: (course.status as CourseStatus) || 'active',
      thumbnail: course.thumbnail,
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.duration || !formData.level) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const objectives = formData.learningObjectives.filter(obj => obj.trim() !== '');

    if (editingId) {
      const existingCourse = courses.find(c => c.id === editingId);
      if (existingCourse) {
        onUpdateCourse({
          ...existingCourse,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          level: formData.level as CourseLevel,
          duration: formData.duration,
          learningObjectives: objectives,
          status: formData.status as CourseStatus,
          thumbnail: formData.thumbnail,
        });
        setSuccessMessage('Curso actualizado exitosamente');
      }
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level as CourseLevel,
        duration: formData.duration,
        learningObjectives: objectives,
        status: formData.status as CourseStatus,
        thumbnail: formData.thumbnail,
        modules: [
          {
            id: 'm1',
            title: 'Módulo 1: Introducción',
            orderIndex: 1,
            lessons: [
              {
                id: 'l1',
                title: 'Lección introductoria',
                duration: '15 min',
              },
            ],
          },
        ],
      };
      onAddCourse(newCourse);
      setSuccessMessage('Curso creado exitosamente');
    }

    setShowForm(false);
    setFormData(initialFormState);
    setEditingId(null);

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updated = [...formData.learningObjectives];
    updated[index] = value;
    setFormData({ ...formData, learningObjectives: updated });
  };

  const handleAddObjective = () => {
    setFormData({ ...formData, learningObjectives: [...formData.learningObjectives, ''] });
  };

  const handleRemoveObjective = (index: number) => {
    const updated = formData.learningObjectives.filter((_, i) => i !== index);
    setFormData({ ...formData, learningObjectives: updated.length > 0 ? updated : [''] });
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    if (confirm(`¿Estás seguro de eliminar el curso "${courseTitle}"? Esta acción no se puede deshacer.`)) {
      onDeleteCourse(courseId);
      setSuccessMessage('Curso eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
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
                <span className="font-medium">Volver</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Administrador</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-2 mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => {}}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Cursos
            </button>
            <button
              onClick={() => onNavigate('modules')}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              <Layers className="w-5 h-5 mr-2" />
              Módulos
            </button>
            <button
              onClick={() => onNavigate('assignment')}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              <Users className="w-5 h-5 mr-2" />
              Asignación
            </button>
            <button
              onClick={() => onNavigate('user-management')}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              <Users className="w-5 h-5 mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analíticas
            </button>
            <button
  onClick={() => onNavigate('admin-support')}
  className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
>
  <Headphones className="w-5 h-5 mr-2" />
  Soporte
</button>

<button
  onClick={() => onNavigate('certificates')}
  className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
>
  <Check className="w-5 h-5 mr-2" />
  Certificados
</button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Cursos</h2>
            <p className="text-gray-600 mt-1">Administra el catálogo de capacitación corporativa</p>
          </div>
          <button
            onClick={handleOpenNewForm}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear nuevo curso
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center shadow-md">
            <Check className="w-5 h-5 mr-3 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingId ? 'Editar curso' : 'Crear nuevo curso'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título del curso *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Liderazgo Avanzado"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el contenido y propósito del curso"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Gestión">Gestión</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Atención al Cliente">Atención al Cliente</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Desarrollo Personal">Desarrollo Personal</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nivel del curso *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona el nivel</option>
                    {levelOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duración *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona la duración</option>
                    {durationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Objetivos de aprendizaje
                  </label>
                  <div className="space-y-2">
                    {formData.learningObjectives.map((obj, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={obj}
                          onChange={(e) => handleObjectiveChange(index, e.target.value)}
                          placeholder={`Objetivo ${index + 1}`}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveObjective(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddObjective}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Agregar objetivo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado del curso
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CourseStatus })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Guardar cambios' : 'Crear curso'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    course.level === 'Básico' ? 'bg-green-100 text-green-700' :
                    course.level === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {course.level}
                  </span>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {course.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <span className="font-medium">Duración:</span>
                  <span className="ml-2">{course.duration}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    {course.modules.length} módulos • {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lecciones
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="flex items-center px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No hay cursos aún</p>
            <button
              onClick={handleOpenNewForm}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear primer curso
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
