import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { FiSave, FiBell, FiLock, FiDatabase, FiCompass, FiSun, FiMoon } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Settings = () => {
  const { showToast } = useToast();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('leadflow_dark_mode') !== 'false' // Default true (dark mode by default)
  );
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem('leadflow_theme') || 'indigo'
  );
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [apiKey, setApiKey] = useState('lf_live_948f29d81d77a0bc19e83cfb9b');
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/crm-webhook');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save theme selections in local storage
      localStorage.setItem('leadflow_dark_mode', darkMode);
      localStorage.setItem('leadflow_theme', themeColor);

      // Apply body modifications
      if (darkMode) {
        document.documentElement.classList.remove('light');
        document.body.classList.remove('bg-slate-50', 'text-slate-900');
        document.body.classList.add('bg-slate-950', 'text-slate-100');
      } else {
        document.documentElement.classList.add('light');
        document.body.classList.remove('bg-slate-950', 'text-slate-100');
        document.body.classList.add('bg-slate-50', 'text-slate-900');
      }

      showToast('Settings and preferences saved successfully');
      
      // Briefly reload window to trigger full theme redraws
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      showToast('Failed to apply workspace settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'indigo', label: 'Classic Indigo', class: 'bg-indigo-600' },
    { id: 'violet', label: 'Deep Violet', class: 'bg-violet-600' },
    { id: 'blue', label: 'Ocean Blue', class: 'bg-blue-600' },
    { id: 'emerald', label: 'Forest Emerald', class: 'bg-emerald-600' },
    { id: 'rose', label: 'Rose Gold', class: 'bg-rose-600' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">System Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Customize notifications layouts, theme styles, API webhook integrations.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card title="Workspace Appearance" subtitle="Select a branding highlight color for the application layout">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeColor(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                      themeColor === t.id
                        ? 'border-indigo-500 bg-slate-800/80 shadow-lg'
                        : 'border-slate-850 hover:border-slate-700 bg-slate-900/30'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${t.class} ring-2 ring-slate-950`} />
                    <span className="text-xs font-bold text-slate-205">{t.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card title="Portal mode" subtitle="Choose light or dark mode theme">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDarkMode(false)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border gap-2 transition-all cursor-pointer ${
                    !darkMode
                      ? 'border-indigo-500 bg-slate-800/80 shadow-lg'
                      : 'border-slate-850 hover:border-slate-700 bg-slate-900/30'
                  }`}
                >
                  <FiSun className="text-xl text-amber-500" />
                  <span className="text-xs font-bold text-slate-205">Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDarkMode(true)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border gap-2 transition-all cursor-pointer ${
                    darkMode
                      ? 'border-indigo-500 bg-slate-800/80 shadow-lg'
                      : 'border-slate-850 hover:border-slate-700 bg-slate-900/30'
                  }`}
                >
                  <FiMoon className="text-xl text-indigo-400" />
                  <span className="text-xs font-bold text-slate-205">Dark Mode</span>
                </button>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications config */}
          <Card title="Notification Preferences" subtitle="Control email and system desktop delivery configurations">
            <div className="space-y-4 pt-1">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FiBell className="text-base" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-205">Email Notifications</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Receive immediate alerts for new leads assignments</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-650 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <div className="h-px bg-slate-800" />

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <FiBell className="text-base" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-205">Weekly Performance Digest</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Receive email summaries of pipeline stats</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-650 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <div className="h-px bg-slate-800" />

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <FiBell className="text-base" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-205">Browser Audio & Banners</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Show notifications badges in tab window</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={browserAlerts}
                  onChange={(e) => setBrowserAlerts(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-650 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </Card>

          {/* Security details */}
          <Card title="Security & Authentication" subtitle="Enable stricter protocols to safeguard customer logs">
            <div className="space-y-4 pt-1">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-455">
                    <FiLock className="text-base" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-205">Two-Factor Authentication</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Require multi-factor codes during sign in attempts</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-650 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <div className="h-px bg-slate-800" />

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">Restricted Access IPs</span>
                <Input
                  placeholder="e.g. 192.168.1.1, 10.0.0.0/24"
                  className="text-xs"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Credentials */}
        <Card title="Integrations & API Tokens" subtitle="Sync pipelines metrics into Salesforce, HubSpot, or custom webhook hooks">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="API Access Token"
                icon={FiDatabase}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
              <Input
                label="Outgoing Webhook URL"
                icon={FiCompass}
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Action Panel */}
        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" icon={FiSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Configurations'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
