import { ArrowLeft, Mail, Shield, User as UserIcon, Briefcase, Building, CheckCircle, Award, BookOpen, FileText, Activity } from 'lucide-react';
import { User, Course, UserEnrollment, CourseAssignment, UserAssessmentAttempt, Certificate } from '../types';

interface EmployeeProfileProps {
  profileUser: User;
  courses: Course[];
  enrollments: UserEnrollment[];
  assignments: CourseAssignment[];
  assessmentAttempts: UserAssessmentAttempt[];
  certificates: Certificate[];
  onBack: () => void;
}

interface ActivityEvent {
  id: string;
  type: 'user_created' | 'course_assigned' | 'course_completed' | 'assessment_passed' | 'certificate_issued';
  description: string;
  date: Date;
}

export default function EmployeeProfile({
  profileUser,
  courses,
  enrollments,
  assignments,
  assessmentAttempts,
  certificates,
  onBack,
}: EmployeeProfileProps) {
  const userEnrollments = enrollments.filter(e => e.userId === profileUser.id);
  const userAssignments = assignments.filter(a => a.userId === profileUser.id);
  const userCertificates = certificates.filter(c => c.userId === profileUser.id);
  const userAssessmentAttempts = assessmentAttempts.filter(a => a.userId === profileUser.id);

  const completedCourses = userEnrollments.filter(e => e.courseCompleted).length;
  const inProgressCourses = userEnrollments.filter(e => e.progress > 0 && !e.courseCompleted).length;
  const assignedCourses = userAssignments.length;
  const passedAssessments = userAssessmentAttempts.filter(a => a.passed).length;
  const avgProgress = userEnrollments.length > 0
    ? Math.round(userEnrollments.reduce((s, e) => s + e.progress, 0) / userEnrollments.length)
    : 0;

  const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.title || 'Curso eliminado';

  const activityEvents: ActivityEvent[] = [
    ...(profileUser.createdAt ? [{
      id: 'created',
      type: 'user_created' as const,
      description: `${profileUser.name} fue registrado en la plataforma`,
      date: profileUser.createdAt,
    }] : []),
    ...userAssignments.map(a => ({
      id: `assign_${a.id}`,
      type: 'course_assigned' as const,
      description: `Curso asignado: "${getCourseName(a.courseId)}"`,
      date: a.assignedAt,
    })),
    ...userAssessmentAttempts.filter(a => a.passed).map(a => ({
      id: `assess_${a.id}`,
      type: 'assessment_passed' as const,
      description: `Evaluación aprobada: "${getCourseName(a.courseId)}"`,
      date: a.attemptedAt,
    })),
    ...userCertificates.map(c => ({
      id: `cert_${c.id}`,
      type: 'certificate_issued' as const,
      description: `Certificado generado: "${getCourseName(c.courseId)}"`,
      date: c.issueDate,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver</span>
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Perfil de empleado</p>
              <p className="font-semibold text-gray-800">{profileUser.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg">
                {profileUser.name.charAt(0)}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{profileUser.name}</h2>
                <p className="text-blue-200 mt-1">{profileUser.position || 'Sin cargo asignado'}{profileUser.department ? ` · ${profileUser.department}` : ''}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${profileUser.role === 'admin' ? 'bg-purple-500 text-white' : 'bg-blue-400 text-white'}`}>
                    {profileUser.role === 'admin' ? 'Administrador' : 'Colaborador'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${profileUser.active !== false ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}>
                    {profileUser.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Información personal
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profileUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{profileUser.position || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{profileUser.department || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>{profileUser.role === 'admin' ? 'Administrador' : 'Colaborador'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Capacitación
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{assignedCourses}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Asignados</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">{completedCourses}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">Completados</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-700">{inProgressCourses}</p>
                    <p className="text-xs text-yellow-600 font-medium mt-1">En progreso</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">{userCertificates.length}</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">Certificados</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Progreso promedio</span>
                <span className="text-sm font-bold text-gray-800">{avgProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all" style={{ width: `${avgProgress}%` }} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700 font-medium">Evaluaciones aprobadas</span>
                </div>
                <span className="text-lg font-bold text-gray-800">{passedAssessments}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700 font-medium">Cursos completados</span>
                </div>
                <span className="text-lg font-bold text-gray-800">{completedCourses}</span>
              </div>
            </div>
          </div>
        </div>

        {assignedCourses > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="px-8 py-5 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Cursos asignados
              </h3>
            </div>
            <div className="px-8 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.filter(c => userAssignments.some(a => a.courseId === c.id)).map(course => {
                  const enrollment = userEnrollments.find(e => e.courseId === course.id);
                  return (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800">{course.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{course.category}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          enrollment?.courseCompleted ? 'bg-green-100 text-green-700' :
                          enrollment && enrollment.progress > 0 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {enrollment?.courseCompleted ? 'Completado' :
                           enrollment && enrollment.progress > 0 ? `${enrollment.progress}%` :
                           'Sin iniciar'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-8 py-5 border-b bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Historial de actividad
            </h3>
          </div>
          <div className="px-8 py-5">
            {activityEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No hay actividad registrada</p>
            ) : (
              <div className="space-y-4">
                {activityEvents.slice(0, 20).map(event => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.type === 'user_created' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'course_assigned' ? 'bg-amber-100 text-amber-600' :
                      event.type === 'course_completed' || event.type === 'assessment_passed' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {event.type === 'user_created' ? <UserIcon className="w-4 h-4" /> :
                       event.type === 'course_assigned' ? <BookOpen className="w-4 h-4" /> :
                       event.type === 'assessment_passed' ? <CheckCircle className="w-4 h-4" /> :
                       <Award className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {event.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}