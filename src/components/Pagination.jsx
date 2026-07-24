import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-slate-900/10">
      <span className="text-xs text-slate-450 font-medium">
        Showing <span className="text-slate-300 font-bold">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
        <span className="text-slate-300 font-bold">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
        <span className="text-slate-300 font-bold">{totalItems}</span> leads
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2"
        >
          <FiChevronLeft className="text-base" />
        </Button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentPage === p
                ? 'bg-indigo-650 text-white shadow-md shadow-indigo-650/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 bg-transparent'
            }`}
          >
            {p}
          </button>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2"
        >
          <FiChevronRight className="text-base" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
