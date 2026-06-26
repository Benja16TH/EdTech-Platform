import { ArrowLeft } from 'lucide-react';
import { Certificate, Course, User } from '../types';

interface CertificateManagementProps {
  certificates: Certificate[];
  users: User[];
  courses: Course[];
  onBack: () => void;
}

export default function CertificateManagement({
  certificates,
  users,
  courses,
  onBack
}: CertificateManagementProps) {

  const getUserName = (userId: string) => {
    return users.find(user => user.id === userId)?.name || 'Usuario';
  };

  const getCourseName = (courseId: string) => {
    return courses.find(course => course.id === courseId)?.title || 'Curso';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-bold">
            Certificados Emitidos
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="text-left p-4">Usuario</th>
                <th className="text-left p-4">Curso</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">N° Certificado</th>
              </tr>

            </thead>

            <tbody>

              {certificates.map(certificate => (

                <tr
                  key={certificate.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {getUserName(certificate.userId)}
                  </td>

                  <td className="p-4">
                    {getCourseName(certificate.courseId)}
                  </td>

                  <td className="p-4">
                    {new Date(
                      certificate.issueDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {certificate.certificateNumber}
                  </td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}