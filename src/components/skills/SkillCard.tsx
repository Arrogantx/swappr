import React from 'react';
import { Star, Shield } from 'lucide-react';
import { type Skill } from '../../types';
import { Badge } from '../ui/Badge';

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick }) => {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    expert: 'bg-purple-100 text-purple-800',
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
          <p className="text-sm text-gray-500">{skill.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[skill.experienceLevel]}`}>
          {skill.experienceLevel}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{skill.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skill.tags.map(tag => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <img
            src={`https://images.unsplash.com/photo-${skill.userId === '1' ? '1472099645785-5658abf4ff4e' : '1494790108377-be9c29b29330'}`}
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {skill.userId === '1' ? 'John Doe' : 'Sarah Johnson'}
              {skill.userId === '1' && (
                <Shield className="inline-block w-4 h-4 ml-1 text-blue-500" />
              )}
            </p>
          </div>
        </div>
        
        {skill.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{skill.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({skill.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};