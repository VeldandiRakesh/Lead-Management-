import React from 'react';
import { FiFolder } from 'react-icons/fi';

const EmptyState = ({
  title = 'No Results Found',
  description = 'Try adjusting your search terms or filters to locate items.',
  icon: Icon = FiFolder,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/10 ${className}`}>
      <div className="inline-flex items-center justify-center p-3.5 bg-slate-800 text-slate-400 rounded-2xl mb-4 border border-slate-700/40">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-sm font-bold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
