import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  options, // If type is 'select'
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const baseInputStyles = `w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
    Icon ? 'pl-10' : ''
  } ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="text-lg" />
          </div>
        )}
        
        {type === 'select' ? (
          <select
            id={inputId}
            ref={ref}
            className={`${baseInputStyles} appearance-none cursor-pointer`}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-800 text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={inputId}
            ref={ref}
            className={`${baseInputStyles} min-h-[100px] resize-y`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={baseInputStyles}
            {...props}
          />
        )}
      </div>
      {error && (
        <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
