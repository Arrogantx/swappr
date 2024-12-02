import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { createReview } from '../../services/reviewService';
import { toast } from 'sonner';

interface ReviewFormProps {
  skillId: string;
  userId: string;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  skillId,
  userId,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rating) return;

    setIsLoading(true);
    try {
      await createReview(
        userId,
        skillId,
        rating,
        comment,
        user.id,
        user.name,
        user.profileImage
      );
      toast.success('Review submitted successfully!');
      onSuccess();
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  i < (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          required
          placeholder="Share your experience..."
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!rating}
        className="w-full"
      >
        Submit Review
      </Button>
    </form>
  );
};