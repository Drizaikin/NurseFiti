'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface TopbarProps {
  userName: string;
  userAvatar?: string;
  xp?: number;
  streak?: number;
  notifications?: number;
  breadcrumb?: string;
}

export function Topbar({
  userName,
  userAvatar,
  xp = 0,
  streak = 0,
  notifications = 0,
  breadcrumb = 'Dashboard',
}: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Breadcrumb */}
        <div>
          <h1 className="font-syne text-xl font-bold text-dark">{breadcrumb}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* XP Badge */}
          {xp > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-amber-light px-3 py-1.5 rounded-full">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-bold text-amber-dark">{xp} XP</span>
            </div>
          )}

          {/* Streak Badge */}
          {streak > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-teal-light px-3 py-1.5 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-bold text-teal">{streak} days</span>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-teal-xlight transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <svg
                className="w-5 h-5 text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-teal-xlight transition-colors"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-syne font-bold text-dark">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications === 0 ? (
                    <div className="p-8 text-center text-mid text-sm">
                      No new notifications
                    </div>
                  ) : (
                    <div className="p-2">
                      {/* Placeholder notifications */}
                      <div className="p-3 hover:bg-teal-xlight rounded-lg cursor-pointer">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🎯</span>
                          <div className="flex-1">
                            <p className="text-sm text-dark font-semibold">
                              Daily Challenge Available
                            </p>
                            <p className="text-xs text-mid mt-1">
                              Complete today's challenge to earn bonus XP
                            </p>
                            <p className="text-xs text-light mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-border text-center">
                  <button className="text-sm text-teal font-semibold hover:underline">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar name={userName} src={userAvatar} size="md" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-dark">{userName}</p>
                  <p className="text-xs text-mid mt-1">Student</p>
                </div>
                <div className="p-2">
                  <a
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark hover:bg-teal-xlight transition-colors"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </a>
                  <a
                    href="/bookings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark hover:bg-teal-xlight transition-colors"
                  >
                    <span>📅</span>
                    <span>My Bookings</span>
                  </a>
                  <a
                    href="/logout"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red hover:bg-red/10 transition-colors"
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
