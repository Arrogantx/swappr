import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getSkills, getCategories } from '../services/skillsService';
import { SkillsGrid } from '../components/skills/SkillsGrid';
import { SkillDetailModal } from '../components/skills/SkillDetailModal';
import { SwapRequestModal } from '../components/skills/SwapRequestModal';
import { CategoryFilter } from '../components/skills/CategoryFilter';
import { Input } from '../components/ui/Input';
import type { Skill } from '../types';
import { useAuthStore } from '../store/authStore';

export const SkillsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills', searchTerm, selectedCategory],
    queryFn: () => getSkills(searchTerm, selectedCategory || undefined),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleRequestSkillSwap = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setShowSwapModal(true);
  };

  const handleSwapSuccess = () => {
    setShowSwapModal(false);
    setSelectedSkill(null);
    // Show success message or notification
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Available Skills</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <div className="w-full sm:w-96 relative">
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <SkillsGrid 
          skills={skills || []} 
          onSkillClick={handleSkillClick}
        />
      )}

      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onRequestSkillSwap={handleRequestSkillSwap}
        />
      )}

      {showSwapModal && selectedSkill && (
        <SwapRequestModal
          requestedSkill={selectedSkill}
          onClose={() => setShowSwapModal(false)}
          onSuccess={handleSwapSuccess}
        />
      )}
    </div>
  );
};