import type { Review } from '../types';

const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    skillId: '1',
    rating: 5,
    comment: 'Excellent teacher, very patient and knowledgeable!',
    createdAt: new Date('2024-02-20'),
    reviewer: {
      id: '2',
      name: 'Sarah Johnson',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
  },
  {
    id: '2',
    userId: '1',
    skillId: '1',
    rating: 4,
    comment: 'Great experience, learned a lot about web development.',
    createdAt: new Date('2024-02-18'),
    reviewer: {
      id: '3',
      name: 'Michael Chen',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
  },
];

export const getReviews = async (skillId: string): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockReviews.filter(review => review.skillId === skillId);
};

export const createReview = async (
  userId: string,
  skillId: string,
  rating: number,
  comment: string,
  reviewerId: string,
  reviewerName: string,
  reviewerImage?: string,
): Promise<Review> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newReview: Review = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    skillId,
    rating,
    comment,
    createdAt: new Date(),
    reviewer: {
      id: reviewerId,
      name: reviewerName,
      profileImage: reviewerImage,
    },
  };

  mockReviews.push(newReview);
  return newReview;
};