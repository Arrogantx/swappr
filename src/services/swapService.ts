import type { SkillSwapRequest } from '../types';

// Mock data store
const mockSwapRequests: SkillSwapRequest[] = [];

export const createSwapRequest = async (
  requesterId: string,
  providerId: string,
  requestedSkillId: string,
  offeredSkillId: string,
  message: string
): Promise<SkillSwapRequest> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newRequest: SkillSwapRequest = {
    id: Math.random().toString(36).substr(2, 9),
    requesterId,
    providerId,
    requestedSkillId,
    offeredSkillId,
    status: 'pending',
    message,
    createdAt: new Date(),
  };

  mockSwapRequests.push(newRequest);
  return newRequest;
};

export const getSwapRequests = async (userId: string): Promise<SkillSwapRequest[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockSwapRequests.filter(
    request => request.requesterId === userId || request.providerId === userId
  );
};

export const updateSwapRequest = async (
  requestId: string,
  status: 'accepted' | 'rejected'
): Promise<SkillSwapRequest> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const request = mockSwapRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('Swap request not found');
  }

  request.status = status;
  return request;
};