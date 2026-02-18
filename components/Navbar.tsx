
import React from 'react';
import { APP_NAME } from '../constants';

interface NavbarProps {
  onNavigate: (view: string) => void;
  activeView: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView, isDarkMode, toggleDarkMode }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'search', label: 'Search' },
    { id: 'deep-research', label: 'Research' },
    { id: 'news', label: 'News' },
    { id: 'learn', label: 'Quiz' },
    { id: 'lawyer', label: 'Expert' }
  ];

  return (
    <nav className="sticky top-4 z-50 mx-4 lg:mx-auto max-w-6xl">
      <div className="glass-dark rounded-2xl apple-shadow px-6 py-3 flex items-center justify-between transition-colors duration-500">
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm">NS</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white devanagari tracking-tight">{APP_NAME}</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeView === item.id
                  ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-2">
           <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
