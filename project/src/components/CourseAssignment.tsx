import { useState } from 'react';
import { ArrowLeft, Search, UserPlus, Check, Users, BookOpen, X } from 'lucide-react';
import { Course, User, CourseAssignment as CourseAssignmentType } from '../types';
import { mockCollaborators } from '../data/extendedMockData';

interface CourseAssignmentProps {
  courses: Course[];
  assignments: CourseAssignmentType[];
  user: User;
  onAssignCourse: (userId: string, courseId: string) => void;
  onUnassignCourse: (userId: string, courseId: string) => void;
  onBack: () => void;
}

export default function CourseAssignment({
  courses,
  assignments,
  user,
  onAssignCourse,
  onUnassignCourse,
  onBack
}: CourseAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredCollaborators = mockCollaborators.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const collaboratorAssignments = selectedCollaborator
    ? assignments.filter(a => a.userId === selectedCollaborator.id)
    : [];

  const isCourseAssigned = (courseId: string) => {
    return collaboratorAssignments.some(a => a.courseId === courseId);
  };

  const handleAssign = () => {
    if (!selectedCollaborator || !selectedCourse) return;

    if (isCourseAssigned(selectedCourse.id)) {
      alert('Este colaborador ya tiene asignado este curso');
      return;
    }

    onAssignCourse(selectedCollaborator.id, selectedCourse.id);
    setSuccessMessage(`Curso "${selectedCourse.title}" asignado exitosamente a ${selectedCollaborator.name}`);
    setSelectedCourse(null);

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleRemoveAssignment = (courseId: string, courseTitle: string) => {
    if (!selectedCollaborator) return;

    if (!confirm(`¿Estás seguro de eliminar la asignación del curso "${courseTitle}"?`)) return;

    onUnassignCourse(selectedCollaborator.id, courseId);
    setSuccessMessage('Asignación eliminada exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getCourseById = (courseId: string) => {
    return courses.find(c => c.id === courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
                <p className="text-sm text-gray-600">Asignación de Cursos</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Asignación de Cursos</h2>
          <p className="text-gray-600 mt-1">Asigna cursos a colaboradores de la organización</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-3 text-green-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Colaboradores
                </h3>
              </div>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto divide-y">
                {filteredCollaborators.map(collab => (
                  <button
                    key={collab.id}
                    onClick={() => {
                      setSelectedCollaborator(collab);
                      setSelectedCourse(null);
                    }}
                    className={`w-full px-6 py-4 text-left hover:bg-teal-50 transition-colors ${
                      selectedCollaborator?.id === collab.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {collab.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{collab.name}</p>
                        <p className="text-xs text-gray-500">{collab.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredCollaborators.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No se encontraron colaboradores
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedCollaborator ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedCollaborator.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedCollaborator.name}</h3>
                        <p className="text-sm text-gray-500">{selectedCollaborator.email}</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-teal-100 text-teal-700 font-semibold rounded-lg">
                      {collaboratorAssignments.length} cursos asignados
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-teal-600" />
                      Asignar nuevo curso
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {courses.filter(c => c.status === 'active').map(course => {
                        const assigned = isCourseAssigned(course.id);
                        return (
                          <button
                            key={course.id}
                            onClick={() => !assigned && setSelectedCourse(course)}
                            disabled={assigned}
                            className={`p-4 text-left rounded-lg border-2 transition-all ${
                              assigned
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                : selectedCourse?.id === course.id
                                ? 'border-teal-600 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'
                            }`}
                          >
                            <p className="font-semibold text-gray-800">{course.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{course.category} - {course.level}</p>
                            {assigned && (
                              <span className="inline-block mt-2 text-xs text-green-600 font-medium">
                                Ya asignado
                              </span>
                            )}
                          </button>
                        );
                      })}
                      {courses.filter(c => c.status === 'active').length === 0 && (
                        <div className="col-span-2 p-4 text-center text-gray-500">
                          No hay cursos activos disponibles
                        </div>
                      )}
                    </div>

                    {selectedCourse && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Curso seleccionado:</p>
                            <p className="font-bold text-gray-800">{selectedCourse.title}</p>
                          </div>
                          <button
                            onClick={handleAssign}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg"
                          >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Asignar curso
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Cursos asignados ({collaboratorAssignments.length})</h3>
                  </div>

                  {collaboratorAssignments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Este colaborador no tiene cursos asignados
                    </div>
                  ) : (
                    <div className="divide-y">
                      {collaboratorAssignments.map(assignment => {
                        const course = getCourseById(assignment.courseId);
                        return (
                          <div
                            key={assignment.id}
                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{course?.title || 'Curso no encontrado'}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  Asignado: {assignment.assignedAt.toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {course?.category}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveAssignment(assignment.courseId, course?.title || '')}
                              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium text-sm rounded-lg transition-all"
                            >
                              Eliminar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Selecciona un colaborador para gestionar sus asignaciones</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
