import { Skill, User } from '../types';

// Mock users data
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

// Enhanced mock skills data with user information
const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Web Development',
    category: 'Programming',
    description: 'Frontend and backend web development using modern technologies',
    experienceLevel: 'intermediate',
    tags: ['JavaScript', 'React', 'Node.js'],
    userId: '1',
    rating: 4.8,
    reviewCount: 5,
  },
  {
    id: '2',
    name: 'Digital Marketing',
    category: 'Marketing',
    description: 'Social media marketing and SEO optimization',
    experienceLevel: 'expert',
    tags: ['SEO', 'Social Media', 'Content Marketing'],
    userId: '2',
    rating: 4.9,
    reviewCount: 3,
  },
  {
    id: '3',
    name: 'Graphic Design',
    category: 'Design',
    description: 'Creating visual content for digital and print media',
    experienceLevel: 'beginner',
    tags: ['Photoshop', 'Illustrator', 'UI/UX'],
    userId: '2',
    rating: 4.7,
    reviewCount: 2,
  },
];

export const getSkills = async (search?: string, category?: string): Promise<Skill[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredSkills = [...mockSkills];

  if (category) {
    filteredSkills = filteredSkills.filter(skill => skill.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredSkills = filteredSkills.filter(skill => 
      skill.name.toLowerCase().includes(searchLower) ||
      skill.description.toLowerCase().includes(searchLower) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  return filteredSkills;
};

export const getUserSkills = async (userId: string): Promise<Skill[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSkills.filter(skill => skill.userId === userId);
};

export const getSkillWithUser = async (skillId: string): Promise<{ skill: Skill; user: User }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const skill = mockSkills.find(s => s.id === skillId);
  if (!skill) throw new Error('Skill not found');

  const user = mockUsers.find(u => u.id === skill.userId);
  if (!user) throw new Error('User not found');

  return { skill, user };
};

export const createSkill = async (skillData: Omit<Skill, 'id' | 'rating' | 'reviewCount'>): Promise<Skill> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newSkill: Skill = {
    id: Math.random().toString(36).substr(2, 9),
    ...skillData,
    rating: 0,
    reviewCount: 0,
  };

  mockSkills.push(newSkill);
  return newSkill;
};

export const getCategories = async (): Promise<string[]> => {
  const categories = [...new Set(mockSkills.map(skill => skill.category))];
  return categories;
};