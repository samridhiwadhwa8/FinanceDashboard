import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ThemeToggle = () => {
  const { state, actions } = useAppContext();

  const toggleTheme = () => {
    console.log('Current theme:', state.theme);
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    console.log('Setting theme to:', newTheme);
    actions.setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {state.theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
