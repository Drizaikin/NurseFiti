'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NurseFitiLogo } from './NurseFitiLogo';

interface SidebarProps {
  role: 'student' | 'tutor';
  streak?: number;
  xp?: number;
  level?: number;
}

export function Sidebar({ role, streak = 0, xp = 0, level = 1 }: SidebarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/practice', label: 'Practice', icon: '📝' },
    { href: '/mock-exam', label: 'Mock Exam', icon: '🎯' },
    { href: '/flashcards', label: 'Flashcards', icon: '🗂️' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/achievements', label: 'Achievements', icon: '🏆' },
    { href: '/groups', label: 'Study Groups', icon: '👥' },
    { href: '/revision-plan', label: 'Revision Plan', icon: '📅' },
    { href: '/tutors', label: 'Book Tutor', icon: '👨‍🏫' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const tutorLinks = [
    { href: '/tutor/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/tutor/schedule', label: 'Schedule', icon: '📅' },
    { href: '/tutor/students', label: 'Students', icon: '👥' },
    { href: '/tutor/studio', label: 'Content Studio', icon: '✍️' },
    { href: '/tutor/earnings', label: 'Earnings', icon: '💰' },
    { href: '/tutor/reviews', label: 'Reviews', icon: '⭐' },
    { href: '/tutor/profile', label: 'Profile', icon: '👤' },
  ];

  const links = role === 'student' ? studentLinks : tutorLinks;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 flex flex-col ${
        role === 'student'
          ? 'bg-dark dark:bg-dark-mid'
          : 'bg-gradient-to-b from-[#061412] via-[#0A2322] to-[#0F3030]'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href={role === 'student' ? '/dashboard' : '/tutor/dashboard'}>
          <NurseFitiLogo size="md" className="text-white" />
        </Link>
      </div>

      {/* Student Stats */}
      {role === 'student' && (
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">
              Level {level}
            </span>
            <span className="text-xs text-amber font-bold">{xp} XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-amber rounded-full transition-all duration-500"
              style={{ width: `${(xp % 300) / 3}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-white font-bold text-sm">{streak} Day Streak</div>
              <div className="text-white/60 text-xs">Keep it going!</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber text-dark'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <span className="text-lg">🚪</span>
          <span>Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
