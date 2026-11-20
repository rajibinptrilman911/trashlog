import React, { useState } from 'react';
import { TRASHLOG_ICON_BASE64 } from '../../assets/logoBase64';

export interface LogoProps {
  variant?: 'horizontal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const TrashLogSvgIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="TrashLog Icon"
  >
    <defs>
      <linearGradient id="tlCircleGrad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#78BF33" />
        <stop offset="45%" stopColor="#55A732" />
        <stop offset="100%" stopColor="#20612A" />
      </linearGradient>
      <linearGradient id="tlLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3F902F" />
        <stop offset="50%" stopColor="#68B936" />
        <stop offset="100%" stopColor="#81C73A" />
      </linearGradient>
    </defs>
    {/* Circular Arrow Track */}
    <path
      d="M 82 45 A 36 36 0 1 0 83 60"
      stroke="url(#tlCircleGrad)"
      strokeWidth="11"
      strokeLinecap="round"
    />
    {/* Arrow Head */}
    <path
      d="M 68 34 L 84 38 L 81 21"
      fill="none"
      stroke="url(#tlCircleGrad)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Central Leaf */}
    <path
      d="M 37 66 C 36 50, 48 35, 68 31 C 67 48, 55 64, 37 66 Z"
      fill="url(#tlLeafGrad)"
    />
    {/* Leaf central stem curve */}
    <path
      d="M 37 66 C 42 56, 49 48, 62 40"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

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

  const renderIcon = () => {
    if (imgError) {
      return <TrashLogSvgIcon className={`${iconSizes[size]} shrink-0 drop-shadow-xs`} />;
    }
    return (
      <img
        src={TRASHLOG_ICON_BASE64}
        alt="TrashLog"
        onError={() => setImgError(true)}
        className={`${iconSizes[size]} object-contain drop-shadow-xs shrink-0 select-none`}
        loading="eager"
        decoding="sync"
      />
    );
  };

  if (variant === 'icon-only') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        {renderIcon()}
      </div>
      <div className="min-w-0">
        <h1 className={`${textSizes[size]} font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none`}>
          <span>Trash</span>
          <span className="text-emerald-500 dark:text-emerald-400">Log</span>
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
