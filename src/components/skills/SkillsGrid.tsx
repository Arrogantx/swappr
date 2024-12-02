import React from 'react';
import { type Skill } from '../../types';
import { SkillCard } from './SkillCard';

interface SkillsGridProps {
  skills: Skill[];
  onSkillClick?: (skill: Skill) => void;
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({ 
  skills,
  onSkillClick 
}) => {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No skills found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map(skill => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onClick={() => onSkillClick?.(skill)}
        />
      ))}
    </div>
  );
};