import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VirtualClassroom from './components/VirtualClassroom';
import AdminPanel from './components/AdminPanel';
import ModuleManagement from './components/ModuleManagement';
import CourseAssignment from './components/CourseAssignment';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CertificateManagement from './components/CertificateManagement';
import TechnicalSupport from './components/TechnicalSupport';
import AdminSupportPanel from './components/AdminSupportPanel';
import FinalAssessmentManagement from './components/FinalAssessmentManagement';
import TakeFinalAssessment from './components/TakeFinalAssessment';
import AssessmentResults from './components/AssessmentResults';
import UserManagement from './components/UserManagement';
import EmployeeProfile from './components/EmployeeProfile';
import { mockCourses, mockUsers } from './data/mockData';
import { mockCollaborators } from './data/extendedMockData';
import { getCurrentSession, signOutFromSupabase } from './lib/auth';
import { getCourses, createCourse, updateCourse, deleteCourse } from './services/courseService';
import {
  mockEnrollments,
  mockAssignments,
  mockSupportTickets,
  mockFinalAssessments,
  mockUserAssessmentAttempts,
  mockNotifications,
  mockCertificates
} from './data/extendedMockData';
import {
  Course,
  User,
  UserEnrollment,
  CourseAssignment as CourseAssignmentType,
  SupportTicket,
  FinalAssessment,
  UserAssessmentAttempt,
  Notification,
  Certificate,
  ActivityLog,
  ActivityAction
} from './types';
type AppView =
  | 'dashboard'
  | 'admin'
  | 'classroom'
  | 'modules'
  | 'assignment'
  | 'analytics'
  | 'admin-support'
  | 'user-management'
  | 'profile'
  | 'certificates'| 'assessment-manage' | 'assessment-take' | 'assessment-results'
  | 'login'
  | 'support';

