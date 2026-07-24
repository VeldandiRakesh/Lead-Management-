import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FilterDropdown = ({ value, onChange, options, icon: Icon, className = '' }) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {Icon && (
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Icon className="text-base" />
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-xl py-2.5 pr-10 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer ${
          Icon ? 'pl-10' : 'pl-4'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3.5 text-slate-450 pointer-events-none">
        <FiChevronDown className="text-xs" />
      </div>
    </div>
  );
};

export default FilterDropdown;
