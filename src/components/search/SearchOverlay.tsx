import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSkills } from '../../services/skillsService';
import type { Skill } from '../../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { data: results = [] } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => getSkills(searchTerm),
    enabled: searchTerm.length > 2,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelectSkill(results[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectSkill = (skill: Skill) => {
    navigate(`/skills?category=${skill.category}&search=${skill.name}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="container max-w-2xl mx-auto mt-20 p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {searchTerm.length > 2 && (
                <div className="max-h-96 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="py-2">
                      {results.map((skill, index) => (
                        <motion.button
                          key={skill.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors
                            ${selectedIndex === index ? 'bg-gray-50' : ''}`}
                          onClick={() => handleSelectSkill(skill)}
                        >
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {skill.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {skill.category}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No skills found matching your search.
                    </div>
                  )}
                </div>
              )}

              <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Press ↑↓ to navigate</span>
                  <span>Press Enter to select</span>
                  <span>Press Esc to close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};