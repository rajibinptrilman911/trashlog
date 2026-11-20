import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  subtitle: string;
  badge?: string;
  colorScheme: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  subtitle,
  badge,
  colorScheme
}) => {
  const schemeStyles = {
    emerald: {
      border: 'border-emerald-200/70 dark:border-emerald-800/40',
      bgIcon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
    },
    cyan: {
      border: 'border-cyan-200/70 dark:border-cyan-800/40',
      bgIcon: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
      badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300'
    },
    amber: {
      border: 'border-amber-200/70 dark:border-amber-800/40',
      bgIcon: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
    },
    indigo: {
      border: 'border-indigo-200/70 dark:border-indigo-800/40',
      bgIcon: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400',
      badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
    },
    rose: {
      border: 'border-rose-200/70 dark:border-rose-800/40',
      bgIcon: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
    }
  };

  const style = schemeStyles[colorScheme];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border ${style.border} shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between min-w-0 overflow-hidden`}>
      {/* 1. Header: Title & Icon */}
      <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-snug min-w-0 break-words">
          {title}
        </span>
        <div className={`p-2 rounded-xl shrink-0 ${style.bgIcon}`}>
          {icon}
        </div>
      </div>

      {/* 2. Main Value & Unit (stacked to eliminate horizontal overflow) */}
      <div className="my-1.5 flex flex-col min-w-0">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none break-all">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 leading-none">
            {unit}
          </span>
        )}
      </div>

      {/* 3. Footer Context: Badge & Subtitle (stacked to guarantee 0% overflow) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex flex-col gap-1.5 min-w-0">
        {badge && (
          <div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${style.badge}`}>
              {badge}
            </span>
          </div>
        )}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug break-words">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
