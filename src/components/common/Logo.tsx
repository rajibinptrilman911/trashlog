import React from 'react';

export interface LogoProps {
  variant?: 'horizontal' | 'icon-only' | 'full-image';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  if (variant === 'full-image') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <img
          src="/logo-transparent.png"
          alt="TrashLog Logo"
          className={`${size === 'lg' ? 'h-24' : size === 'sm' ? 'h-12' : 'h-16'} w-auto object-contain dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]`}
        />
      </div>
    );
  }

  if (variant === 'icon-only') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/logo-icon.png"
          alt="TrashLog Icon"
          className={`${iconSizes[size]} object-contain drop-shadow-xs`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/logo-icon.png"
          alt="TrashLog Icon"
          className={`${iconSizes[size]} object-contain drop-shadow-xs transition-transform duration-200 hover:scale-105`}
        />
      </div>
      <div className="min-w-0">
        <h1 className={`${textSizes[size]} font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none`}>
          <span>Trash</span>
          <span className="text-emerald-600 dark:text-emerald-400">Log</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            v2.0
          </span>
        </h1>
        {showSubtitle && (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
            Sistem Informasi Berkelanjutan
          </p>
        )}
      </div>
    </div>
  );
};
