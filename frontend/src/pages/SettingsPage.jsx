import { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Bell, Shield, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

function ThemeOption({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        active
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        active ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-sm font-medium ${active ? 'text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </span>
    </button>
  );
}

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    activity: true,
    security: true,
  });
  const [profile, setProfile] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    timezone: 'America/New_York',
  });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Profile settings saved successfully', 'success');
    }, 800);
  };

  const handleSaveNotifications = () => {
    addToast('Notification preferences updated', 'success');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your application preferences</p>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize how the dashboard looks</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md">
            <ThemeOption
              icon={Sun}
              label="Light"
              active={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <ThemeOption
              icon={Moon}
              label="Dark"
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
            <ThemeOption
              icon={Monitor}
              label="System"
              active={theme === 'system'}
              onClick={() => {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? 'dark' : 'light');
                addToast('Theme set to system preference', 'info');
              }}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">SCSS Variable Preview</h3>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
              <div><span className="text-violet-400">$theme</span>: <span className="text-emerald-400">{theme}</span>;</div>
              <div><span className="text-violet-400">$bg-primary</span>: <span className="text-emerald-400">{theme === 'dark' ? '#111827' : '#F9FAFB'}</span>;</div>
              <div><span className="text-violet-400">$bg-card</span>: <span className="text-emerald-400">{theme === 'dark' ? '#1F2937' : '#FFFFFF'}</span>;</div>
              <div><span className="text-violet-400">$text-primary</span>: <span className="text-emerald-400">{theme === 'dark' ? '#F9FAFB' : '#111827'}</span>;</div>
              <div><span className="text-violet-400">$text-secondary</span>: <span className="text-emerald-400">{theme === 'dark' ? '#9CA3AF' : '#4B5563'}</span>;</div>
              <div><span className="text-violet-400">$border-color</span>: <span className="text-emerald-400">{theme === 'dark' ? '#374151' : '#E5E7EB'}</span>;</div>
              <div><span className="text-violet-400">$accent-color</span>: <span className="text-emerald-400">#2563EB</span>;</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your account information</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <Input
              label="Display Name"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Timezone</label>
              <select
                value={profile.timezone}
                onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
              </select>
            </div>
            <div className="pt-2">
              <Button onClick={handleSaveProfile} loading={saving}>Save Profile</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Control what notifications you receive</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            {[
              { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', description: 'Browser push notifications for real-time updates' },
              { key: 'activity', label: 'Activity Alerts', description: 'Get notified about user activity in your dashboard' },
              { key: 'security', label: 'Security Alerts', description: 'Important security-related notifications' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
                <ToggleSwitch
                  enabled={notifications[item.key]}
                  onChange={(val) => {
                    setNotifications({ ...notifications, [item.key]: val });
                    handleSaveNotifications();
                  }}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Configuration</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your API connection settings</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">REST API Base URL</label>
              <div className="input-field bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 cursor-default">
                {window.location.origin}/api
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GraphQL Endpoint</label>
              <div className="input-field bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 cursor-default">
                {window.location.origin}/graphql
              </div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                This demo application uses SQLite for data persistence. All data is stored locally and resets when the server restarts on Render's free tier.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
