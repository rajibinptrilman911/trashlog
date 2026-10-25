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
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    },
    cyan: {
      border: 'border-cyan-200/70 dark:border-cyan-800/40',
      bgIcon: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
      badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
    },
    amber: {
      border: 'border-amber-200/70 dark:border-amber-800/40',
      bgIcon: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    },
    indigo: {
      border: 'border-indigo-200/70 dark:border-indigo-800/40',
      bgIcon: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400',
      badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    },
    rose: {
      border: 'border-rose-200/70 dark:border-rose-800/40',
      bgIcon: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
    }
  };

  const style = schemeStyles[colorScheme];

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${style.border} shadow-sm transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${style.bgIcon}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
