import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Menu, X, Search, Globe, User, LogOut, Settings, HelpCircle, Bell } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2 text-red-600">
          <BookOpen className="h-8 w-8" />
          <span className="text-xl font-bold">BOOKFLIX</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/"
            className={({ isActive }) => `
              text-sm transition-colors hover:text-white 
              ${isActive ? 'text-white font-medium' : 'text-gray-300'}
            `}
          >
            Home
          </NavLink>
          <NavLink 
            to="/new"
            className={({ isActive }) => `
              text-sm transition-colors hover:text-white 
              ${isActive ? 'text-white font-medium' : 'text-gray-300'}
            `}
          >
            New & Popular
          </NavLink>
          <NavLink 
            to="/my-list"
            className={({ isActive }) => `
              text-sm transition-colors hover:text-white 
              ${isActive ? 'text-white font-medium' : 'text-gray-300'}
            `}
          >
            My List
          </NavLink>
          <NavLink 
            to="/languages"
            className={({ isActive }) => `
              text-sm transition-colors hover:text-white flex items-center
              ${isActive ? 'text-white font-medium' : 'text-gray-300'}
            `}
          >
            <Globe size={16} className="mr-1" />
            Browse by Languages
          </NavLink>
        </nav>
        
        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <button 
            className="text-gray-300 hover:text-white"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button className="text-gray-300 hover:text-white">
            <Bell size={20} />
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 group"
            >
              <img
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                alt="Profile"
                className="w-8 h-8 rounded-md group-hover:ring-2 group-hover:ring-white transition-all duration-200"
              />
              <div className={`transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-white">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-black/95 rounded-md shadow-lg border border-gray-700 overflow-hidden">
                {/* Profile Section */}
                <div className="p-3">
                  {['Reader 1', 'Reader 2', 'Reader 3'].map((profile, index) => (
                    <button
                      key={profile}
                      className="flex items-center w-full p-2 text-left hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <img
                        src={`https://images.pexels.com/photos/${2379005 + index}/pexels-photo-${2379005 + index}.jpeg`}
                        alt={profile}
                        className="w-8 h-8 rounded-md mr-3"
                      />
                      <span className="text-sm text-white">{profile}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-700 p-3">
                  <button className="flex items-center w-full p-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-md">
                    <Settings size={16} className="mr-3" />
                    Manage Profiles
                  </button>
                  <button className="flex items-center w-full p-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-md">
                    <User size={16} className="mr-3" />
                    Account Settings
                  </button>
                  <button className="flex items-center w-full p-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-md">
                    <HelpCircle size={16} className="mr-3" />
                    Help Center
                  </button>
                </div>

                <div className="border-t border-gray-700 p-3">
                  <button className="flex items-center w-full p-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-md">
                    <LogOut size={16} className="mr-3" />
                    Sign out of Bookflix
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 p-4 border-t border-gray-800 shadow-lg">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
              autoFocus
            />
          </form>
        </div>
      )}
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black z-40 pt-20">
          <nav className="flex flex-col p-4">
            <NavLink 
              to="/"
              className={({ isActive }) => `
                py-3 px-4 text-lg rounded-md transition-colors 
                ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/50'}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/new"
              className={({ isActive }) => `
                py-3 px-4 text-lg rounded-md transition-colors 
                ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/50'}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              New & Popular
            </NavLink>
            <NavLink 
              to="/my-list"
              className={({ isActive }) => `
                py-3 px-4 text-lg rounded-md transition-colors 
                ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/50'}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              My List
            </NavLink>
            <NavLink 
              to="/languages"
              className={({ isActive }) => `
                py-3 px-4 text-lg rounded-md transition-colors 
                ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/50'}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              <Globe size={18} className="inline-block mr-2" />
              Browse by Languages
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;