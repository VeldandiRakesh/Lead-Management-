import React from 'react';

const Skeleton = ({ type = 'card', count = 1 }) => {
  const renderItems = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      if (type === 'table') {
        items.push(
          <div key={i} className="flex items-center gap-4 py-4 px-6 border-b border-slate-800 animate-pulse">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-800 rounded w-1/3" />
              <div className="h-2.5 bg-slate-800 rounded w-1/4" />
            </div>
            <div className="w-16 h-3 bg-slate-800 rounded" />
            <div className="w-20 h-5 bg-slate-800 rounded-lg" />
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex-shrink-0" />
          </div>
        );
      } else if (type === 'timeline') {
        items.push(
          <div key={i} className="flex gap-4 items-start animate-pulse mb-5">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-800 rounded w-2/3" />
              <div className="h-2 bg-slate-800 rounded w-1/4" />
            </div>
          </div>
        );
      } else {
        // Card skeleton
        items.push(
          <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-800 rounded w-1/3" />
              <div className="w-10 h-10 bg-slate-800 rounded-full" />
            </div>
            <div className="h-6 bg-slate-800 rounded w-1/4" />
            <div className="h-2.5 bg-slate-800 rounded w-1/2" />
          </div>
        );
      }
    }
    return items;
  };

  return <>{renderItems()}</>;
};

export default Skeleton;
