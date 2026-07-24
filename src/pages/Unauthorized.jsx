import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/Button';

const Unauthorized = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-450 text-3xl mb-6 border border-rose-500/20 shadow-lg animate-pulse">
        <FiLock />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">Access Denied</h1>
      <h2 className="text-base font-medium text-slate-400 mt-2">Restricted Admin Route</h2>

      <p className="mt-3 text-sm text-slate-500 max-w-md leading-relaxed">
        You do not have the required permissions to view this section. Please contact your system administrator if you believe this is an error.
      </p>

      <div className="mt-8">
        <Link to="/dashboard">
          <Button variant="primary" icon={FiArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
