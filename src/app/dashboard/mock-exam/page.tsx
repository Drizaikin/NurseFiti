'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function MockExamPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [selectedPaper, setSelectedPaper] = useState<string>('');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);

  const papers = [
    { id: 'KRCHN_P1', name: 'KRCHN Paper I', duration: 120, questions: 100 },
    { id: 'KRCHN_P2', name: 'KRCHN Paper II', duration: 120, questions: 100 },
    { id: 'BScN_P1', name: 'BScN Paper I', duration: 180, questions: 100 },
    { id: 'BScN_P2', name: 'BScN Paper II', duration: 180, questions: 100 },
    { id: 'BScN_P3', name: 'BScN Paper III', duration: 180, questions: 100 },
    { id: 'BScN_P4', name: 'BScN Paper IV', duration: 180, questions: 100 },
  ];

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = async () => {
    if (!selectedPaper) {
      toast.error('Please select a paper');
      return;
    }

    setLoading(true);
    try {
      // Load 100 random questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('status', 'approved')
        .limit(100);

      if (error) throw error;

      if (!data || data.length < 100) {
        toast.error('Not enough questions available for mock exam');
        setLoading(false);
        return;
      }

      // Shuffle and take exactly 100
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 100);
      setQuestions(shuffled);
      
      const paper = papers.find((p) => p.id === selectedPaper);
      setTimeRemaining((paper?.duration || 120) * 60);
      
      setExamStarted(true);
      toast.success('Mock exam started. Good luck!');
    } catch (error: any) {
      console.error('Error loading exam:', error);
      toast.error('Failed to load exam questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const handleFlag = (questionIndex: number) => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(questionIndex)) {
      newFlagged.delete(questionIndex);
    } else {
      newFlagged.add(questionIndex);
    }
    setFlagged(newFlagged);
  };

  const handleAutoSubmit = () => {
    toast.error('Time is up! Submitting exam...');
    submitExam();
  };

  const submitExam = async () => {
    setShowSubmitConfirm(false);
    
    // Calculate results
    let correctCount = 0;
    const detailedResults = questions.map((q, index) => {
      const studentAnswer = answers[index];
      const isCorrect = studentAnswer === q.correct_option;
      if (isCorrect) correctCount++;
      
      return {
        question: q,
        studentAnswer,
        isCorrect,
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 50; // 50% pass mark
    const paper = papers.find((p) => p.id === selectedPaper);
    const timeUsed = (paper?.duration || 120) * 60 - timeRemaining;

    const results = {
      paper: selectedPaper,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage,
      passed,
      timeUsed: Math.floor(timeUsed / 60), // in minutes
      detailedResults,
    };

    setExamResults(results);

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('mock_exam_results').insert({
          student_id: user.id,
          cadre: selectedPaper.includes('KRCHN') ? 'KRCHN' : 'BScN',
          paper: selectedPaper,
          total_questions: questions.length,
          correct_answers: correctCount,
          score_percentage: percentage,
          time_used_minutes: Math.floor(timeUsed / 60),
          passed,
          started_at: new Date(Date.now() - timeUsed * 1000).toISOString(),
          completed_at: new Date().toISOString(),
        });

        // Save individual answers
        const answerRecords = questions.map((q, index) => ({
          student_id: user.id,
          question_id: q.id,
          selected_option: answers[index] || '',
          is_correct: answers[index] === q.correct_option,
          time_taken_seconds: 0,
          mode: 'mock_exam',
        }));

        await supabase.from('student_answers').insert(answerRecords);
      }
    } catch (error) {
      console.error('Error saving exam results:', error);
    }

    toast.success(`Exam complete! Score: ${percentage}%`);
  };

  // Results view
  if (examResults) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
            Mock Exam Results
          </h2>
          <p className="text-mid">{examResults.paper}</p>
        </div>

        {/* Score Card */}
        <Card
          className={`${
            examResults.passed
              ? 'bg-gradient-to-r from-green to-[#0F6E56]'
              : 'bg-gradient-to-r from-red to-[#C0392B]'
          } text-white`}
        >
          <div className="text-center py-8">
            <div className="text-6xl font-syne font-bold mb-2">
              {examResults.percentage}%
            </div>
            <p className="text-white/90 text-xl mb-4">
              {examResults.correctAnswers} out of {examResults.totalQuestions} correct
            </p>
            <Badge variant={examResults.passed ? 'green' : 'red'} size="md">
              {examResults.passed ? '✓ PASSED' : '✗ FAILED'}
            </Badge>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-syne text-2xl font-bold text-dark dark:text-white">
                {examResults.timeUsed} min
              </div>
              <div className="text-sm text-mid">Time Used</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-syne text-2xl font-bold text-dark dark:text-white">
                {examResults.correctAnswers}
              </div>
              <div className="text-sm text-mid">Correct Answers</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-syne text-2xl font-bold text-dark dark:text-white">
                +200
              </div>
              <div className="text-sm text-mid">XP Earned</div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setExamResults(null);
              setExamStarted(false);
              setAnswers({});
              setFlagged(new Set());
            }}
            fullWidth
          >
            Take Another Exam
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')} fullWidth>
            Back to Dashboard
          </Button>
        </div>

        {/* Question Review */}
        <Card>
          <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
            Question-by-Question Review
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {examResults.detailedResults.map((result: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.isCorrect
                    ? 'bg-green/10 border-green'
                    : 'bg-red/10 border-red'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-dark dark:text-white text-sm">
                    Question {index + 1}
                  </span>
                  <Badge variant={result.isCorrect ? 'green' : 'red'} size="sm">
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>
                <p className="text-sm text-dark dark:text-white mb-2">
                  {result.question.stem}
                </p>
                <div className="text-xs text-mid">
                  Your answer: <strong>{result.studentAnswer || 'Not answered'}</strong> •
                  Correct answer: <strong>{result.question.correct_option}</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Exam view
  if (examStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = answers[currentQuestionIndex] !== undefined;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-[#0A1A1A] text-white -m-6 p-6">
        {/* Exam Header */}
        <div className="bg-teal border-b border-white/10 -mx-6 -mt-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="font-syne font-bold">
              {papers.find((p) => p.id === selectedPaper)?.name}
            </div>
            <div
              className={`font-syne font-bold text-lg px-4 py-2 rounded-full ${
                timeRemaining < 1200 ? 'bg-red text-white' : 'bg-black/30'
              }`}
            >
              ⏱️ {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="bg-[#111E1E] border-white/10 sticky top-6">
              <h3 className="font-semibold text-white mb-3 text-sm">
                Question Navigator
              </h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded text-sm font-bold transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-teal text-white'
                        : answers[index]
                        ? 'bg-green/20 text-green border border-green'
                        : flagged.has(index)
                        ? 'bg-amber/20 text-amber border border-amber'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="text-xs text-white/60 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green/20 border border-green rounded"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber/20 border border-amber rounded"></div>
                  <span>Flagged ({flagged.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/5 rounded"></div>
                  <span>Not answered ({100 - answeredCount})</span>
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                className="mt-4"
                onClick={() => setShowSubmitConfirm(true)}
              >
                Submit Exam
              </Button>
            </Card>
          </div>

          {/* Question Display */}
          <div className="lg:col-span-3">
            <Card className="bg-[#111E1E] border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="teal">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <button
                  onClick={() => handleFlag(currentQuestionIndex)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    flagged.has(currentQuestionIndex)
                      ? 'bg-amber text-dark'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  🚩 Flag
                </button>
              </div>

              <div className="mb-4 text-xs text-white/40 uppercase tracking-wider">
                {currentQuestion.unit} • {currentQuestion.topic}
              </div>

              <p className="text-white text-base leading-relaxed mb-6">
                {currentQuestion.stem}
              </p>

              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = currentQuestion[`option_${option.toLowerCase()}`];
                  const isSelected = answers[currentQuestionIndex] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-teal bg-teal/20'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                            isSelected
                              ? 'bg-teal border-teal text-white'
                              : 'border-white/30 text-white/50'
                          }`}
                        >
                          {option}
                        </div>
                        <span className="flex-1 text-white">{optionText}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  fullWidth
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(questions.length - 1, currentQuestionIndex + 1)
                    )
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  fullWidth
                >
                  Next →
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <Card className="max-w-md bg-[#111E1E] border-white/10">
              <h3 className="font-syne text-xl font-bold text-white mb-4">
                Submit Exam?
              </h3>
              <p className="text-white/70 mb-6">
                You have answered {answeredCount} out of {questions.length} questions.
                {answeredCount < questions.length &&
                  ` ${questions.length - answeredCount} questions are unanswered.`}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} fullWidth>
                  Cancel
                </Button>
                <Button variant="danger" onClick={submitExam} fullWidth>
                  Submit Exam
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Setup view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
          Mock Exam
        </h2>
        <p className="text-mid">
          DigiProctor-identical exam simulation with real-time timer
        </p>
      </div>

      <Card className="bg-amber-light border-amber">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="font-syne font-bold text-dark mb-2">
              Important: Exam Conditions
            </h3>
            <ul className="text-sm text-dark space-y-1">
              <li>• Once started, the timer cannot be paused</li>
              <li>• You must complete all 100 questions</li>
              <li>• No rationales shown during the exam</li>
              <li>• Exam auto-submits when time runs out</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-4">
          Select Paper
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {papers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => setSelectedPaper(paper.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedPaper === paper.id
                  ? 'border-teal bg-teal-xlight'
                  : 'border-border hover:border-teal-light'
              }`}
            >
              <div className="font-semibold text-dark dark:text-white mb-1">
                {paper.name}
              </div>
              <div className="text-xs text-mid">
                {paper.questions} questions • {paper.duration} minutes
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={startExam}
          fullWidth
          disabled={!selectedPaper || loading}
          className="mt-6"
        >
          {loading ? 'Loading...' : 'Start Mock Exam'}
        </Button>
      </Card>
    </div>
  );
}
