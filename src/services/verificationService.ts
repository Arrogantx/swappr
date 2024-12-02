import type { VerificationDocument } from '../types';

export const submitIdentityVerification = async (documents: File[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Mock implementation - would upload documents and create verification request
};

export const submitSkillVerification = async (
  skillId: string,
  documents: File[]
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Mock implementation - would upload documents and create verification request
};

export const getVerificationStatus = async (
  documentId: string
): Promise<VerificationDocument> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: documentId,
    type: 'certificate',
    name: 'Sample Certificate',
    url: 'https://example.com/certificate.pdf',
    status: 'pending',
    submittedAt: new Date(),
  };
};