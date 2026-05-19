import { createClient } from '@/utils/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default async function AnalyticsPage() {
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

  // Get all answers
  const { data: allAnswers } = await supabase
    .from('student_answers')
    .select('*')
    .eq('student_id', user.id)
    .order('answered_at', { ascending: false });

  // Get mock exam results
  const { data: mockExams } = await supabase
    .from('mock_exam_results')
    .select('*')
    .eq('student_id', user.id)
    .order('completed_at', { ascending: false });

  // Calculate overall accuracy
  const totalAnswers = allAnswers?.length || 0;
  const correctAnswers = allAnswers?.filter((a) => a.is_correct).length || 0;
  const overallAccuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Calculate unit mastery
  const unitStats: { [key: string]: { correct: number; total: number } } = {};
  
  if (allAnswers) {
    for (const answer of allAnswers) {
      // Get question to find unit
      const { data: question } = await supabase
        .from('questions')
        .select('unit')
        .eq('id', answer.question_id)
        .single();

      if (question) {
        const unit = question.unit;
        if (!unitStats[unit]) {
          unitStats[unit] = { correct: 0, total: 0 };
        }
        unitStats[unit].total++;
        if (answer.is_correct) {
          unitStats[unit].correct++;
        }
      }
    }
  }

  // Calculate exam readiness score (weighted composite)
  const examReadiness = Math.min(
    Math.round(
      overallAccuracy * 0.4 + // 40% weight on accuracy
      (mockExams && mockExams.length > 0 ? mockExams[0].score_percentage * 0.3 : 0) + // 30% weight on latest mock
      (totalAnswers > 100 ? 30 : (totalAnswers / 100) * 30) // 30% weight on practice volume
    ),
    100
  );

  // Get weekly trend (last 7 days)
  const weeklyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayAnswers = allAnswers?.filter((a) => 
      a.answered_at.startsWith(dateStr)
    ) || [];
    
    const dayCorrect = dayAnswers.filter((a) => a.is_correct).length;
    const dayTotal = dayAnswers.length;
    const dayScore = dayTotal > 0 ? Math.round((dayCorrect / dayTotal) * 100) : 0;
    
    weeklyTrend.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      score: dayScore,
      count: dayTotal,
    });
  }

  // Calculate total study time (rough estimate: 1 min per question)
  const totalStudyHours = Math.round((totalAnswers * 1) / 60);

  // Peer percentile (mock calculation)
  const peerPercentile = Math.min(Math.round(overallAccuracy * 0.9), 95);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
          Analytics
        </h2>
        <p className="text-mid">
          Track your performance and identify areas for improvement
        </p>
      </div>

      {/* Exam Readiness Score */}
      <Card className="bg-gradient-to-r from-teal to-teal-mid text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Exam Readiness Score</h3>
            <div className="flex items-baseline gap-3">
              <span className="font-syne text-5xl font-bold">{examReadiness}%</span>
              <Badge 
                variant={examReadiness >= 75 ? 'green' : examReadiness >= 50 ? 'amber' : 'red'}
                className="mb-2"
              >
                {examReadiness >= 75 ? 'Ready' : examReadiness >= 50 ? 'Almost Ready' : 'Keep Practicing'}
              </Badge>
            </div>
            <p className="text-sm opacity-80 mt-2">
              Based on accuracy, mock exam performance, and practice volume
            </p>
          </div>
          <div className="text-6xl opacity-20">📊</div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-syne text-2xl font-bold text-dark dark:text-white">
              {totalAnswers}
            </div>
            <div className="text-sm text-mid">Questions Answered</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-syne text-2xl font-bold text-dark dark:text-white">
              {overallAccuracy}%
            </div>
            <div className="text-sm text-mid">Overall Accuracy</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="font-syne text-2xl font-bold text-dark dark:text-white">
              {totalStudyHours}h
            </div>
            <div className="text-sm text-mid">Total Study Time</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="font-syne text-2xl font-bold text-dark dark:text-white">
              {peerPercentile}%
            </div>
            <div className="text-sm text-mid">Peer Percentile</div>
          </div>
        </Card>
      </div>

      {/* Unit Mastery */}
      <Card>
        <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
          Unit Mastery
        </h3>
        <div className="space-y-4">
          {Object.entries(unitStats)
            .sort((a, b) => {
              const aPercent = (a[1].correct / a[1].total) * 100;
              const bPercent = (b[1].correct / b[1].total) * 100;
              return bPercent - aPercent;
            })
            .map(([unit, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100);
              const color = percentage >= 75 ? 'green' : percentage >= 50 ? 'amber' : 'red';
              
              return (
                <div key={unit}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-dark dark:text-white">
                      {unit}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-mid">
                        {stats.correct}/{stats.total}
                      </span>
                      <Badge variant={color} size="sm">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <ProgressBar value={percentage} color={color} size="md" />
                </div>
              );
            })}
          {Object.keys(unitStats).length === 0 && (
            <div className="text-center py-8 text-mid">
              <p>No practice data yet. Start practicing to see your unit mastery!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
          Weekly Performance Trend
        </h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyTrend.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col justify-end h-40 mb-2">
                <div
                  className={`w-full rounded-t transition-all ${
                    day.score >= 75
                      ? 'bg-green'
                      : day.score >= 50
                      ? 'bg-amber'
                      : day.score > 0
                      ? 'bg-red'
                      : 'bg-border'
                  }`}
                  style={{ height: `${day.score > 0 ? day.score : 5}%` }}
                  title={`${day.score}% (${day.count} questions)`}
                />
              </div>
              <div className="text-xs text-mid font-semibold">{day.day}</div>
              <div className="text-xs text-mid">{day.score}%</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-mid">
          Last 7 days • Hover over bars for details
        </div>
      </Card>

      {/* Mock Exam History */}
      <Card>
        <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
          Mock Exam History
        </h3>
        {mockExams && mockExams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-mid">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-mid">Paper</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-mid">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-mid">Time</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-mid">Result</th>
                </tr>
              </thead>
              <tbody>
                {mockExams.map((exam) => (
                  <tr key={exam.id} className="border-b border-border hover:bg-teal-xlight">
                    <td className="py-3 px-4 text-sm text-dark dark:text-white">
                      {new Date(exam.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-dark dark:text-white">
                      {exam.paper}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          exam.score_percentage >= 75
                            ? 'green'
                            : exam.score_percentage >= 50
                            ? 'amber'
                            : 'red'
                        }
                      >
                        {exam.score_percentage}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-mid text-center">
                      {exam.time_used_minutes} min
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={exam.passed ? 'green' : 'red'} size="sm">
                        {exam.passed ? 'PASS' : 'FAIL'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-mid">
            <p>No mock exams completed yet. Take your first mock exam to see results here!</p>
          </div>
        )}
      </Card>

      {/* Insights */}
      <Card className="bg-teal-xlight border-teal-light">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-syne font-bold text-dark mb-2">AI Insights</h3>
            <ul className="text-sm text-dark space-y-2">
              {overallAccuracy < 60 && (
                <li>• Your accuracy is below 60%. Focus on understanding concepts rather than memorizing.</li>
              )}
              {totalAnswers < 100 && (
                <li>• You've answered fewer than 100 questions. Aim for at least 2,000 before your exam.</li>
              )}
              {mockExams && mockExams.length === 0 && (
                <li>• Take a mock exam to assess your readiness under exam conditions.</li>
              )}
              {Object.entries(unitStats).some(([_, stats]) => (stats.correct / stats.total) < 0.5) && (
                <li>• Some units are below 50% mastery. Use Weak Area Drill mode to improve.</li>
              )}
              {examReadiness >= 75 && (
                <li>✓ You're on track! Keep practicing consistently to maintain your readiness.</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
