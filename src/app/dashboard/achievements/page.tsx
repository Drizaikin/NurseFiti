"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}

export default function AchievementsPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    xp_points: 0,
    questions_answered: 0,
    streak_days: 0
  });
  const [level, setLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setStats({
            xp_points: profile.xp_points || 0,
            questions_answered: profile.questions_answered || 0,
            streak_days: profile.streak_days || 0
          });
          
          // Calculate level (100 XP per level)
          const calculatedLevel = Math.floor((profile.xp_points || 0) / 100) + 1;
          setLevel(calculatedLevel);
          setXpToNextLevel(calculatedLevel * 100);
        }
      }
    };
    fetchStats();
  }, [supabase]);

  const achievements: Achievement[] = [
    {
      id: 'first_question',
      title: 'First Steps',
      description: 'Answer your first practice question',
      icon: '🎯',
      unlocked: stats.questions_answered >= 1,
      progress: Math.min(stats.questions_answered, 1),
      maxProgress: 1,
      xpReward: 10
    },
    {
      id: 'century',
      title: 'Century Club',
      description: 'Answer 100 practice questions',
      icon: '💯',
      unlocked: stats.questions_answered >= 100,
      progress: Math.min(stats.questions_answered, 100),
      maxProgress: 100,
      xpReward: 50
    },
    {
      id: 'thousand',
      title: 'Thousand Strong',
      description: 'Answer 1,000 practice questions',
      icon: '🏆',
      unlocked: stats.questions_answered >= 1000,
      progress: Math.min(stats.questions_answered, 1000),
      maxProgress: 1000,
      xpReward: 200
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day study streak',
      icon: '🔥',
      unlocked: stats.streak_days >= 7,
      progress: Math.min(stats.streak_days, 7),
      maxProgress: 7,
      xpReward: 75
    },
    {
      id: 'month_streak',
      title: 'Monthly Master',
      description: 'Maintain a 30-day study streak',
      icon: '⚡',
      unlocked: stats.streak_days >= 30,
      progress: Math.min(stats.streak_days, 30),
      maxProgress: 30,
      xpReward: 300
    },
    {
      id: 'level_5',
      title: 'Rising Star',
      description: 'Reach Level 5',
      icon: '⭐',
      unlocked: level >= 5,
      progress: Math.min(level, 5),
      maxProgress: 5,
      xpReward: 100
    },
    {
      id: 'level_10',
      title: 'Expert Learner',
      description: 'Reach Level 10',
      icon: '🌟',
      unlocked: level >= 10,
      progress: Math.min(level, 10),
      maxProgress: 10,
      xpReward: 250
    },
    {
      id: 'perfect_score',
      title: 'Perfect Practice',
      description: 'Score 100% on a practice session',
      icon: '💎',
      unlocked: false,
      xpReward: 150
    },
    {
      id: 'mock_exam',
      title: 'Mock Exam Taker',
      description: 'Complete your first mock exam',
      icon: '📝',
      unlocked: false,
      xpReward: 100
    },
    {
      id: 'flashcard_master',
      title: 'Flashcard Master',
      description: 'Master 50 flashcards',
      icon: '🗂️',
      unlocked: false,
      xpReward: 80
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Study before 7 AM',
      icon: '🌅',
      unlocked: false,
      xpReward: 50
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Study after 10 PM',
      icon: '🦉',
      unlocked: false,
      xpReward: 50
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXpEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);
  const xpProgress = ((stats.xp_points % 100) / 100) * 100;

  return (
    <div className="view active">
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 className="card-title" style={{ marginBottom: '8px' }}>🏆 Achievements</h2>
        <p style={{ color: 'var(--mid)', fontSize: '14px' }}>
          {unlockedCount} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* Level & XP Card */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-mid) 100%)', color: 'var(--white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Current Level</div>
            <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>Level {level}</div>
            <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
              {stats.xp_points} / {xpToNextLevel} XP
            </div>
          </div>
          
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <div style={{ fontSize: '13px', marginBottom: '8px', opacity: 0.9 }}>
              Progress to Level {level + 1}
            </div>
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'var(--amber)',
                width: `${xpProgress}%`,
                borderRadius: 'var(--r-full)',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
            <div style={{ fontSize: '12px', marginTop: '6px', opacity: 0.8 }}>
              {100 - (stats.xp_points % 100)} XP to next level
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--teal)' }}>{stats.questions_answered}</div>
          <div style={{ fontSize: '13px', color: 'var(--mid)' }}>Questions Answered</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔥</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--amber)' }}>{stats.streak_days}</div>
          <div style={{ fontSize: '13px', color: 'var(--mid)' }}>Day Streak</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green)' }}>{totalXpEarned}</div>
          <div style={{ fontSize: '13px', color: 'var(--mid)' }}>XP from Achievements</div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className="card"
            style={{
              opacity: achievement.unlocked ? 1 : 0.6,
              border: achievement.unlocked ? '2px solid var(--teal)' : '1px solid var(--border)',
              background: achievement.unlocked ? 'var(--teal-light)' : 'var(--white)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {achievement.unlocked && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--green)',
                color: 'var(--white)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: 'var(--r-full)',
                textTransform: 'uppercase',
                letterSpacing: '.05em'
              }}>
                Unlocked
              </div>
            )}
            
            <div style={{ fontSize: '48px', marginBottom: '12px', filter: achievement.unlocked ? 'none' : 'grayscale(100%)' }}>
              {achievement.icon}
            </div>
            
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
              {achievement.title}
            </h3>
            
            <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '12px', lineHeight: 1.5 }}>
              {achievement.description}
            </p>
            
            {achievement.maxProgress && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--mid)', marginBottom: '6px' }}>
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: achievement.unlocked ? 'var(--green)' : 'var(--amber)',
                    width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`,
                    borderRadius: 'var(--r-full)',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            )}
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: achievement.unlocked ? 'var(--green)' : 'var(--amber-light)',
              color: achievement.unlocked ? 'var(--white)' : 'var(--amber-dark)',
              borderRadius: 'var(--r-full)',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <span>⭐</span>
              <span>+{achievement.xpReward} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Card */}
      <div className="card" style={{ marginTop: '20px', background: 'var(--amber-light)', border: '1px solid var(--amber)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>🎯</div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
              Keep Going!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--dark)', lineHeight: 1.6 }}>
              You're making great progress! Complete more practice sessions and maintain your streak to unlock more achievements and earn XP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
