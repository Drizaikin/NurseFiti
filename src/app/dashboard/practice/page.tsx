'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MCQCard } from '@/components/shared/MCQCard';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

type PracticeMode = 'tutor' | 'timed' | 'weak-drill';

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [practicing, setPracticing] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Filters
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('tutor');
  const [questionCount, setQuestionCount] = useState(10);

  const units = [
    'All Units',
    'Pharmacology',
    'Medical Conditions',
    'Maternal & Child Health',
    'Community Health',
    'Mental Health',
    'Surgical Nursing',
    'Pediatric Nursing',
    'Geriatric Nursing',
  ];

  useEffect(() => {
    // Get filters from URL params
    const unit = searchParams.get('unit');
    const mode = searchParams.get('mode') as PracticeMode;
    
    if (unit) setSelectedUnit(unit);
    if (mode) setSelectedMode(mode);
    
    setLoading(false);
  }, [searchParams]);

  const startPractice = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase
        .from('questions')
        .select('*')
        .eq('status', 'approved')
        .limit(questionCount);

      // Filter by unit
      if (selectedUnit !== 'all' && selectedUnit !== 'All Units') {
        query = query.eq('unit', selectedUnit);
      }

      // For weak drill mode, get questions student got wrong
      if (selectedMode === 'weak-drill') {
        const { data: wrongAnswers } = await supabase
          .from('student_answers')
          .select('question_id')
          .eq('is_correct', false)
          .limit(100);

        if (wrongAnswers && wrongAnswers.length > 0) {
          const questionIds = wrongAnswers.map((a) => a.question_id);
          query = query.in('id', questionIds);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error('No questions found. Try different filters.');
        setLoading(false);
        return;
      }

      // Shuffle questions
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setPracticing(true);
      toast.success(`Starting practice with ${shuffled.length} questions`);
    } catch (error: any) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedOption: string, isCorrect: boolean, timeSpent: number) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Record answer
    const answer = {
      question_id: currentQuestion.id,
      selected_option: selectedOption,
      is_correct: isCorrect,
      time_taken_seconds: timeSpent,
    };

    setAnswers([...answers, answer]);

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('student_answers').insert({
          student_id: user.id,
          question_id: currentQuestion.id,
          selected_option: selectedOption,
          is_correct: isCorrect,
          time_taken_seconds: timeSpent,
          mode: 'practice',
        });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finish practice
      finishPractice();
    }
  };

  const handleFlag = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newFlagged = new Set(flaggedQuestions);
    
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
      toast.success('Question unflagged');
    } else {
      newFlagged.add(currentQuestion.id);
      toast.success('Question flagged for review');
    }
    
    setFlaggedQuestions(newFlagged);
  };

  const finishPractice = () => {
    const correctCount = answers.filter((a) => a.is_correct).length;
    const percentage = Math.round((correctCount / answers.length) * 100);

    toast.success(`Practice complete! Score: ${percentage}%`);
    setPracticing(false);
  };

  // Results view
  if (!practicing && answers.length > 0) {
    const correctCount = answers.filter((a) => a.is_correct).length;
    const percentage = Math.round((correctCount / answers.length) * 100);
    const totalTime = answers.reduce((sum, a) => sum + a.time_taken_seconds, 0);
    const avgTime = Math.round(totalTime / answers.length);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
            Practice Results
          </h2>
          <p className="text-mid">Great work! Here's how you did.</p>
        </div>

        {/* Results Card */}
        <Card className="bg-gradient-to-r from-teal to-teal-mid text-white">
          <div className="text-center py-8">
            <div className="text-6xl font-syne font-bold mb-2">{percentage}%</div>
            <p className="text-white/80 text-lg">
              {correctCount} out of {answers.length} correct
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-syne text-2xl font-bold text-dark dark:text-white">
                {correctCount}
              </div>
              <div className="text-sm text-mid">Correct Answers</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-syne text-2xl font-bold text-dark dark:text-white">
                {avgTime}s
              </div>
              <div className="text-sm text-mid">Avg Time per Question</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-syne text-2xl font-bold text-dark dark:text-white">
                +{correctCount * 8}
              </div>
              <div className="text-sm text-mid">XP Earned</div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => setAnswers([])} fullWidth>
            Practice Again
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')} fullWidth>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Practice view
  if (practicing && questions.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
              {selectedMode === 'tutor' && 'Tutor Mode'}
              {selectedMode === 'timed' && 'Timed Practice'}
              {selectedMode === 'weak-drill' && 'Weak Area Drill'}
            </h2>
            <p className="text-mid">
              {selectedUnit !== 'all' && selectedUnit !== 'All Units' && `${selectedUnit} • `}
              {answers.length} of {questions.length} answered
            </p>
          </div>
          <Button variant="outline" onClick={finishPractice}>
            End Practice
          </Button>
        </div>

        <MCQCard
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          mode={selectedMode === 'weak-drill' ? 'tutor' : selectedMode}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onFlag={handleFlag}
          isFlagged={flaggedQuestions.has(questions[currentQuestionIndex].id)}
          showTimer={selectedMode === 'timed'}
        />
      </div>
    );
  }

  // Setup view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
          MCQ Practice
        </h2>
        <p className="text-mid">
          Practice questions with instant feedback and detailed explanations
        </p>
      </div>

      <Card>
        <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
          Practice Settings
        </h3>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
            Practice Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedMode('tutor')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedMode === 'tutor'
                  ? 'border-teal bg-teal-xlight'
                  : 'border-border hover:border-teal-light'
              }`}
            >
              <div className="font-semibold text-dark dark:text-white mb-1">
                💡 Tutor Mode
              </div>
              <div className="text-xs text-mid">
                Instant feedback with detailed explanations
              </div>
            </button>
            <button
              onClick={() => setSelectedMode('timed')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedMode === 'timed'
                  ? 'border-teal bg-teal-xlight'
                  : 'border-border hover:border-teal-light'
              }`}
            >
              <div className="font-semibold text-dark dark:text-white mb-1">
                ⏱️ Timed Mode
              </div>
              <div className="text-xs text-mid">
                Practice under time pressure
              </div>
            </button>
            <button
              onClick={() => setSelectedMode('weak-drill')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedMode === 'weak-drill'
                  ? 'border-teal bg-teal-xlight'
                  : 'border-border hover:border-teal-light'
              }`}
            >
              <div className="font-semibold text-dark dark:text-white mb-1">
                🎯 Weak Area Drill
              </div>
              <div className="text-xs text-mid">
                Focus on questions you got wrong
              </div>
            </button>
          </div>
        </div>

        {/* Unit Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
            Select Unit
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {units.map((unit) => (
              <option key={unit} value={unit === 'All Units' ? 'all' : unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Question Count */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
            Number of Questions
          </label>
          <div className="flex gap-2">
            {[10, 20, 30, 50].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  questionCount === count
                    ? 'bg-teal text-white'
                    : 'bg-teal-xlight text-mid hover:bg-teal-light'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={startPractice} fullWidth disabled={loading}>
          {loading ? 'Loading...' : 'Start Practice'}
        </Button>
      </Card>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-border rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-border rounded w-1/2"></div>
        </div>
        <div className="h-64 bg-border rounded animate-pulse"></div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
