import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Shield, PlusCircle, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SkillForm } from '../components/skills/SkillForm';
import { SkillsGrid } from '../components/skills/SkillsGrid';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { useQuery } from '@tanstack/react-query';
import { getUserSkills } from '../services/skillsService';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { data: skills, refetch: refetchSkills } = useQuery({
    queryKey: ['userSkills', user?.id],
    queryFn: () => getUserSkills(user?.id!),
    enabled: !!user?.id,
  });

  const handleSkillCreated = () => {
    setShowSkillForm(false);
    refetchSkills();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage || 'https://via.placeholder.com/100'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.isVerified && (
                  <Shield className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-gray-600 mt-1">{user.bio || 'No bio yet'}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">
                  {user.rating.toFixed(1)} rating ({user.reviewCount} reviews)
                </span>
                <span className="text-sm text-gray-500">
                  {skills?.length || 0} skills offered
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowEditProfile(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Skills</h2>
          <Button onClick={() => setShowSkillForm(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Skill
          </Button>
        </div>

        {skills?.length ? (
          <SkillsGrid skills={skills} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 mb-4">You haven't added any skills yet.</p>
            <Button onClick={() => setShowSkillForm(true)}>
              Add Your First Skill
            </Button>
          </div>
        )}
      </div>

      {showSkillForm && (
        <SkillForm
          onClose={() => setShowSkillForm(false)}
          onSuccess={handleSkillCreated}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
};