function App() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>(mockEnrollments);
  const [assignments, setAssignments] = useState<CourseAssignmentType[]>(mockAssignments);
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [assessments, setAssessments] = useState<FinalAssessment[]>(mockFinalAssessments);
  const [assessmentAttempts, setAssessmentAttempts] = useState<UserAssessmentAttempt[]>(mockUserAssessmentAttempts);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [certificates, setCertificates] =
  useState<Certificate[]>(mockCertificates);
  const [users, setUsers] = useState<User[]>(() => {
    const mockWithPasswords = mockUsers.map(u => ({ ...u, active: true }));
    const extraCollaborators = mockCollaborators
      .filter(c => !['1', '2', '3'].includes(c.id))
      .map(c => ({ ...c, password: 'password123', active: true }));
    return [...mockWithPasswords, ...extraCollaborators];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [assessmentManagingCourseId, setAssessmentManagingCourseId] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    getCurrentSession().then(({ user }) => {
      if (user) {
        setCurrentUser(user);
        setCurrentView(user.role === 'admin' ? 'admin' : 'dashboard');
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      getCourses().then(setCourses);
    }
  }, [currentUser]);

  const addActivityLog = (userId: string | null, action: ActivityAction, description: string) => {
    const log: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      action,
      description,
      createdAt: new Date(),
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const getUserEnrollment = (userId: string, courseId: string): UserEnrollment | undefined => {
    return enrollments.find(e => e.userId === userId && e.courseId === courseId);
  };


  const getAssignedCourseIds = (userId: string): string[] => {
    return assignments.filter(a => a.userId === userId).map(a => a.courseId);
  };
const generateCertificate = (
  userId: string,
  courseId: string
) => {

  const alreadyExists = certificates.some(
    certificate =>
      certificate.userId === userId &&
      certificate.courseId === courseId
  );

  if (alreadyExists) return;

  const certificate: Certificate = {
    id: Date.now().toString(),

    userId,

    courseId,

    issueDate: new Date(),

    certificateNumber: `CERT-${Date.now()}`
  };

  setCertificates(prev => [...prev, certificate]);
  const course = courses.find(c => c.id === courseId);
  addActivityLog(userId, 'certificate_generated', `Certificado generado: "${course?.title || ''}"`);
};
  

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await signOutFromSupabase();
    setCurrentUser(null);
    setCurrentView('login');
    setSelectedCourseId(null);
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('classroom');
  };

  const handleBackFromClassroom = () => {
    setSelectedCourseId(null);
    setCurrentView('dashboard');
  };

  const handleBackFromAdminSection = () => {
    setCurrentView('admin');
  };

  const handleAddCourse = async (course: Course) => {
    const created = await createCourse(course);
    setCourses(prev => [...prev, created]);
    addActivityLog(currentUser?.id || '', 'course_assigned', `Curso "${created.title}" creado`);
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    const result = await updateCourse(updatedCourse.id, updatedCourse);
    if (result) {
      setCourses(prev => prev.map(c => (c.id === result.id ? result : c)));
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    await deleteCourse(courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setAssignments(prev => prev.filter(a => a.courseId !== courseId));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, { ...newUser, createdAt: new Date() }]);
    addActivityLog(newUser.id, 'user_created', `Usuario "${newUser.name}" fue registrado en la plataforma`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addActivityLog(updatedUser.id, 'user_updated', `Usuario "${updatedUser.name}" fue actualizado`);
  };

  const handleToggleUserActive = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: u.active === false ? true : false } : u));
  };

  const handleViewProfile = (userId: string) => {
    setProfileUserId(userId);
    setCurrentView('profile');
  };

  const handleAssignCourse = (userId: string, courseId: string) => {
    const exists = assignments.some(a => a.userId === userId && a.courseId === courseId);
  if (!exists) {
  const newAssignment: CourseAssignmentType = {
    id: `assign_${Date.now()}`,
    userId,
    courseId,
    assignedAt: new Date(),
  };

  setAssignments([...assignments, newAssignment]);

  const course = courses.find(c => c.id === courseId);

  if (course) {
    setNotifications(prev => [
      ...prev,
      {
        id: `notif_${Date.now()}`,
        userId,
        type: 'new_course',
        title: 'Nuevo curso asignado',
        message: `Se te ha asignado el curso "${course.title}"`,
        read: false,
        createdAt: new Date(),
      },
    ]);
    addActivityLog(userId, 'course_assigned', `Curso "${course.title}" asignado`);
  }
}
  };

  const handleUnassignCourse = (userId: string, courseId: string) => {
    setAssignments(assignments.filter(a => !(a.userId === userId && a.courseId === courseId)));
  };

 const handleUpdateTicket = (
  ticketId: string,
  status: SupportTicket['status']
) => {
  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) return;

  // Evita notificaciones duplicadas
  if (ticket.status === status) return;

  setTickets(prev =>
    prev.map(t =>
      t.id === ticketId ? { ...t, status } : t
    )
  );

  let title = '';
  let message = '';

  switch (status) {
    case 'in_progress':
      title = 'Ticket en proceso';
      message = 'Tu ticket de soporte está siendo revisado.';
      break;

    case 'resolved':
      title = 'Ticket resuelto';
      message = 'Tu ticket de soporte ha sido resuelto.';
      break;

    case 'closed':
      title = 'Ticket cerrado';
      message = 'Tu ticket de soporte ha sido cerrado.';
      break;

    default:
      return;
  }

  setNotifications(prev => [
    ...prev,
    {
      id: `notif_${Date.now()}`,
      userId: ticket.userId,
      type: 'system',
      title,
      message,
      read: false,
      createdAt: new Date(),
    },
  ]);
};

  const handleUpdateAssessment = (courseId: string, assessment: FinalAssessment) => {
    setAssessments(prev => {
      const existing = prev.find(a => a.courseId === courseId);
      if (existing) {
        return prev.map(a => a.courseId === courseId ? assessment : a);
      }
      return [...prev, assessment];
    });
  };

  const handleSubmitAssessment = (answers: number[]) => {
    if (!currentUser || !selectedCourseId) return;

    const assessment = assessments.find(a => a.courseId === selectedCourseId);
    if (!assessment) return;

    let correctCount = 0;
    assessment.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / assessment.questions.length) * 100);
    const passed = score >= assessment.passingPercentage;
