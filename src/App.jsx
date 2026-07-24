import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Loader from './components/Loader';

// Lazily loaded page components for optimal production bundle sizes
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const LeadDetails = lazy(() => import('./pages/LeadDetails'));
const AddLead = lazy(() => import('./pages/AddLead'));
const EditLead = lazy(() => import('./pages/EditLead'));
const Users = lazy(() => import('./pages/Users'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <LeadProvider>
            {/* Suspense fallback boundary for lazy components */}
            <Suspense fallback={<Loader className="min-h-screen bg-slate-950 text-slate-100" size="lg" />}>
              <Routes>
                {/* Public Auth Route */}
                <Route path="/" element={<Login />} />

                {/* Guarded Dashboard Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/new" element={<AddLead />} />
                  <Route path="/leads/:id" element={<LeadDetails />} />
                  <Route path="/leads/:id/edit" element={<EditLead />} />
                  <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
                  <Route path="/audit-log" element={<ProtectedRoute allowedRoles={['admin']}><AuditLog /></ProtectedRoute>} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                </Route>

                {/* Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </LeadProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
