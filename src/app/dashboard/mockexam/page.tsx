"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MockExamPage() {
  const [selectedPaper, setSelectedPaper] = useState<'paper1' | 'paper2' | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(100).fill(null));
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isExamStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isExamStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartExam = (paper: 'paper1' | 'paper2') => {
    setSelectedPaper(paper);
    setIsExamStarted(true);
    setTimeRemaining(7200);
    setCurrentQuestion(0);
    setSelectedAnswers(Array(100).fill(null));
    setFlaggedQuestions(new Set());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < 99) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    const answeredCount = selectedAnswers.filter(a => a !== null).length;
    if (answeredCount < 100) {
      const confirmed = confirm(`You have only answered ${answeredCount} out of 100 questions. Are you sure you want to submit?`);
      if (!confirmed) return;
    }
    alert('Exam submitted! Results will be displayed shortly.');
    setIsExamStarted(false);
  };

  // Sample question (in production, this would come from database)
  const sampleQuestion = {
    id: currentQuestion + 1,
    text: "A patient presents with sudden onset severe headache described as 'the worst headache of my life,' neck stiffness, and photophobia. The nurse's priority action should be to:",
    options: [
      "Administer prescribed analgesia and reassess in 30 minutes",
      "Notify the physician immediately and prepare for lumbar puncture",
      "Place the patient in a dark, quiet room and dim the lights",
      "Assess the patient's vital signs and document findings"
    ],
    unit: "Medical–Surgical Nursing"
  };

  if (!isExamStarted) {
    return (
      <div className="view active">
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="card-title" style={{ marginBottom: '8px' }}>🎯 Mock Exam</h2>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>
            Take a full-length timed mock exam in the exact DigiProctor interface. 100 questions, 2 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ border: '2px solid var(--teal)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dark)', marginBottom: '8px' }}>
                📝 Paper 1
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '12px' }}>
                Medical-Surgical Nursing, Community Health, Pharmacology
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--mid)' }}>
                <div>✓ 100 questions</div>
                <div>✓ 2 hours timed</div>
                <div>✓ Instant results</div>
              </div>
            </div>
            <button
              onClick={() => handleStartExam('paper1')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Start Paper 1 →
            </button>
          </div>

          <div className="card" style={{ border: '2px solid var(--amber)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dark)', marginBottom: '8px' }}>
                📝 Paper 2
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '12px' }}>
                Maternal & Child Health, Psychiatric Nursing, Research Methods
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--mid)' }}>
                <div>✓ 100 questions</div>
                <div>✓ 2 hours timed</div>
                <div>✓ Instant results</div>
              </div>
            </div>
            <button
              onClick={() => handleStartExam('paper2')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Start Paper 2 →
            </button>
          </div>
        </div>

        <div className="card" style={{ marginTop: '20px', background: 'var(--teal-light)', border: '1px solid var(--teal)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>💡</div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                Exam Tips
              </h4>
              <ul style={{ fontSize: '13px', color: 'var(--dark)', lineHeight: 1.7, paddingLeft: '20px' }}>
                <li>Find a quiet environment with stable internet</li>
                <li>You cannot pause once started - full 2 hours</li>
                <li>Flag difficult questions to review later</li>
                <li>Pace yourself: ~1.2 minutes per question</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestion + 1) / 100) * 100;
  const answeredCount = selectedAnswers.filter(a => a !== null).length;

  return (
    <div className="view active" style={{ padding: 0 }}>
      {/* Exam Header */}
      <div style={{
        background: 'var(--teal)',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--white)' }}>
          NCK DigiProctor — {selectedPaper === 'paper1' ? 'KRCHN Paper 1' : 'KRCHN Paper 2'}
        </span>
        <span style={{
          background: 'rgba(0,0,0,.3)',
          padding: '6px 14px',
          borderRadius: 'var(--r-full)',
          fontSize: '15px',
          fontWeight: 700,
          color: timeRemaining < 600 ? 'var(--red)' : 'var(--amber)'
        }}>
          {formatTime(timeRemaining)}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: 'var(--border)' }}>
        <div style={{
          height: '100%',
          background: 'var(--amber)',
          width: `${progressPercentage}%`,
          transition: 'width 0.3s'
        }}></div>
      </div>

      {/* Question Content */}
      <div style={{ padding: '24px' }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--mid)',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '.05em'
        }}>
          Question {currentQuestion + 1} of 100 · {sampleQuestion.unit}
        </div>

        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--dark)',
          lineHeight: 1.6,
          marginBottom: '24px'
        }}>
          {sampleQuestion.text}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {sampleQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              style={{
                padding: '14px 16px',
                border: `2px solid ${selectedAnswers[currentQuestion] === index ? 'var(--teal)' : 'var(--border)'}`,
                borderRadius: 'var(--r)',
                background: selectedAnswers[currentQuestion] === index ? 'var(--teal-light)' : 'var(--white)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: `2px solid ${selectedAnswers[currentQuestion] === index ? 'var(--teal)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
                background: selectedAnswers[currentQuestion] === index ? 'var(--teal)' : 'transparent',
                color: selectedAnswers[currentQuestion] === index ? 'white' : 'var(--mid)'
              }}>
                {String.fromCharCode(65 + index)}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--dark)' }}>{option}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={toggleFlag}
              style={{
                padding: '8px 16px',
                border: `1.5px solid ${flaggedQuestions.has(currentQuestion) ? 'var(--amber)' : 'var(--border)'}`,
                borderRadius: 'var(--r-full)',
                background: flaggedQuestions.has(currentQuestion) ? 'var(--amber-light)' : 'transparent',
                color: 'var(--dark)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {flaggedQuestions.has(currentQuestion) ? '🚩 Flagged' : '🏳️ Flag'}
            </button>
            <span style={{ fontSize: '13px', color: 'var(--mid)' }}>
              {answeredCount}/100 answered · {flaggedQuestions.size} flagged
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="btn btn-outline"
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Previous
            </button>
            {currentQuestion < 99 ? (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px', background: 'var(--green)' }}
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
