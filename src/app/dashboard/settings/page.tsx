'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'exam' | 'notifications' | 'display' | 'billing'>('profile');

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
  });

  const [examSettings, setExamSettings] = useState({
    cadre: '',
    specialty: '',
    examDate: '',
    examCycle: '',
  });

  const [notifications, setNotifications] = useState({
    studyReminders: true,
    dailyMCQ: false,
    streakAlerts: true,
    examReminders: true,
    whatsappNotifications: true,
  });

  const [display, setDisplay] = useState({
    theme: 'light',
    largeText: false,
    soundEffects: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const { data: studentData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          fullName: profileData.full_name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          institution: studentData?.institution || '',
        });
      }

      if (studentData) {
        setExamSettings({
          cadre: studentData.cadre || '',
          specialty: studentData.specialty || '',
          examDate: studentData.exam_date || '',
          examCycle: studentData.exam_cycle || '',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
        })
        .eq('id', user.id);

      await supabase
        .from('student_profiles')
        .update({
          institution: profile.institution,
        })
        .eq('id', user.id);

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveExamSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('student_profiles')
        .update({
          cadre: examSettings.cadre,
          specialty: examSettings.specialty,
          exam_date: examSettings.examDate,
          exam_cycle: examSettings.examCycle,
        })
        .eq('id', user.id);

      toast.success('Exam settings updated successfully');
    } catch (error: any) {
      toast.error('Failed to update exam settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'exam', label: 'Exam Settings', icon: '🎯' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'display', label: 'Display & Theme', icon: '🎨' },
    { id: 'billing', label: 'Plan & Billing', icon: '💳' },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
          Settings
        </h2>
        <p className="text-mid">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-teal text-white'
                : 'bg-white dark:bg-white text-mid hover:bg-teal-xlight'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 border border-border rounded-lg bg-teal-xlight cursor-not-allowed"
              />
              <p className="text-xs text-mid mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Phone Number (M-Pesa)
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Institution / College
              </label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <Button onClick={saveProfile} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      )}

      {/* Exam Settings Tab */}
      {activeTab === 'exam' && (
        <Card>
          <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
            Exam Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Cadre
              </label>
              <select
                value={examSettings.cadre}
                onChange={(e) => setExamSettings({ ...examSettings, cadre: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="">Select cadre...</option>
                <option value="KRCHN">KRCHN</option>
                <option value="BScN">BScN</option>
                <option value="Higher Diploma">Higher Diploma</option>
              </select>
            </div>
            {examSettings.cadre === 'Higher Diploma' && (
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                  Specialty
                </label>
                <select
                  value={examSettings.specialty}
                  onChange={(e) => setExamSettings({ ...examSettings, specialty: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">Select specialty...</option>
                  <option value="Critical Care">Critical Care</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Renal">Renal</option>
                  <option value="Psychiatric">Psychiatric</option>
                  <option value="Peri-Op">Peri-Op</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Target Exam Date
              </label>
              <input
                type="date"
                value={examSettings.examDate}
                onChange={(e) => setExamSettings({ ...examSettings, examDate: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">
                Exam Cycle
              </label>
              <select
                value={examSettings.examCycle}
                onChange={(e) => setExamSettings({ ...examSettings, examCycle: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="">Select cycle...</option>
                <option value="May">May 2026</option>
                <option value="August">August 2026</option>
                <option value="November">November 2026</option>
              </select>
            </div>
            <Button onClick={saveExamSettings} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg hover:bg-teal-xlight">
                <div>
                  <div className="font-semibold text-dark dark:text-white">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-mid">
                    {key === 'studyReminders' && 'Daily reminders to study'}
                    {key === 'dailyMCQ' && 'Receive daily MCQ via WhatsApp'}
                    {key === 'streakAlerts' && 'Alerts when streak is at risk'}
                    {key === 'examReminders' && 'NCK exam registration reminders'}
                    {key === 'whatsappNotifications' && 'Receive notifications via WhatsApp'}
                  </div>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    value ? 'bg-teal' : 'bg-border'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
            <Button onClick={() => toast.success('Notification preferences saved')}>
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Display & Theme Tab */}
      {activeTab === 'display' && (
        <Card>
          <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
            Display & Theme
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDisplay({ ...display, theme: 'light' })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    display.theme === 'light'
                      ? 'border-teal bg-teal-xlight'
                      : 'border-border hover:border-teal-light'
                  }`}
                >
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="font-semibold text-dark">Light Mode</div>
                </button>
                <button
                  onClick={() => setDisplay({ ...display, theme: 'dark' })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    display.theme === 'dark'
                      ? 'border-teal bg-teal-xlight'
                      : 'border-border hover:border-teal-light'
                  }`}
                >
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="font-semibold text-dark">Dark Mode</div>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-teal-xlight">
              <div>
                <div className="font-semibold text-dark dark:text-white">Large Text</div>
                <div className="text-sm text-mid">Increase font size for better readability</div>
              </div>
              <button
                onClick={() => setDisplay({ ...display, largeText: !display.largeText })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  display.largeText ? 'bg-teal' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    display.largeText ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-teal-xlight">
              <div>
                <div className="font-semibold text-dark dark:text-white">Sound Effects</div>
                <div className="text-sm text-mid">Play sounds for correct/incorrect answers</div>
              </div>
              <button
                onClick={() => setDisplay({ ...display, soundEffects: !display.soundEffects })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  display.soundEffects ? 'bg-teal' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    display.soundEffects ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <Button onClick={() => toast.success('Display settings saved')}>
              Save Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Plan & Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-syne text-lg font-bold text-dark dark:text-white">
                  Current Plan
                </h3>
                <p className="text-sm text-mid">Free Plan</p>
              </div>
              <Badge variant="teal">Active</Badge>
            </div>
            <p className="text-sm text-mid mb-4">
              Upgrade to unlock premium features and unlimited access
            </p>
            <Button variant="secondary">Upgrade to Premium</Button>
          </Card>

          <Card>
            <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
              Payment History
            </h3>
            <div className="text-center py-8 text-mid">
              <p>No payment history yet</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
