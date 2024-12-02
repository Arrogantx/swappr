import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Shield, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Skill, User } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { ReviewList } from '../reviews/ReviewList';
import { ReviewForm } from '../reviews/ReviewForm';
import { getReviews } from '../../services/reviewService';
import { getSkillWithUser } from '../../services/skillsService';

interface SkillDetailModalProps {
  skill: Skill;
  onClose: () => void;
  onRequestSkillSwap?: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill: initialSkill,
  onClose,
  onRequestSkillSwap,
}) => {
  const { isAuthenticated } = useAuthStore();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: skillData } = useQuery({
    queryKey: ['skill', initialSkill.id],
    queryFn: () => getSkillWithUser(initialSkill.id),
    initialData: { skill: initialSkill, user: null as unknown as User },
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', initialSkill.id],
    queryFn: () => getReviews(initialSkill.id),
  });

  const { skill, user } = skillData;

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    refetchReviews();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
                {/* User Profile Section */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <img
                    src={user?.profileImage}
                    alt={user?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{user?.name}</h3>
                      {user?.isVerified && (
                        <Shield className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-600">{user?.bio}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{user?.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">
                          ({user?.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Details */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{skill.name}</h2>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${skill.experienceLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                        skill.experienceLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'}
                    `}>
                      {skill.experienceLevel}
                    </span>
                  </div>
                  <p className="text-gray-600">{skill.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Category</h3>
                  <Badge variant="outline">{skill.category}</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map(tag => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Reviews</h3>
                    {isAuthenticated && !showReviewForm && (
                      <Button
                        variant="outline"
                        onClick={() => setShowReviewForm(true)}
                      >
                        Write a Review
                      </Button>
                    )}
                  </div>

                  {showReviewForm ? (
                    <div className="mb-6">
                      <ReviewForm
                        skillId={skill.id}
                        userId={skill.userId!}
                        onSuccess={handleReviewSuccess}
                      />
                    </div>
                  ) : null}

                  {reviews?.length ? (
                    <ReviewList reviews={reviews} />
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `/messages/${user?.id}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  {isAuthenticated ? (
                    <Button onClick={onRequestSkillSwap}>
                      Request Skill Swap
                    </Button>
                  ) : (
                    <Button onClick={() => window.location.href = '/login'}>
                      Sign in to Request Swap
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};