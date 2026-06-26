import { jsPDF } from 'jspdf';
import { X } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  courseTitle: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  userName,
  courseTitle
}: CertificateModalProps) {
  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString();
  const handleDownloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.text('CERTIFICADO DE FINALIZACION', 105, 40, { align: 'center' });

  doc.setFontSize(14);
  doc.text('Se certifica que', 105, 70, { align: 'center' });

  doc.setFontSize(20);
  doc.text(userName, 105, 90, { align: 'center' });

  doc.setFontSize(14);
  doc.text('ha completado satisfactoriamente el curso', 105, 115, { align: 'center' });

  doc.setFontSize(18);
  doc.text(courseTitle, 105, 135, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Fecha de emision: ${issueDate}`, 105, 170, { align: 'center' });

  doc.text('EdTech Corporate Learning Platform', 105, 190, { align: 'center' });

  doc.save(`Certificado_${courseTitle}.pdf`);
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="p-10 text-center">

          <h1 className="text-4xl font-bold mb-6 text-blue-700">
            CERTIFICADO DE FINALIZACIÓN
          </h1>

          <p className="text-lg mb-6">
            Se certifica que
          </p>

          <h2 className="text-3xl font-bold mb-6">
            {userName}
          </h2>

          <p className="text-lg mb-6">
            ha completado satisfactoriamente el curso
          </p>

          <h3 className="text-2xl font-semibold mb-8">
            {courseTitle}
          </h3>

          <p className="text-gray-600">
            Fecha de emisión: {issueDate}
          </p>
<div className="mt-8">
  <button
    onClick={handleDownloadPDF}
    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
  >
    Descargar PDF
  </button>
</div>
          <div className="mt-10 border-t pt-6">
            <p className="font-semibold">
              EdTech Corporate Learning Platform
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}