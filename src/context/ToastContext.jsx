import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiX, FiAlertTriangle } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-slate-900 border-rose-500/30 text-rose-200';
      case 'warning':
        return 'bg-slate-900 border-amber-500/30 text-amber-200';
      case 'success':
      default:
        return 'bg-slate-900 border-emerald-500/30 text-emerald-250';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'error':
        return <FiXCircle className="text-lg text-rose-500 flex-shrink-0" />;
      case 'warning':
        return <FiAlertTriangle className="text-lg text-amber-500 flex-shrink-0" />;
      case 'success':
      default:
        return <FiCheckCircle className="text-lg text-emerald-450 flex-shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start justify-between gap-3 p-4 rounded-xl shadow-2xl border pointer-events-auto animate-slide-in transition-all ${getToastStyles(t.type)}`}
          >
            <div className="flex gap-2.5 items-start mt-0.5">
              {getToastIcon(t.type)}
              <p className="text-xs font-semibold leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 transition-colors cursor-pointer"
            >
              <FiX className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
