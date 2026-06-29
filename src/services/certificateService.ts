import { Certificate } from '../types';
import { mockCertificates } from '../data/extendedMockData';

let certificatesData: Certificate[] = [...mockCertificates];

export function getCertificates(): Promise<Certificate[]> {
  return Promise.resolve([...certificatesData]);
}

export function getCertificatesByUser(userId: string): Promise<Certificate[]> {
  return Promise.resolve(certificatesData.filter(c => c.userId === userId));
}

export function getCertificatesByCourse(courseId: string): Promise<Certificate[]> {
  return Promise.resolve(certificatesData.filter(c => c.courseId === courseId));
}

export function createCertificate(userId: string, courseId: string): Promise<Certificate> {
  const certificate: Certificate = {
    id: Date.now().toString(),
    userId,
    courseId,
    issueDate: new Date(),
    certificateNumber: `CERT-${Date.now()}`,
  };
  certificatesData = [...certificatesData, certificate];
  return Promise.resolve(certificate);
}

export function certificateExists(userId: string, courseId: string): Promise<boolean> {
  return Promise.resolve(certificatesData.some(c => c.userId === userId && c.courseId === courseId));
}
