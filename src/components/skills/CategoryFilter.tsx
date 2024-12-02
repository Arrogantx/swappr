import React from 'react';
import { Badge } from '../ui/Badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
          ${!selectedCategory
            ? 'bg-indigo-100 text-indigo-800'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === category
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}