// src/components/ThemeToggle.tsx
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        darkMode ? 'bg-orange-600' : 'bg-gray-300'
      }`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          darkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {darkMode ? (
        <FiMoon className="absolute left-1 text-white text-xs" />
      ) : (
        <FiSun className="absolute right-1 text-gray-600 text-xs" />
      )}
    </button>
  );
};

export default ThemeToggle;