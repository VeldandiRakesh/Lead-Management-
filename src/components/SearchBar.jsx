import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <FiSearch className="text-lg" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
};

export default SearchBar;
