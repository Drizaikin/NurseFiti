'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MCQCardProps {
  question: {
    id: string;
    stem: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: 'A' | 'B' | 'C' | 'D';
    rationale: string;
    rationale_a?: string;
    rationale_b?: string;
    rationale_c?: string;
    rationale_d?: string;
    unit: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  questionNumber: number;
  totalQuestions: number;
  mode: 'tutor' | 'timed' | 'exam';
  onAnswer: (selectedOption: string, isCorrect: boolean, timeSpent: number) => void;
  onNext: () => void;
  onFlag?: () => void;
  isFlagged?: boolean;
  showTimer?: boolean;
}

export function MCQCard({
  question,
  questionNumber,
  totalQuestions,
  mode,
  onAnswer,
  onNext,
  onFlag,
  isFlagged = false,
  showTimer = false,
}: MCQCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [startTime] = useState(Date.now());

  const options = [
    { key: 'A', text: question.option_a, rationale: question.rationale_a },
    { key: 'B', text: question.option_b, rationale: question.rationale_b },
    { key: 'C', text: question.option_c, rationale: question.rationale_c },
    { key: 'D', text: question.option_d, rationale: question.rationale_d },
  ];

  const handleOptionSelect = (optionKey: string) => {
    if (selectedOption) return; // Already answered

    setSelectedOption(optionKey);
    const isCorrect = optionKey === question.correct_option;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    onAnswer(optionKey, isCorrect, timeSpent);

    // In tutor mode, show rationale immediately
    if (mode === 'tutor') {
      setShowRationale(true);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowRationale(false);
    onNext();
  };

  const getOptionStyle = (optionKey: string) => {
    if (!selectedOption) {
      return 'border-border hover:border-teal hover:bg-teal-xlight cursor-pointer';
    }

    if (optionKey === question.correct_option) {
      return 'border-green bg-green/10';
    }

    if (optionKey === selectedOption && optionKey !== question.correct_option) {
      return 'border-red bg-red/10';
    }

    return 'border-border opacity-50';
  };

  const difficultyColors = {
    easy: 'green',
    medium: 'amber',
    hard: 'red',
  } as const;

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="teal">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge variant={difficultyColors[question.difficulty]}>
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {showTimer && (
            <div className="text-sm font-semibold text-mid">
              ⏱️ 00:00
            </div>
          )}
          {onFlag && (
            <button
              onClick={onFlag}
              className={`p-2 rounded-lg transition-colors ${
                isFlagged
                  ? 'bg-amber text-white'
                  : 'hover:bg-teal-xlight text-mid'
              }`}
              aria-label="Flag question"
            >
              🚩
            </button>
          )}
        </div>
      </div>

      {/* Question Card */}
      <Card>
        {/* Topic */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-mid uppercase tracking-wider">
            {question.unit} • {question.topic}
          </span>
        </div>

        {/* Question Stem */}
        <div className="mb-6">
          <p className="text-dark dark:text-white text-base leading-relaxed">
            {question.stem}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionSelect(option.key)}
              disabled={!!selectedOption}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getOptionStyle(
                option.key
              )}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    selectedOption === option.key
                      ? option.key === question.correct_option
                        ? 'bg-green border-green text-white'
                        : 'bg-red border-red text-white'
                      : option.key === question.correct_option && selectedOption
                      ? 'bg-green border-green text-white'
                      : 'border-mid text-mid'
                  }`}
                >
                  {option.key}
                </div>
                <span className="flex-1 text-dark dark:text-white">
                  {option.text}
                </span>
                {selectedOption && option.key === question.correct_option && (
                  <span className="text-green text-xl">✓</span>
                )}
                {selectedOption &&
                  option.key === selectedOption &&
                  option.key !== question.correct_option && (
                    <span className="text-red text-xl">✗</span>
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Rationale (Tutor Mode) */}
        {showRationale && (
          <div className="mt-6 p-4 bg-teal-xlight border-l-4 border-teal rounded-lg">
            <h4 className="font-syne font-bold text-dark mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Explanation</span>
            </h4>
            <p className="text-dark text-sm leading-relaxed mb-4">
              {question.rationale}
            </p>

            {/* Individual Option Rationales */}
            {options.some((opt) => opt.rationale) && (
              <div className="space-y-2 mt-4 pt-4 border-t border-teal-light">
                <p className="text-xs font-semibold text-mid uppercase tracking-wider mb-2">
                  Why Each Option:
                </p>
                {options.map(
                  (option) =>
                    option.rationale && (
                      <div key={option.key} className="flex gap-2 text-sm">
                        <span className="font-bold text-dark">{option.key}:</span>
                        <span className="text-dark">{option.rationale}</span>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        {selectedOption && (
          <div className="mt-6">
            <Button onClick={handleNext} fullWidth>
              {questionNumber === totalQuestions ? 'Finish' : 'Next Question'} →
            </Button>
          </div>
        )}
      </Card>

      {/* Result Indicator */}
      {selectedOption && mode === 'tutor' && (
        <Card
          className={`${
            selectedOption === question.correct_option
              ? 'bg-green/10 border-green'
              : 'bg-red/10 border-red'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {selectedOption === question.correct_option ? '🎉' : '💪'}
            </span>
            <div>
              <p className="font-semibold text-dark">
                {selectedOption === question.correct_option
                  ? 'Correct! Well done!'
                  : 'Incorrect. Review the explanation above.'}
              </p>
              <p className="text-sm text-mid">
                {selectedOption === question.correct_option
                  ? '+8 XP earned'
                  : 'Keep practicing to improve'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
