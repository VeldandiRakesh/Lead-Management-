import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 text-indigo-400 text-3xl mb-6 border border-slate-700/60 shadow-lg animate-bounce">
        <FiAlertCircle />
      </div>
      
      <h1 className="text-5xl font-black text-slate-100 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-350 mt-3">Page Not Found</h2>
      
      <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
        The link you followed may be broken, or the page may have been removed. Double check the address or return home.
      </p>

      <div className="mt-8">
        <Link to="/dashboard">
          <Button variant="primary" icon={FiHome}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
