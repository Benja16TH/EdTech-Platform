import { Search, BookOpen, Clock, LogOut, Settings, HelpCircle, User as UserIcon } from 'lucide-react';
import { Course, UserEnrollment, User, Notification, Certificate } from '../types';
import { useState } from 'react';
import NotificationCenter from './NotificationCenter';
import CertificateModal from './CertificateModal';

interface DashboardProps {
  courses: Course[];
  enrollments: UserEnrollment[];
  user: User;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  certificates: Certificate[];
  onCourseSelect: (courseId: string) => void;
  onLogout: () => void;
  onAdminAccess?: () => void;
  onSupportAccess?: () => void;
  onViewProfile?: (userId: string) => void;
}

export default function Dashboard({ courses, enrollments, user,notifications,setNotifications, certificates, onCourseSelect, onLogout, onAdminAccess, onSupportAccess, onViewProfile }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<any>(null);
  const openCertificateFromHistory = (course: Course) => {
  setSelectedCertificateCourse(course);
  setShowCertificate(true);
};

const getEnrollment = (courseId: string) => {
  return enrollments.find(
    e => e.userId === user.id && e.courseId === courseId
  );
};

const coursesWithProgress = courses.map(course => {
  const enrollment = getEnrollment(course.id);

  return {
    ...course,
    progress: enrollment?.progress || 0,
    courseCompleted: enrollment?.courseCompleted || false,
  };
});

  const inProgressCourse = coursesWithProgress.find(c => c.progress > 0 && c.progress < 100);
  const userCertificates = certificates.filter(
  certificate => certificate.userId === user.id
);

const getCertificateCourse = (courseId: string) => {
  return courses.find(course => course.id === courseId);
};

  
  const filteredCourses = coursesWithProgress.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Campus Virtual</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, <span className="font-semibold text-gray-800">{user.name}</span></span>

              {onViewProfile && (
                <button
                  onClick={() => onViewProfile(user.id)}
                  className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4 mr-1" />
                  Mi Perfil
                </button>
              )}

              {onSupportAccess && (
                <button
                  onClick={onSupportAccess}
                  className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all text-sm font-medium"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Soporte
                </button>
              )}

              {user.role === 'admin' && (
                <button
                  onClick={onAdminAccess}
                  className="flex items-center px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-all text-sm font-medium"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Panel Admin
                </button>
              )}

<NotificationCenter
  userId={user.id}
  notifications={notifications}
  setNotifications={setNotifications}
/>

              <div className="flex items-center space-x-3 pl-4 border-l">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a tu espacio de aprendizaje</h2>
          <p className="text-gray-600">Continúa desarrollando tus habilidades profesionales</p>
        </div>

        {inProgressCourse && (
          <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-200 text-sm font-medium mb-2">CONTINUAR APRENDIENDO</p>
                <h3 className="text-2xl font-bold mb-4">{inProgressCourse.title}</h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Tu progreso</span>
                    <span className="text-sm font-bold">{inProgressCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-teal-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${inProgressCourse.progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onCourseSelect(inProgressCourse.id)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Reanudar curso
                </button>
              </div>
              <img
                src={inProgressCourse.thumbnail}
                alt={inProgressCourse.title}
                className="w-48 h-32 object-cover rounded-lg ml-8 shadow-2xl hidden md:block"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar cursos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Catálogo de cursos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
                onClick={() => onCourseSelect(course.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.progress > 0 && (
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-lg">
                      {course.courseCompleted
  ? 'Curso completado'
  : course.progress === 100
    ? 'Evaluación pendiente'
    : `${course.progress}% completado`}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
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
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                    {course.title}
                  </h4>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {course.description}
                  </p>
{course.courseCompleted && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      setSelectedCertificateCourse(course);
      setShowCertificate(true);
    }}
    className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
  >
    Ver Certificado
  </button>
)}
                  {course.progress > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-teal-600 h-full rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

              <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Mis Certificados
          </h3>

          {userCertificates.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500">
                Aún no has obtenido certificados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userCertificates.map(certificate => {
                const course = getCertificateCourse(
                  certificate.courseId
                );

                if (!course) return null;

                return (
                  <div
                    key={certificate.id}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <h4 className="font-bold text-lg mb-2">
                      {course.title}
                    </h4>

                    <p className="text-gray-600 text-sm mb-2">
                      Emitido:
                      {' '}
                      {new Date(
                        certificate.issueDate
                      ).toLocaleDateString()}
                    </p>

<div className="space-y-3">

  <p className="text-gray-600 text-sm">
    Nº:
    {' '}
    {certificate.certificateNumber}
  </p>

  <button
    onClick={() =>
      openCertificateFromHistory(course)
    }
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
  >
    Ver Certificado
  </button>

</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        userName={user.name}
        courseTitle={selectedCertificateCourse?.title || ''}
      />
    </div>
  );
}