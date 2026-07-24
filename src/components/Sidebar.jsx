import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiFolder, FiUsers, FiUser, FiSettings, FiLogOut, FiActivity } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Leads', path: '/leads', icon: FiFolder },
    { name: 'Users', path: '/users', icon: FiUsers, roles: ['admin'] },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings, roles: ['admin'] },
    { name: 'Audit Logs', path: '/audit-log', icon: FiActivity, roles: ['admin'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 flex flex-col w-64 border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center gap-2.5 h-16 px-6 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-indigo-650 text-white shadow-lg shadow-indigo-600/30">
            <FiActivity className="text-lg" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">LeadFlow</h1>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">CRM Platform</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => lgScreen() ? null : toggleSidebar()}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-650 text-white shadow-md shadow-indigo-650/10'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-150'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`text-lg transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                    }`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Block & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          {/* User Profile Mini */}
          {user && (
            <div className="flex items-center gap-3 p-2 mb-3.5 rounded-xl bg-slate-800/40">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.full_name}
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-700"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-100 truncate">{user.full_name || 'CRM User'}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-455 hover:bg-rose-500/5 text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            <FiLogOut className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const lgScreen = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

export default Sidebar;
