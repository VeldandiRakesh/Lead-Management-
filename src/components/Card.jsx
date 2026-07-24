import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  hoverable = false,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 transition-all duration-300 ${
        hoverable ? 'hover:translate-y-[-2px] hover:shadow-xl hover:shadow-indigo-500/5 hover:border-slate-650' : ''
      } ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-700/50">
          <div>
            {title && <h3 className="text-base font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;
