import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiBell, FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Page Title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview Dashboard';
    if (path.startsWith('/leads/new')) return 'Create New Lead';
    if (path.startsWith('/leads/edit')) return 'Update Lead Details';
    if (path.startsWith('/leads/')) return 'Lead Information';
    if (path.startsWith('/leads')) return 'Leads Management';
    if (path === '/users') return 'Team Members';
    if (path === '/profile') return 'My Profile';
    if (path === '/settings') return 'Settings Console';
    return 'LeadFlow';
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New lead Robert Fox assigned to you', time: '10 min ago', unread: true },
    { id: 2, text: 'Jane Cooper updated to Qualified', time: '2 hours ago', unread: true },
    { id: 3, text: 'Wade Warren signed the service agreement!', time: 'Yesterday', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden cursor-pointer"
        >
          <FiMenu className="text-xl" />
        </button>
        <h2 className="text-lg font-bold text-slate-100 hidden sm:block">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-slate-800/40">
                  <span className="text-xs font-bold text-slate-200">Recent Notifications</span>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">3 New</span>
                </div>
                <div className="divide-y divide-slate-700/50 max-h-[300px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-slate-750 transition-colors flex gap-2.5 items-start ${
                        notif.unread ? 'bg-indigo-950/10' : ''
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${notif.unread ? 'bg-indigo-500' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-xs text-slate-200 leading-tight">{notif.text}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-700/60 bg-slate-900/20 text-center">
                  <button className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold">
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Badge & Logout */}
        {user && (
          <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-700 hidden xs:block"
              />
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-bold text-slate-200">{user.name}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md mt-1 uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-450 hover:bg-rose-500/10 hover:text-rose-350 border border-slate-850 hover:border-rose-500/20 rounded-xl transition-all cursor-pointer"
            >
              <FiLogOut className="text-sm" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
