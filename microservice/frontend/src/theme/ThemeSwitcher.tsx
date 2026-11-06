import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './useTheme';

export interface ThemeSwitcherProps {
  variant?: 'compact' | 'detailed';
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'compact',
  className = '',
  showLabel = false,
}) => {
  const { toggleTheme, isDark } = useTheme();

  const titleText = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  const labelText = isDark ? 'Dark Theme' : 'Light Theme';

  if (variant === 'detailed' || showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
          isDark
            ? 'bg-[#1C0D2E] text-brand-gold border-brand-gold/30 hover:border-brand-gold/60 hover:bg-[#24113A]'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-sm'
        } ${className}`}
        aria-label={titleText}
        title={titleText}
      >
        <span className="flex items-center justify-center w-5 h-5 text-current">
          {isDark ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-600" />}
        </span>
        <span>{labelText}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex items-center justify-center ${
        isDark
          ? 'text-amber-300 hover:text-amber-200 hover:bg-white/10 active:scale-95'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
      } ${className}`}
      aria-label={titleText}
      title={titleText}
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-300" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 hover:-rotate-12 text-slate-700" />
      )}
    </button>
  );
};
