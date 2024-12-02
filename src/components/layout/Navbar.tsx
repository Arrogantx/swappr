import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, Search, User } from 'lucide-react';
import { SearchOverlay } from '../search/SearchOverlay';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">SkillSwap</span>
              </Link>
            </div>

            <div className="flex items-center">
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/skills"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Browse Skills
                </Link>
                <Link
                  to="/matches"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Matches
                </Link>
              </div>

              <div className="flex items-center space-x-4 ml-6">
                <button 
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                  onClick={toggleSearch}
                >
                  <Search className="h-5 w-5" />
                </button>

                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}

                <button className="sm:hidden text-gray-600 hover:text-indigo-600">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};