import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { SkillSwapRequest } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { updateSwapRequest } from '../../services/swapService';
import { toast } from 'sonner';

interface MatchCardProps {
  request: SkillSwapRequest;
}

export const MatchCard: React.FC<MatchCardProps> = ({ request }) => {
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const isRequester = user?.id === request.requesterId;
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    setIsUpdating(true);
    try {
      await updateSwapRequest(request.id, status);
      toast.success(`Request ${status}`);
    } catch (error) {
      toast.error('Failed to update request');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Skill Swap Request</h3>
        <Badge variant="outline" className={statusColors[request.status]}>
          {request.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Requested Skill</p>
            <p className="font-medium">{request.requestedSkillId}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Offered Skill</p>
            <p className="font-medium">{request.offeredSkillId}</p>
          </div>
        </div>

        {request.message && (
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-600">{request.message}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
          
          <div className="flex gap-2">
            {request.status === 'pending' && !isRequester && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus('rejected')}
                  isLoading={isUpdating}
                >
                  Decline
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('accepted')}
                  isLoading={isUpdating}
                >
                  Accept
                </Button>
              </>
            )}
            {request.status === 'accepted' && (
              <Button
                onClick={() => window.location.href = `/messages/${isRequester ? request.providerId : request.requesterId}`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};