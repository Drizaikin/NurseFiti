import { createClient } from '@/utils/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get student profile
  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get today's stats
  const today = new Date().toISOString().split('T')[0];
  const { count: todayQuestions } = await supabase
    .from('student_answers')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .gte('answered_at', today);

  // Get average score
  const { data: answers } = await supabase
    .from('student_answers')
    .select('is_correct')
    .eq('student_id', user.id)
    .limit(100);

  const averageScore = answers && answers.length > 0
    ? Math.round((answers.filter(a => a.is_correct).length / answers.length) * 100)
    : 0;

  // Calculate days until exam
  const examDate = studentProfile?.exam_date ? new Date(studentProfile.exam_date) : null;
  const daysUntilExam = examDate
    ? Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Get recent activity (mock data for now)
  const recentActivity = [
    {
      type: 'practice',
      topic: 'Pharmacology',
      score: '85%',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      type: 'flashcards',
      topic: 'Medical Conditions',
      score: '24 cards',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      type: 'mock_exam',
      topic: 'KRCHN Paper I',
      score: '78%',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  // AI Recommendation (mock data)
  const weakUnits = ['Community Health', 'Maternal & Child Health'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-mid">
          {daysUntilExam && daysUntilExam > 0
            ? `${daysUntilExam} days until your ${studentProfile?.exam_cycle} exam`
            : 'Keep up the great work!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Questions */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mid font-semibold mb-1">Today's Questions</p>
              <p className="font-syne text-3xl font-bold text-dark dark:text-white">
                {todayQuestions || 0}
              </p>
              <p className="text-xs text-green mt-1">+12 from yesterday</p>
            </div>
            <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </Card>

        {/* Average Score */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mid font-semibold mb-1">Average Score</p>
              <p className="font-syne text-3xl font-bold text-dark dark:text-white">
                {averageScore}%
              </p>
              <p className="text-xs text-green mt-1">+5% this week</p>
            </div>
            <div className="w-12 h-12 bg-amber-light rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </Card>

        {/* Study Time */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mid font-semibold mb-1">Study Time</p>
              <p className="font-syne text-3xl font-bold text-dark dark:text-white">2.5h</p>
              <p className="text-xs text-mid mt-1">Today</p>
            </div>
            <div className="w-12 h-12 bg-[#DFFBF1] rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </Card>

        {/* XP Earned */}
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mid font-semibold mb-1">XP Earned</p>
              <p className="font-syne text-3xl font-bold text-dark dark:text-white">
                {studentProfile?.xp || 0}
              </p>
              <p className="text-xs text-mid mt-1">Level {studentProfile?.level || 1}</p>
            </div>
            <div className="w-12 h-12 bg-[#F3E8FF] rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Exam Countdown */}
      {daysUntilExam && daysUntilExam > 0 && (
        <Card className="bg-gradient-to-r from-teal to-teal-mid text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-syne text-xl font-bold mb-2">
                {studentProfile?.exam_cycle} {new Date(studentProfile?.exam_date || '').getFullYear()} NCK Exam
              </h3>
              <p className="text-white/80 text-sm">
                {studentProfile?.cadre} • {new Date(studentProfile?.exam_date || '').toLocaleDateString('en-KE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="font-syne text-5xl font-bold">{daysUntilExam}</div>
              <div className="text-sm text-white/80">days left</div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne text-lg font-bold text-dark dark:text-white">
                Recent Activity
              </h3>
              <Link href="/analytics" className="text-sm text-teal font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-teal-xlight transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">
                      {activity.type === 'practice' && '📝'}
                      {activity.type === 'flashcards' && '🗂️'}
                      {activity.type === 'mock_exam' && '🎯'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark dark:text-white text-sm">
                      {activity.topic}
                    </p>
                    <p className="text-xs text-mid">
                      {formatDistanceToNow(activity.time, { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="teal" size="sm">
                    {activity.score}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily Challenge */}
          <Card className="mt-6 bg-amber-light border-amber">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h3 className="font-syne text-lg font-bold text-dark mb-1">
                  Daily Challenge
                </h3>
                <p className="text-sm text-dark mb-3">
                  Answer 20 Pharmacology questions with 80%+ accuracy
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <ProgressBar value={12} max={20} color="amber" size="md" className="flex-1" />
                  <span className="text-sm font-bold text-amber-dark">12/20</span>
                </div>
                <Link href="/practice?unit=pharmacology">
                  <Button size="sm">Continue Challenge</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="font-syne text-lg font-bold text-dark dark:text-white">
                AI Study Recommendation
              </h3>
            </div>
            <p className="text-sm text-mid mb-4">
              Based on your recent performance, we recommend focusing on:
            </p>
            <div className="space-y-2 mb-4">
              {weakUnits.map((unit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red/10 border border-red/20 rounded-lg"
                >
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    {unit}
                  </span>
                  <Badge variant="red" size="sm">
                    Weak
                  </Badge>
                </div>
              ))}
            </div>
            <Link href="/practice?mode=weak-drill">
              <Button variant="secondary" size="sm" fullWidth>
                Start Weak Area Drill
              </Button>
            </Link>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link href="/mock-exam">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-xlight transition-colors text-left">
                  <span className="text-xl">🎯</span>
                  <div>
                    <p className="font-semibold text-dark dark:text-white text-sm">
                      Take Mock Exam
                    </p>
                    <p className="text-xs text-mid">DigiProctor simulation</p>
                  </div>
                </button>
              </Link>
              <Link href="/flashcards">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-xlight transition-colors text-left">
                  <span className="text-xl">🗂️</span>
                  <div>
                    <p className="font-semibold text-dark dark:text-white text-sm">
                      Review Flashcards
                    </p>
                    <p className="text-xs text-mid">24 cards due today</p>
                  </div>
                </button>
              </Link>
              <Link href="/tutors">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-xlight transition-colors text-left">
                  <span className="text-xl">👨‍🏫</span>
                  <div>
                    <p className="font-semibold text-dark dark:text-white text-sm">
                      Book a Tutor
                    </p>
                    <p className="text-xs text-mid">Get expert help</p>
                  </div>
                </button>
              </Link>
              <Link href="/revision-plan">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-amber-light transition-colors text-left border border-amber">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="font-semibold text-dark dark:text-white text-sm">
                      Generate Revision Plan
                    </p>
                    <p className="text-xs text-amber-dark font-semibold">KSh 500</p>
                  </div>
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
