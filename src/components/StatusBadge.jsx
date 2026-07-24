import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    'New': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'Contacted': 'bg-amber-500/10 text-amber-450 border border-amber-500/20',
    'Qualified': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    'Proposal Sent': 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    'Won': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'Lost': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border ${styles[status] || styles.New}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
