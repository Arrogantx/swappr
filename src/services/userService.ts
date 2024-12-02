import type { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Full-stack developer with 5 years of experience',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    skills: [],
    rating: 4.8,
    reviewCount: 12,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    bio: 'Digital marketing specialist focused on growth strategies',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    skills: [],
    rating: 4.9,
    reviewCount: 8,
    isVerified: true,
  },
];

export const getUserById = async (userId: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers.find(user => user.id === userId) || null;
};