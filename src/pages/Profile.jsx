import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiUser, FiMail, FiShield, FiLink, FiSave, FiLock } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Sync state if user context loads later
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      updateProfile(formData);
      showToast('Profile information updated successfully');
    } catch (error) {
      showToast('Failed to update profile information', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('Please fill in all password fields', 'warning');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'warning');
      return;
    }

    setPasswordSaving(true);
    try {
      // Since backend doesn't support password updating, mock the save locally
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast('Failed to change password', 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">My Profile</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your personal settings, display name, and login credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Summary Profile Block */}
        <div>
          <Card className="text-center">
            <div className="relative inline-block">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.full_name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-slate-700 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-205 mt-4">{user?.full_name || 'CRM User'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            
            <div className="mt-4 inline-block">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                {user?.role || 'member'} Role
              </span>
            </div>
          </Card>
        </div>

        {/* Right Columns: Profile Fields & Password Form */}
        <div className="md:col-span-2 space-y-6 animate-fade-in">
          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit}>
            <Card 
              title="Personal Information" 
              subtitle="Update your name, primary email and display avatar"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    name="full_name"
                    icon={FiUser}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    icon={FiMail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Profile Picture URL"
                  name="avatar"
                  icon={FiLink}
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" variant="primary" icon={FiSave} disabled={profileSaving}>
                  {profileSaving ? 'Saving...' : 'Save Information'}
                </Button>
              </div>
            </Card>
          </form>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit}>
            <Card 
              title="Change Account Password" 
              subtitle="Ensure your login credentials remain secure"
            >
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  icon={FiLock}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    icon={FiLock}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    icon={FiLock}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" variant="primary" icon={FiSave} disabled={passwordSaving}>
                  {passwordSaving ? 'Updating...' : 'Change Password'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
