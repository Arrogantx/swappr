import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Skill } from '../../types';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { createSwapRequest } from '../../services/swapService';

interface SwapRequestModalProps {
  requestedSkill: Skill;
  onClose: () => void;
  onSuccess: () => void;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  requestedSkill,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSkill) return;

    setIsLoading(true);
    try {
      await createSwapRequest(
        user.id,
        requestedSkill.userId!,
        requestedSkill.id,
        selectedSkill,
        message
      );
      onSuccess();
    } catch (error) {
      console.error('Failed to create swap request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4">Request Skill Swap</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select your skill to offer
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a skill</option>
              {user?.skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Explain why you'd like to swap skills..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};