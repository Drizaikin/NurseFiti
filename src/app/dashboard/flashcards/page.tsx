'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function FlashcardsPage() {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [studying, setStudying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(0);

  // Mock decks data
  const decks = [
    {
      id: '1',
      name: 'Pharmacology',
      cardCount: 124,
      dueCount: 24,
      cadre: 'KRCHN',
      unit: 'Pharmacology',
    },
    {
      id: '2',
      name: 'Medical Conditions',
      cardCount: 86,
      dueCount: 12,
      cadre: 'KRCHN',
      unit: 'Medical-Surgical',
    },
    {
      id: '3',
      name: 'Midwifery Terms',
      cardCount: 68,
      dueCount: 8,
      cadre: 'KRCHN',
      unit: 'Maternal Health',
    },
    {
      id: '4',
      name: 'Lab Values',
      cardCount: 52,
      dueCount: 15,
      cadre: 'BScN',
      unit: 'Clinical Skills',
    },
    {
      id: '5',
      name: 'Community Health',
      cardCount: 94,
      dueCount: 18,
      cadre: 'KRCHN',
      unit: 'Community Health',
    },
  ];

  // Mock cards data
  const mockCards = [
    {
      front: 'What is the normal range for adult blood pressure?',
      back: '120/80 mmHg',
      highlight: 'Systolic: 90-120 mmHg, Diastolic: 60-80 mmHg',
    },
    {
      front: 'Define tachycardia',
      back: 'Heart rate greater than 100 beats per minute',
      highlight: '>100 bpm',
    },
    {
      front: 'What is the first-line treatment for anaphylaxis?',
      back: 'Intramuscular epinephrine (adrenaline)',
      highlight: 'IM Epinephrine 0.3-0.5mg',
    },
  ];

  const startStudying = () => {
    if (!selectedDeck) {
      toast.error('Please select a deck first');
      return;
    }
    setStudying(true);
    setCurrentCardIndex(0);
    setFlipped(false);
    setCardsReviewed(0);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const ratingMessages = {
      again: 'Card will be shown again soon',
      hard: 'Card scheduled for tomorrow',
      good: 'Card scheduled in 3 days',
      easy: 'Card scheduled in 7 days',
    };

    toast.success(ratingMessages[rating]);
    setCardsReviewed(cardsReviewed + 1);

    // Move to next card
    if (currentCardIndex < mockCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else {
      // Finish session
      finishSession();
    }
  };

  const finishSession = () => {
    toast.success(`Session complete! ${cardsReviewed + 1} cards reviewed`);
    setStudying(false);
    setSelectedDeck(null);
  };

  // Study view
  if (studying) {
    const currentCard = mockCards[currentCardIndex];
    const deck = decks.find((d) => d.id === selectedDeck);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
              {deck?.name}
            </h2>
            <p className="text-mid">
              Card {currentCardIndex + 1} of {mockCards.length} • {cardsReviewed} reviewed
            </p>
          </div>
          <Button variant="outline" onClick={finishSession}>
            End Session
          </Button>
        </div>

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto">
          <div
            onClick={handleFlip}
            className="relative h-96 cursor-pointer perspective-1000"
            style={{ perspective: '1000px' }}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                flipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-teal to-teal-mid text-white">
                  <div className="text-center">
                    <div className="text-sm font-semibold mb-4 opacity-80">QUESTION</div>
                    <p className="text-2xl font-syne font-bold leading-relaxed">
                      {currentCard.front}
                    </p>
                    <div className="mt-8 text-sm opacity-60">Click to reveal answer</div>
                  </div>
                </Card>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-amber to-amber-dark text-white">
                  <div className="text-center">
                    <div className="text-sm font-semibold mb-4 opacity-80">ANSWER</div>
                    <p className="text-2xl font-syne font-bold leading-relaxed mb-4">
                      {currentCard.back}
                    </p>
                    {currentCard.highlight && (
                      <div className="mt-6 p-4 bg-white/20 rounded-lg">
                        <p className="text-lg font-semibold">{currentCard.highlight}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Rating Buttons */}
          {flipped && (
            <div className="grid grid-cols-4 gap-3 mt-6">
              <Button
                variant="danger"
                onClick={() => handleRating('again')}
                className="flex flex-col items-center py-4"
              >
                <span className="text-2xl mb-1">😰</span>
                <span className="text-xs">Again</span>
                <span className="text-xs opacity-60">&lt;1 min</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRating('hard')}
                className="flex flex-col items-center py-4"
              >
                <span className="text-2xl mb-1">😕</span>
                <span className="text-xs">Hard</span>
                <span className="text-xs opacity-60">1 day</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRating('good')}
                className="flex flex-col items-center py-4"
              >
                <span className="text-2xl mb-1">😊</span>
                <span className="text-xs">Good</span>
                <span className="text-xs opacity-60">3 days</span>
              </Button>
              <Button
                onClick={() => handleRating('easy')}
                className="flex flex-col items-center py-4"
              >
                <span className="text-2xl mb-1">😎</span>
                <span className="text-xs">Easy</span>
                <span className="text-xs opacity-60">7 days</span>
              </Button>
            </div>
          )}

          {!flipped && (
            <div className="text-center mt-6">
              <p className="text-mid text-sm">
                Think about the answer, then click the card to reveal
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Deck selection view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne text-2xl font-bold text-dark dark:text-white mb-2">
          Flashcards
        </h2>
        <p className="text-mid">
          Spaced repetition system to help you remember key concepts
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-teal-xlight border-teal-light">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-syne font-bold text-dark mb-2">How Flashcards Work</h3>
            <p className="text-sm text-dark">
              Rate each card based on how well you know it. Cards you find difficult will
              appear more frequently, while easy cards appear less often. This spaced
              repetition helps you learn efficiently.
            </p>
          </div>
        </div>
      </Card>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => setSelectedDeck(deck.id)}
            className={`text-left transition-all ${
              selectedDeck === deck.id ? 'scale-105' : ''
            }`}
          >
            <Card
              hover
              className={`${
                selectedDeck === deck.id
                  ? 'border-teal bg-teal-xlight'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="teal" size="sm">
                  {deck.cadre}
                </Badge>
                {deck.dueCount > 0 && (
                  <Badge variant="amber" size="sm">
                    {deck.dueCount} due
                  </Badge>
                )}
              </div>
              <h3 className="font-syne text-lg font-bold text-dark dark:text-white mb-2">
                {deck.name}
              </h3>
              <p className="text-sm text-mid mb-3">{deck.unit}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-mid">{deck.cardCount} cards</span>
                {selectedDeck === deck.id && (
                  <span className="text-teal font-semibold">Selected ✓</span>
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Start Button */}
      {selectedDeck && (
        <div className="flex justify-center">
          <Button onClick={startStudying} size="lg">
            Start Studying →
          </Button>
        </div>
      )}
    </div>
  );
}