if (passed) {
  setEnrollments(prev =>
    prev.map(enrollment =>
      enrollment.userId === currentUser?.id &&
      enrollment.courseId === selectedCourseId
        ? {
            ...enrollment,
            courseCompleted: true,
          
          }
        : enrollment
    )
  );
  generateCertificate(
  currentUser!.id,
  selectedCourseId!
);

  const course = courses.find(
    c => c.id === selectedCourseId
  );

  if (course) {
    addActivityLog(currentUser.id, 'course_completed', `Curso "${course.title}" completado`);
    addActivityLog(currentUser.id, 'assessment_passed', `Evaluación aprobada: "${course.title}"`);
    setNotifications(prev => [
      ...prev,
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        type: 'system',
        title: 'Curso completado',
        message: `Has completado exitosamente el curso "${course.title}".`,
        read: false,
        createdAt: new Date(),
      },
    ]);
  }
}

    const attempt: UserAssessmentAttempt = {
      id: `attempt_${Date.now()}`,
      userId: currentUser.id,
      courseId: selectedCourseId,
      answers,
      score,
      passed,
      attemptedAt: new Date(),
    };

    setAssessmentAttempts(prev => [...prev, attempt]);
    setCurrentView('assessment-results');
  };

  const handleProgressUpdate = (courseId: string, lessonId: string) => {
    if (!currentUser) return;

    setEnrollments(prevEnrollments => {
      const existingIndex = prevEnrollments.findIndex(
        e => e.userId === currentUser.id && e.courseId === courseId
      );

      if (existingIndex !== -1) {
        const enrollment = prevEnrollments[existingIndex];
        if (!enrollment.completedLessons.includes(lessonId)) {
          const updatedCompletedLessons = [...enrollment.completedLessons, lessonId];
          const course = courses.find(c => c.id === courseId);
          const totalLessons = course ? course.modules.flatMap(m => m.lessons).length : 1;
          const newProgress = Math.round((updatedCompletedLessons.length / totalLessons) * 100);

          const updated = [...prevEnrollments];
          updated[existingIndex] = {
            ...enrollment,
            completedLessons: updatedCompletedLessons,
            progress: newProgress,
          };
          return updated;
        }
        return prevEnrollments;
      } else {
        const course = courses.find(c => c.id === courseId);
        const totalLessons = course ? course.modules.flatMap(m => m.lessons).length : 1;
        const newProgress = Math.round((1 / totalLessons) * 100);

        const newEnrollment: UserEnrollment = {
          id: `enr_${Date.now()}`,
          userId: currentUser.id,
          courseId,
          progress: newProgress,
          completedLessons: [lessonId],
          enrolledAt: new Date(),
          courseCompleted: false,
        };
        return [...prevEnrollments, newEnrollment];
      }
    });
  };

  if (currentView === 'login' || !currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  if (currentView === 'modules' && currentUser.role === 'admin') {
    return (
      <ModuleManagement
        courses={courses}
        user={currentUser}
        onUpdateCourse={handleUpdateCourse}
        onBack={handleBackFromAdminSection}
        onManageAssessment={(courseId) => {
          setAssessmentManagingCourseId(courseId);
          setCurrentView('assessment-manage');
        }}
      />
    );
  }

  if (currentView === 'assignment' && currentUser.role === 'admin') {
    return (
      <CourseAssignment
        courses={courses}
        assignments={assignments}
        users={users}
        user={currentUser}
        onAssignCourse={handleAssignCourse}
        onUnassignCourse={handleUnassignCourse}
        onBack={handleBackFromAdminSection}
      />
    );
  }

  if (currentView === 'admin-support' && currentUser.role === 'admin') {
    return (
      <AdminSupportPanel
        tickets={tickets}
        user={currentUser}
        onUpdateTicket={handleUpdateTicket}
        onBack={handleBackFromAdminSection}
      />
    );
  }

  if (currentView === 'assessment-manage' && currentUser.role === 'admin' && assessmentManagingCourseId) {
    const course = courses.find(c => c.id === assessmentManagingCourseId);
    const assessment = assessments.find(a => a.courseId === assessmentManagingCourseId);
    if (course) {
      return (
        <FinalAssessmentManagement
          course={course}
          assessment={assessment || null}
          user={currentUser}
          onUpdateAssessment={handleUpdateAssessment}
          onBack={() => {
            setAssessmentManagingCourseId(null);
            setCurrentView('modules');
          }}
        />
      );
    }
  }

  if (currentView === 'assessment-take' && selectedCourseId) {
    const course = courses.find(c => c.id === selectedCourseId);
    const assessment = assessments.find(a => a.courseId === selectedCourseId);
    if (course && assessment) {
      const lastAttempt = assessmentAttempts
        .filter(a => a.userId === currentUser.id && a.courseId === selectedCourseId)
        .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())[0];
      return (
        <TakeFinalAssessment
          courseTitle={course.title}
          assessment={assessment}
          user={currentUser}
          lastAttempt={lastAttempt || null}
          onSubmit={handleSubmitAssessment}
          onBack={() => setCurrentView('classroom')}
        />
      );
    }
  }

  if (currentView === 'assessment-results' && selectedCourseId) {
    const course = courses.find(c => c.id === selectedCourseId);
    const assessment = assessments.find(a => a.courseId === selectedCourseId);
    const lastAttempt = assessmentAttempts
      .filter(a => a.userId === currentUser.id && a.courseId === selectedCourseId)
      .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())[0];
    if (course && assessment && lastAttempt) {
      return (
        <AssessmentResults
          courseTitle={course.title}
          assessment={assessment}
          attempt={lastAttempt}
          onRetake={() => setCurrentView('assessment-take')}
          onContinue={() => setCurrentView('classroom')}
        />
      );
    }
  }
  if (currentView === 'user-management' && currentUser.role === 'admin') {
    return (
      <UserManagement
        users={users}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onToggleUserActive={handleToggleUserActive}
        onViewProfile={handleViewProfile}
        onBack={handleBackFromAdminSection}
      />
    );
  }

  if (currentView === 'profile' && profileUserId) {
    const profileUser = users.find(u => u.id === profileUserId);
    if (profileUser) {
      return (
        <EmployeeProfile
          profileUser={profileUser}
          courses={courses}
          enrollments={enrollments}
          assignments={assignments}
          assessmentAttempts={assessmentAttempts}
          certificates={certificates}
          activityLogs={activityLogs}
          onBack={() => {
            setProfileUserId(null);
            setCurrentView(currentUser.role === 'admin' ? 'user-management' : 'dashboard');
          }}
        />
      );
    }
  }

  if (currentView === 'certificates') {
  return (
    <CertificateManagement
      certificates={certificates}
      users={users}
      courses={courses}
      onBack={() => setCurrentView('admin')}
    />
  );
}
  if (currentView === 'analytics' && currentUser.role === 'admin') {
    return (
<AnalyticsDashboard
  user={currentUser}
  courses={courses}
  enrollments={enrollments}
  assignments={assignments}
  assessmentAttempts={assessmentAttempts}
  certificates={certificates}
  users={users}
  onBack={handleBackFromAdminSection}
/>
    );
  }

  if (currentView === 'support') {
    return (
      <TechnicalSupport
        user={currentUser}
        tickets={tickets.filter(t => t.userId === currentUser.id)}
        onAddTicket={(ticket) => setTickets(prev => [ticket, ...prev])}
        onBack={() => setCurrentView(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
      />
    );
  }

  if (currentView === 'admin' && currentUser.role === 'admin') {
    return (
      <AdminPanel
        courses={courses}
        users={users}
        activityLogs={activityLogs}
        user={currentUser}
        onAddCourse={handleAddCourse}
        onUpdateCourse={handleUpdateCourse}
        onDeleteCourse={handleDeleteCourse}
        onBack={() => setCurrentView('dashboard')}
        onNavigate={(view) => setCurrentView(view as AppView)}
      />
    );
  }

  if (currentView === 'classroom' && selectedCourse) {
    const userEnrollment = getUserEnrollment(currentUser.id, selectedCourse.id);
    return (
      <VirtualClassroom
        course={selectedCourse}
        userEnrollment={userEnrollment}
        onBack={handleBackFromClassroom}
        onProgressUpdate={handleProgressUpdate}
        onStartAssessment={() => setCurrentView('assessment-take')}
      />
    );
  }

  const visibleCourses = currentUser.role === 'admin'
    ? courses
    : courses.filter(c => c.status === 'active');

  const userAssignedCourseIds = currentUser.role === 'admin'
    ? visibleCourses.map(c => c.id)
    : getAssignedCourseIds(currentUser.id);
  const userAssignedCourses = visibleCourses.filter(c => userAssignedCourseIds.includes(c.id));

  return (
    <Dashboard
      courses={userAssignedCourses}
      enrollments={enrollments}
      user={currentUser}
      notifications={notifications}
      setNotifications={setNotifications}
      certificates={certificates}
      onCourseSelect={handleCourseSelect}
      onLogout={handleLogout}
      onAdminAccess={() => setCurrentView('admin')}
      onSupportAccess={() => setCurrentView('support')}
      onViewProfile={handleViewProfile}
    />
  );
}

export default App;
