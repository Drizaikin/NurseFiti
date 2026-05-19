import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Get student profile
  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'student') {
    redirect('/tutor/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-dark">
      {/* Sidebar */}
      <Sidebar
        role="student"
        streak={studentProfile?.streak_count || 0}
        xp={studentProfile?.xp || 0}
        level={studentProfile?.level || 1}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Topbar
          userName={profile.full_name}
          userAvatar={profile.avatar_url}
          xp={studentProfile?.xp || 0}
          streak={studentProfile?.streak_count || 0}
          notifications={0}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
