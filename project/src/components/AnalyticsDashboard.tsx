import { ArrowLeft, Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { User } from '../types';


import {
  Course,
  UserEnrollment,
  CourseAssignment,
  UserAssessmentAttempt,
  Certificate
} from '../types';

interface AnalyticsDashboardProps {
  user: User;
  courses: Course[];
  enrollments: UserEnrollment[];
  assignments: CourseAssignment[];
  assessmentAttempts: UserAssessmentAttempt[];
  certificates: Certificate[];
  users: User[];
  onBack: () => void;
}

export default function AnalyticsDashboard({
  user,
  courses,
  enrollments,
  assignments,
  assessmentAttempts,
  certificates,
  users,
  onBack
}: AnalyticsDashboardProps) {
const totalCollaborators =
  users.filter(u => u.role === 'collaborator').length;

const completedCourses =
  enrollments.filter(e => e.courseCompleted).length;

const inProgressCourses =
  enrollments.filter(
    e =>
      e.progress > 0 &&
      !e.courseCompleted
  ).length;

const completionRate =
  assignments.length > 0
    ? Math.round(
        (completedCourses / assignments.length) * 100
      )
    : 0;

const approvedAssessments =
  assessmentAttempts.filter(a => a.passed).length;

const issuedCertificates =
  certificates.length;

const averageProgress =
  enrollments.length > 0
    ? Math.round(
        enrollments.reduce(
          (sum, e) => sum + e.progress,
          0
        ) / enrollments.length
      )
    : 0;
  const coursesByCategory = Object.values(
  enrollments
    .filter(e => e.courseCompleted)
    .reduce((acc, enrollment) => {
      const course = courses.find(c => c.id === enrollment.courseId);
      if (!course) return acc;
      if (!acc[course.category]) {
        acc[course.category] = {
          category: course.category,
          count: 0
        };
      }
      acc[course.category].count += 1;
      return acc;
    }, {} as Record<string, { category: string; count: number }>)
);
const analytics = {
  totalCollaborators,
  completedCourses,
  inProgressCourses,
  completionRate,
  approvedAssessments,
  issuedCertificates,
  averageProgress,
  coursesByCategory,
  topCollaborators: users
    .filter(user => user.role === 'collaborator')
    .map(user => {
      const userEnrollments = enrollments.filter(e => e.userId === user.id);
      const completedCourses = userEnrollments.filter(e => e.courseCompleted).length;
      const assignedCourses = assignments.filter(a => a.userId === user.id).length;
      const avgProgress = userEnrollments.length > 0
        ? Math.round(userEnrollments.reduce((s, e) => s + e.progress, 0) / userEnrollments.length)
        : 0;
      const passedAssessments = assessmentAttempts.filter(
        a => a.userId === user.id && a.passed
      ).length;

      return {
        name: user.name,
        completedCourses,
        assignedCourses,
        avgProgress,
        passedAssessments,
        completionRate: assignedCourses > 0 ? Math.round((completedCourses / assignedCourses) * 100) : 0
      };
    })
    .sort((a, b) => b.completionRate - a.completionRate || b.completedCourses - a.completedCourses)
    .slice(0, 5),
};

const maxCategoryCount = Math.max(
  1,
  ...analytics.coursesByCategory.map(c => c.count)
);

  const totalCourses = analytics.completedCourses + analytics.inProgressCourses;

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
                <p className="text-sm text-gray-600">Analíticas de Capacitación</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Analíticas de Capacitación</h2>
          <p className="text-gray-600 mt-1">Visualiza el estado general de la capacitación en la organización</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">ACTIVOS</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{analytics.totalCollaborators}</p>
            <p className="text-sm text-gray-600 mt-1">Colaboradores activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">COMPLETADOS</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{analytics.completedCourses}</p>
            <p className="text-sm text-gray-600 mt-1">Cursos completados</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">EN PROGRESO</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{analytics.inProgressCourses}</p>
            <p className="text-sm text-gray-600 mt-1">Cursos en progreso</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">TASA</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{analytics.completionRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Tasa de finalización</p>
          </div>


        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Colaboradores</h3>
            <div className="space-y-4">
              {analytics.topCollaborators.map((collaborator, index) => {
                const colors = [
                  'from-amber-400 to-orange-500',
                  'from-blue-500 to-cyan-400',
                  'from-teal-500 to-emerald-400',
                  'from-rose-500 to-pink-400',
                  'from-sky-500 to-indigo-400',
                ];

                const maxBar = analytics.topCollaborators[0].completionRate || 1;

                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${colors[index]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{collaborator.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{collaborator.completionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[index]} transition-all rounded-full`}
                        style={{ width: `${(collaborator.completionRate / maxBar) * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Completados</p>
                        <p className="text-sm font-bold text-gray-800">{collaborator.completedCourses}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Asignados</p>
                        <p className="text-sm font-bold text-gray-800">{collaborator.assignedCourses}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Progreso</p>
                        <p className="text-sm font-bold text-gray-800">{collaborator.avgProgress}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {analytics.topCollaborators.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No hay datos de colaboradores</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Cursos completados por categoría</h3>
            <div className="h-64 flex flex-col justify-center space-y-4">
              {analytics.coursesByCategory.map((category, index) => {
                const colors = [
                  'from-blue-600 to-cyan-500',
                  'from-teal-500 to-emerald-400',
                  'from-amber-500 to-orange-400',
                  'from-rose-500 to-pink-400',
                  'from-sky-500 to-blue-400',
                ];

                return (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-32 text-sm text-gray-700 font-medium truncate">
                      {category.category}
                    </span>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all flex items-center justify-end pr-3`}
                        style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                      >
                        <span className="text-white text-sm font-bold">{category.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Resumen ejecutivo</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#0891b2"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - totalCourses / 50)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{totalCourses}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">Total cursos activos</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#10b981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - analytics.completionRate / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{analytics.completionRate}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">Tasa de finalización</p>
            </div>


          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">ESTADÍSTICA DESTACADA</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((analytics.completedCourses / totalCourses) * 100)}% de los cursos activos han sido completados
                </p>
              </div>
              <TrendingUp className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
