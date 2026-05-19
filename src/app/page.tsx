"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCadre, setActiveCadre] = useState(0);
  const [timerSec, setTimerSec] = useState(6202);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedExamOption, setSelectedExamOption] = useState<number>(1);

  useEffect(() => {
    // Exam timer demo
    const interval = setInterval(() => {
      setTimerSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Countdown to Aug 2026
    const target = new Date('2026-08-15T08:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) return;
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format exam timer
  const h = Math.floor(timerSec / 3600);
  const m = Math.floor((timerSec % 3600) / 60);
  const s = timerSec % 60;
  const formattedTimer = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        🎓 Next NCK Exam: <span>August 2026</span> — Registration closes July 15 &nbsp;|&nbsp; Use code <span>FIRSTTRY</span> for 20% off your first plan
      </div>

      {/* NAV */}
      <nav>
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              <div className="logo-mark">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="logo-text">Nurse<span>Fiti</span></span>
            </Link>
            <ul className="nav-links">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#cadre">Your Cadre</Link></li>
              <li><Link href="#mockexam">Mock Exam</Link></li>
              <li><Link href="#experts">Expert Tutors</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="#faq">FAQ</Link></li>
            </ul>
            <div className="nav-cta">
              <Link href="/register" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--teal)', textDecoration: 'none' }}>Log in</Link>
              <Link href="/register" className="btn btn-dark" style={{ padding: '10px 20px', fontSize: '13px' }}>Start Free Trial</Link>
            </div>
            <button className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link href="#cadre" onClick={() => setMobileMenuOpen(false)}>Your Cadre</Link>
          <Link href="#mockexam" onClick={() => setMobileMenuOpen(false)}>Mock Exam</Link>
          <Link href="#experts" onClick={() => setMobileMenuOpen(false)}>Expert Tutors</Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
          <Link href="/register" style={{ color: 'var(--teal)' }} onClick={() => setMobileMenuOpen(false)}>Start Free Trial →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" aria-label="Hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot"></span>
                <span>Kenya&apos;s Smartest NCK Revision Platform</span>
              </div>
              <h1>Pass Your NCK Exam.<br/><em>First Try.</em></h1>
              <p className="hero-sub">DigiProctor-identical mock exams, 5,000+ answered MCQs, and an AI study plan built around your exam date — for KRCHN and BScN nurses.</p>
              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary">Start for Free →</Link>
                <Link href="#mockexam" className="btn btn-outline">See Mock Exam</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><strong>12,000+</strong><span>Nurses trained</span></div>
                <div className="hero-stat"><strong>96%</strong><span>First-attempt pass rate</span></div>
                <div className="hero-stat"><strong>5,000+</strong><span>Answered MCQs</span></div>
              </div>
            </div>

            <div>
              <div className="cadre-card">
                <p className="cadre-title">Select Your Cadre to Begin</p>
                <div className="cadre-options">
                  <button className={`cadre-btn ${activeCadre === 0 ? 'active' : ''}`} onClick={() => setActiveCadre(0)}>
                    <span>🏥 KRCHN — Diploma</span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 3 11 8 6 13"/></svg>
                  </button>
                  <button className={`cadre-btn ${activeCadre === 1 ? 'active' : ''}`} onClick={() => setActiveCadre(1)}>
                    <span>🎓 BScN — Degree</span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 3 11 8 6 13"/></svg>
                  </button>
                </div>
                <div className="cadre-divider"></div>
                <div className="countdown-wrapper">
                  <p className="countdown-label">⏳ Time to August 2026 Exam</p>
                  <div className="countdown">
                    <div className="countdown-unit"><span className="countdown-num">{String(countdown.d).padStart(2, '0')}</span><span className="countdown-sub">Days</span></div>
                    <div className="countdown-unit"><span className="countdown-num">{String(countdown.h).padStart(2, '0')}</span><span className="countdown-sub">Hrs</span></div>
                    <div className="countdown-unit"><span className="countdown-num">{String(countdown.m).padStart(2, '0')}</span><span className="countdown-sub">Min</span></div>
                    <div className="countdown-unit"><span className="countdown-num">{String(countdown.s).padStart(2, '0')}</span><span className="countdown-sub">Sec</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <div className="proof-strip">
        <div className="container">
          <div className="proof-inner">
            <div className="proof-item">
              <div className="proof-icon">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div><div className="proof-num">12,000+</div><div className="proof-txt">Nurses trained</div></div>
            </div>
            <div className="proof-item">
              <div className="proof-icon">
                <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              </div>
              <div><div className="proof-num">96%</div><div className="proof-txt">First-attempt pass rate</div></div>
            </div>
            <div className="proof-item">
              <div className="proof-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div><div className="proof-num">3×/year</div><div className="proof-txt">Exam cycles covered</div></div>
            </div>
            <div className="proof-item">
              <div className="proof-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div><div className="proof-num">4.9/5</div><div className="proof-txt">Average student rating</div></div>
            </div>
            <div className="proof-item">
              <div className="proof-icon">
                <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div><div className="proof-num">5,000+</div><div className="proof-txt">Answered MCQs</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="howitworks">
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">How It Works</span>
            <h2>Three steps to exam confidence</h2>
            <p>From your first login to your exam day — every step is personalised to your cadre and timeline.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card fade-in visible step-connector">
              <div className="step-num">1</div>
              <h3>Choose Your Cadre & Exam Date</h3>
              <p>Tell us whether you&apos;re sitting KRCHN or BScN. We build your personalised study countdown from day one.</p>
            </div>
            <div className="step-card fade-in visible step-connector">
              <div className="step-num">2</div>
              <h3>Practice with Smart, Answered MCQs</h3>
              <p>Work through 5,000+ exam-style questions with detailed rationales. Our AI engine adjusts difficulty as you improve — harder when you&apos;re strong, easier when you need it.</p>
            </div>
            <div className="step-card fade-in visible">
              <div className="step-num">3</div>
              <h3>Take a Full DigiProctor Mock Exam</h3>
              <p>Sit a full-length timed mock exam in the exact DigiProctor interface. Know what exam day feels like before it happens. No surprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features-bg" id="features">
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">Platform Features</span>
            <h2>Everything you need. Nothing you don&apos;t.</h2>
            <p>Built specifically for the NCK exam — not adapted from a generic quiz platform.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in visible">
              <div className="feature-icon fi-teal">
                <svg viewBox="0 0 24 24" stroke="currentColor"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              </div>
              <div>
                <h3>DigiProctor Mock Exams</h3>
                <p>Pixel-perfect replica of the actual NCK online exam interface. Timed, full-length, with the same rules and format. Sit it before exam day so nothing surprises you.</p>
                <span className="feature-tag">Most popular feature</span>
              </div>
            </div>

            <div className="feature-card fade-in visible">
              <div className="feature-icon fi-amber">
                <svg viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              </div>
              <div>
                <h3>AI Adaptive Learning Engine</h3>
                <p>Our system tracks your performance per unit and per topic. Questions get harder where you&apos;re strong and easier where you need it — so your study time is never wasted.</p>
                <span className="feature-tag">Only platform with this</span>
              </div>
            </div>

            <div className="feature-card fade-in visible">
              <div className="feature-icon fi-green">
                <svg viewBox="0 0 24 24" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div>
                <h3>Deep Analytics Dashboard</h3>
                <p>See your score per unit, per paper, and compared to your peers. Know exactly where you&apos;re exam-ready and where you need more work — updated after every session.</p>
              </div>
            </div>

            <div className="feature-card fade-in visible">
              <div className="feature-icon fi-teal">
                <svg viewBox="0 0 24 24" stroke="currentColor"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div>
                <h3>Offline Mode</h3>
                <p>Download revision notes and question sets to study without internet. Perfect for nurses in low-connectivity areas or studying during commutes on mobile data.</p>
              </div>
            </div>

            <div className="feature-card fade-in visible">
              <div className="feature-icon fi-amber">
                <svg viewBox="0 0 24 24" stroke="currentColor"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <div>
                <h3>WhatsApp Integration</h3>
                <p>Get daily study reminders, MCQ bites, and exam day alerts straight to your WhatsApp. Join peer study groups. Support is one message away — no login required.</p>
              </div>
            </div>

            <div className="feature-card fade-in visible">
              <div className="feature-icon fi-red">
                <svg viewBox="0 0 24 24" stroke="currentColor"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.2 2 2 0 012 .02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <h3>Spaced Repetition & Streak Tracking</h3>
                <p>Questions you get wrong resurface at the optimal moment for memory consolidation. Daily streaks keep you consistent right up to exam day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOCK EXAM PREVIEW */}
      <section className="mockexam-section" id="mockexam">
        <div className="container">
          <div className="mockexam-grid">
            <div className="mockexam-copy">
              <span className="section-label">Mock Exam</span>
              <h2>The only platform that truly replicates DigiProctor</h2>
              <p>Exam anxiety is real — and the biggest cause is not knowing what the exam interface looks like. NurseFiti gives you the exact experience before the real thing.</p>
              <div className="mockexam-features">
                <div className="mf-row">
                  <div className="mf-dot"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
                  <span>Full 100-question papers, exactly 2 hours, same rules</span>
                </div>
                <div className="mf-row">
                  <div className="mf-dot"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
                  <span>Real-time countdown timer — trains your pacing</span>
                </div>
                <div className="mf-row">
                  <div className="mf-dot"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
                  <span>Instant detailed rationale for every answer after submission</span>
                </div>
                <div className="mf-row">
                  <div className="mf-dot"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
                  <span>Flagging and review tool — just like the real exam</span>
                </div>
                <div className="mf-row">
                  <div className="mf-dot"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
                  <span>Separate Paper 1 and Paper 2 mocks for KRCHN and BScN</span>
                </div>
              </div>
              <Link href="#pricing" className="btn btn-primary">Try a Free Mock Exam →</Link>
            </div>

            {/* Fake exam UI */}
            <div className="exam-ui">
              <div className="exam-header">
                <span className="exam-header-logo">NCK DigiProctor — KRCHN Paper 1</span>
                <span className="exam-timer">{formattedTimer}</span>
              </div>
              <div className="exam-progress-bar"><div className="exam-progress-fill"></div></div>
              <div className="exam-body">
                <div className="exam-meta">Question 42 of 100 &nbsp;·&nbsp; Medical–Surgical Nursing</div>
                <div className="exam-question">A patient presents with sudden onset severe headache described as &quot;the worst headache of my life,&quot; neck stiffness, and photophobia. The nurse&apos;s priority action should be to:</div>
                <div className="exam-options">
                  <div className={`exam-option ${selectedExamOption === 0 ? 'selected' : ''}`} onClick={() => setSelectedExamOption(0)}><div className="exam-option-key">A</div><span>Administer prescribed analgesia and reassess in 30 minutes</span></div>
                  <div className={`exam-option ${selectedExamOption === 1 ? 'selected' : ''}`} onClick={() => setSelectedExamOption(1)}><div className="exam-option-key">B</div><span>Notify the physician immediately and prepare for lumbar puncture</span></div>
                  <div className={`exam-option ${selectedExamOption === 2 ? 'selected' : ''}`} onClick={() => setSelectedExamOption(2)}><div className="exam-option-key">C</div><span>Place the patient in a dark, quiet room and dim the lights</span></div>
                  <div className={`exam-option ${selectedExamOption === 3 ? 'selected' : ''}`} onClick={() => setSelectedExamOption(3)}><div className="exam-option-key">D</div><span>Assess the patient&apos;s vital signs and document findings</span></div>
                </div>
              </div>
              <div className="exam-footer">
                <span className="exam-q-counter">58 remaining · 3 flagged</span>
                <button className="exam-next">Next Question →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CADRE TRACKS */}
      <section className="section cadre-section" id="cadre">
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">Your Cadre Track</span>
            <h2>Built for your specific exam — not a generic course</h2>
            <p>KRCHN and BScN nurses sit completely different exams. We have dedicated content for each.</p>
          </div>
          <div className="cadre-tracks">
            <div className="cadre-track krchn fade-in visible">
              <div className="cadre-track-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3>KRCHN Diploma</h3>
              <div className="cadre-sub">Kenya Registered Community Health Nurse</div>
              <ul>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>2,500+ KRCHN-specific MCQs</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Paper 1 & Paper 2 full mocks</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Community Health, Med-Surg, Maternal & Child</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Past papers 2015–2026</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Summarised revision notes per unit</li>
              </ul>
              <Link href="#pricing" className="cadre-link">Start KRCHN track →</Link>
            </div>

            <div className="cadre-track bscn fade-in visible" style={{ position: 'relative' }}>
              <span className="popular-badge">Most Popular</span>
              <div className="cadre-track-icon">
                <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <h3>BScN Degree</h3>
              <div className="cadre-sub">Bachelor of Science in Nursing</div>
              <ul>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>2,500+ BScN degree-level MCQs</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Paper 1 & Paper 2 full mocks</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Research, Management, Advanced Clinical</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Past papers 2015–2026</li>
                <li><svg viewBox="0 0 16 16"><polyline points="3 8 6 11 13 5"/></svg>Distinct from KRCHN — harder rationales</li>
              </ul>
              <Link href="#pricing" className="cadre-link">Start BScN track →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section className="section analytics-section">
        <div className="container">
          <div className="analytics-grid">
            <div className="fade-in visible">
              <span className="section-label">Smart Analytics</span>
              <h2>Know exactly where you stand before exam day</h2>
              <p style={{ color: 'var(--mid)', fontSize: '15px', marginBottom: '20px' }}>After every practice session, your dashboard updates with a precise breakdown of your performance by unit, topic, and paper — so you never study blindly.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--mid)' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><polyline points="3 9 7 13 15 5"/></svg>
                  Unit-by-unit mastery score updated after every session
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--mid)' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><polyline points="3 9 7 13 15 5"/></svg>
                  Exam-readiness score with a projected pass/fail indicator
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--mid)' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><polyline points="3 9 7 13 15 5"/></svg>
                  Peer percentile comparison — see how you rank vs. other candidates
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--mid)' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><polyline points="3 9 7 13 15 5"/></svg>
                  AI automatically prioritises your weakest units in next session
                </li>
              </ul>
              <Link href="#pricing" className="btn btn-dark">See Your Dashboard →</Link>
            </div>

            <div className="analytics-ui fade-in visible">
              <div className="analytics-header">
                <span className="analytics-title">My Performance — KRCHN Paper 1</span>
                <span className="analytics-date">August Exam Cycle</span>
              </div>
              <div className="score-ring-row">
                <div className="score-ring">
                  <svg viewBox="0 0 88 88">
                    <circle className="score-ring-bg" cx="44" cy="44" r="36"/>
                    <circle className="score-ring-fill" cx="44" cy="44" r="36"/>
                  </svg>
                  <div className="score-ring-text">75%</div>
                </div>
                <div className="score-details">
                  <strong>75% Avg Score</strong>
                  <p style={{ fontSize: '13px', color: 'var(--mid)', marginTop: '4px' }}>Across 842 questions answered</p>
                  <span className="exam-ready">✓ Exam Ready</span>
                </div>
              </div>
              <div className="unit-bars">
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Unit Breakdown</div>
                <div className="unit-bar-row">
                  <span className="unit-bar-label">Medical–Surgical Nursing</span>
                  <div className="unit-bar-track"><div className="unit-bar-fill" style={{ width: '82%', background: 'var(--green)' }}></div></div>
                  <span className="unit-bar-pct">82%</span>
                </div>
                <div className="unit-bar-row">
                  <span className="unit-bar-label">Community Health</span>
                  <div className="unit-bar-track"><div className="unit-bar-fill" style={{ width: '77%', background: 'var(--teal)' }}></div></div>
                  <span className="unit-bar-pct">77%</span>
                </div>
                <div className="unit-bar-row">
                  <span className="unit-bar-label">Maternal & Child Health</span>
                  <div className="unit-bar-track"><div className="unit-bar-fill" style={{ width: '71%', background: 'var(--amber)' }}></div></div>
                  <span className="unit-bar-pct">71%</span>
                </div>
                <div className="unit-bar-row">
                  <span className="unit-bar-label">Pharmacology</span>
                  <div className="unit-bar-track"><div className="unit-bar-fill" style={{ width: '58%', background: '#E84545' }}></div></div>
                  <span className="unit-bar-pct" style={{ color: '#E84545' }}>58%</span>
                </div>
                <div className="unit-bar-row">
                  <span className="unit-bar-label">Psychiatric Nursing</span>
                  <div className="unit-bar-track"><div className="unit-bar-fill" style={{ width: '68%', background: 'var(--amber)' }}></div></div>
                  <span className="unit-bar-pct">68%</span>
                </div>
                <div style={{ marginTop: '10px', padding: '10px', background: 'var(--amber-light)', borderRadius: 'var(--r-sm)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber-dark)' }}>⚡ AI Recommendation:</span>
                  <span style={{ fontSize: '12px', color: 'var(--dark)' }}> Focus next session on Pharmacology — 22 weak questions queued.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERT TUTORS */}
      <section className="section" id="experts" style={{ background: 'var(--cream-warm)' }}>
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">Expert Tutors</span>
            <h2>Get 1-on-1 help when you need it</h2>
            <p>Stuck on a difficult topic? Connect directly with our vetted registered nurse educators and past examiners for personalized tutoring sessions.</p>
          </div>
          <div className="testi-grid">
            <div className="testi-card fade-in visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="testi-avatar" style={{ width: '80px', height: '80px', fontSize: '24px', background: 'var(--teal-light)', color: 'var(--teal)', marginBottom: '16px' }}>SA</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '4px' }}>Sr. Sarah Akinyi</h3>
              <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '16px', lineHeight: 1.6 }}>Critical Care Specialist & NCK Examiner. Specializes in Med-Surg and Pharmacology.</p>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--amber)', fontSize: '14px', marginBottom: '20px' }}>
                ★ 4.9 <span style={{ color: 'var(--mid)', marginLeft: '4px', fontSize: '12px' }}>(120 reviews)</span>
              </div>
              <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', width: '100%', justifyContent: 'center', borderColor: 'var(--teal)', color: 'var(--teal)', padding: '12px', textDecoration: 'none' }}>Book Session</Link>
            </div>
            
            <div className="testi-card fade-in visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="testi-avatar" style={{ width: '80px', height: '80px', fontSize: '24px', background: '#DFFBF1', color: '#0F6E56', marginBottom: '16px' }}>DK</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '4px' }}>Dr. David Kiprop</h3>
              <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '16px', lineHeight: 1.6 }}>Public Health Expert. Focuses on Community Health Nursing and Research.</p>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--amber)', fontSize: '14px', marginBottom: '20px' }}>
                ★ 4.8 <span style={{ color: 'var(--mid)', marginLeft: '4px', fontSize: '12px' }}>(85 reviews)</span>
              </div>
              <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', width: '100%', justifyContent: 'center', borderColor: 'var(--teal)', color: 'var(--teal)', padding: '12px', textDecoration: 'none' }}>Book Session</Link>
            </div>
            
            <div className="testi-card fade-in visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="testi-avatar" style={{ width: '80px', height: '80px', fontSize: '24px', background: 'var(--amber-light)', color: 'var(--amber-dark)', marginBottom: '16px' }}>RM</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '4px' }}>RN Rose Mutisya</h3>
              <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '16px', lineHeight: 1.6 }}>Midwifery Educator. Guides students through Maternal & Child Health and Obstetrics.</p>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--amber)', fontSize: '14px', marginBottom: '20px' }}>
                ★ 5.0 <span style={{ color: 'var(--mid)', marginLeft: '4px', fontSize: '12px' }}>(200+ reviews)</span>
              </div>
              <Link href="/dashboard" className="btn btn-outline" style={{ display: 'flex', width: '100%', justifyContent: 'center', borderColor: 'var(--teal)', color: 'var(--teal)', padding: '12px', textDecoration: 'none' }}>Book Session</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">Pricing</span>
            <h2>Pay once. Study until you pass.</h2>
            <p>Affordable plans for every budget — all payable via M-Pesa. No credit card ever needed.</p>
            <div style={{ marginTop: '20px' }}>
              <span className="mpesa-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Pay via M-Pesa — instant access after payment
              </span>
            </div>
          </div>

          <div className="plans-grid">
            {/* BASIC */}
            <div className="plan-card fade-in visible">
              <div className="plan-head">
                <div className="plan-head-top"><span className="plan-name">Starter</span></div>
                <div className="plan-price"><strong>KSh 500</strong></div>
                <div className="plan-duration">30-day access · One cadre track</div>
                <button className="plan-cta plan-cta-outline">Try Starter Plan</button>
              </div>
              <div className="plan-features">
                <ul>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>1,000 answered MCQs</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>2 full mock exams</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Basic analytics dashboard</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Revision notes (selected units)</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>M-Pesa payment</li>
                  <li><svg viewBox="0 0 16 16" className="check-no"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg><span style={{ color: 'var(--light)' }}>Offline downloads</span></li>
                  <li><svg viewBox="0 0 16 16" className="check-no"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg><span style={{ color: 'var(--light)' }}>WhatsApp peer group</span></li>
                  <li><svg viewBox="0 0 16 16" className="check-no"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg><span style={{ color: 'var(--light)' }}>AI adaptive engine</span></li>
                </ul>
              </div>
            </div>

            {/* PRO */}
            <div className="plan-card featured fade-in visible">
              <div className="plan-head featured-bg">
                <div className="plan-head-top">
                  <span className="plan-name">Pro</span>
                  <span className="plan-featured-tag">MOST POPULAR</span>
                </div>
                <div className="plan-price"><strong>KSh 2,500</strong></div>
                <div className="plan-duration">60-day access · Full cadre track</div>
                <button className="plan-cta plan-cta-solid">Start Pro Plan</button>
              </div>
              <div className="plan-features">
                <ul>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>3,500 answered MCQs</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>6 full DigiProctor mock exams</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Full analytics + peer percentile</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>All revision notes + cheat sheets</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Offline downloads</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>WhatsApp peer study group</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>AI adaptive learning engine</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Streak tracking + reminders</li>
                </ul>
              </div>
            </div>

            {/* ELITE */}
            <div className="plan-card fade-in visible">
              <div className="plan-head">
                <div className="plan-head-top"><span className="plan-name">Elite</span></div>
                <div className="plan-price"><strong>KSh 4,500</strong></div>
                <div className="plan-duration">90-day access · All cadres</div>
                <button className="plan-cta plan-cta-outline">Get Elite Plan</button>
              </div>
              <div className="plan-features">
                <ul>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>5,000+ MCQs — full question bank</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>10 full mock exams</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Everything in Pro</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Resitter Drill Mode (weak Q focus)</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Priority WhatsApp support</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Completion certificate</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Referral discount code</li>
                  <li><svg viewBox="0 0 16 16" className="check-yes"><polyline points="3 8 6 11 13 5"/></svg>Access to all cadre tracks</li>
                </ul>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: 'var(--mid)' }}>
            All plans include a <strong style={{ color: 'var(--dark)' }}>3-day free trial</strong> with 50 free MCQs. No payment required to start. 🎁
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testi-section">
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">Student Stories</span>
            <h2>Nurses who passed with NurseFiti</h2>
          </div>
          <div className="testi-grid">
            <div className="testi-card fade-in visible">
              <div className="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
              <p className="testi-text">&quot;The DigiProctor mock exam changed everything for me. I sat my actual exam and it felt familiar. I wasn&apos;t anxious — I had done this before. Passed Paper 1 and Paper 2 first attempt.&quot;</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>MW</div>
                <div><div className="testi-name">Mercy W.</div><div className="testi-meta">KRCHN — Nairobi, 2026</div></div>
              </div>
            </div>
            <div className="testi-card fade-in visible">
              <div className="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
              <p className="testi-text">&quot;I had failed once before and was really nervous. The AI kept pushing me to drill Pharmacology which was my weakest unit. I went from 52% to 78% in three weeks. Passed comfortably.&quot;</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: 'var(--amber-light)', color: 'var(--amber-dark)' }}>JK</div>
                <div><div className="testi-name">James K.</div><div className="testi-meta">BScN Resitter — Mombasa, 2026</div></div>
              </div>
            </div>
            <div className="testi-card fade-in visible">
              <div className="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
              <p className="testi-text">&quot;The BScN content is genuinely different and harder — not just KRCHN questions relabelled. The rationales are thorough and evidence-based. Best KSh 2,500 I have ever spent.&quot;</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: '#DFFBF1', color: '#0F6E56' }}>PN</div>
                <div><div className="testi-name">Patricia N.</div><div className="testi-meta">BScN — Eldoret, 2024</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" id="faq">
        <div className="container">
          <div className="section-header fade-in visible">
            <span className="section-label">FAQ</span>
            <h2>Common questions</h2>
          </div>
          <div className="faq-grid">
            <div className={`faq-item fade-in visible ${openFaq === 0 ? 'open' : ''}`} onClick={() => toggleFaq(0)}>
              <div className="faq-q">How do I pay using M-Pesa?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="faq-a">After selecting your plan, enter your M-Pesa number. You receive an STK push to your phone. Enter your M-Pesa PIN and access is activated within seconds — no waiting, no manual approval.</div>
            </div>
            <div className={`faq-item fade-in visible ${openFaq === 1 ? 'open' : ''}`} onClick={() => toggleFaq(1)}>
              <div className="faq-q">Is KRCHN content different from BScN?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="faq-a">Completely. KRCHN and BScN questions are written separately, tested at different levels of difficulty, and reflect the actual difference in their exam syllabuses. You are only shown questions relevant to your cadre.</div>
            </div>
            <div className={`faq-item fade-in visible ${openFaq === 2 ? 'open' : ''}`} onClick={() => toggleFaq(2)}>
              <div className="faq-q">Can I access content without internet?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="faq-a">Yes. The Pro and Elite plans include downloadable PDF revision notes and cheat sheets for offline study. For the practice questions and mock exams, a basic internet connection is required.</div>
            </div>
            <div className={`faq-item fade-in visible ${openFaq === 3 ? 'open' : ''}`} onClick={() => toggleFaq(3)}>
              <div className="faq-q">What if I fail the exam during my subscription?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="faq-a">Contact us on WhatsApp within 7 days of your results. Elite plan members receive a free 30-day extension. Pro and Starter members receive a 50% discount on renewal for the next sitting.</div>
            </div>
            <div className={`faq-item fade-in visible ${openFaq === 4 ? 'open' : ''}`} onClick={() => toggleFaq(4)}>
              <div className="faq-q">Are the questions from actual past papers?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="faq-a">Our question bank includes NCK past paper questions from 2015 to 2026, plus 2,000+ original questions written by registered nurse educators to match the current NCK syllabus and exam style.</div>
            </div>
            <div className={`faq-item fade-in visible ${openFaq === 5 ? 'open' : ''}`} onClick={() => toggleFaq(5)}>
              <div className="faq-q">Is there a mobile app?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="faq-a">Our Android app is coming in Q3 2026. In the meantime, the website is fully mobile-optimised — add it to your home screen from Chrome for an app-like experience. iOS app is planned for Q4.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="container">
          <span className="badge badge-amber" style={{ marginBottom: '20px' }}>🎁 3-Day Free Trial — No Card Needed</span>
          <h2>Your exam date is set.<br/>Is your revision?</h2>
          <p>Join 12,000+ Kenyan nurses who chose the smartest way to prepare. Start free today — no credit card, no delays.</p>
          <div className="cta-actions">
            <Link href="#pricing" className="btn btn-primary" style={{ fontSize: '15px', padding: '16px 32px' }}>Start Free Trial →</Link>
            <a href="https://wa.me/254700000000" className="whatsapp-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo" style={{ marginBottom: 0 }}>
                <div className="logo-mark">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span className="logo-text" style={{ color: 'var(--white)' }}>Nurse<span style={{ color: 'var(--amber)' }}>Fiti</span></span>
              </div>
              <p>Kenya&apos;s intelligent NCK exam preparation platform. Built for KRCHN and BScN nurses — by nurses who&apos;ve been there.</p>
              <span className="footer-mpesa">✓ M-Pesa Accepted</span>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><Link href="#">KRCHN Track</Link></li>
                <li><Link href="#">BScN Track</Link></li>
                <li><Link href="#">Mock Exams</Link></li>
                <li><Link href="#">Analytics</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><Link href="#">NCK Exam Guide 2026</Link></li>
                <li><Link href="#">NCK Syllabus</Link></li>
                <li><Link href="#">How to Register for NCK</Link></li>
                <li><Link href="#">Past Papers (Free)</Link></li>
                <li><Link href="#">Blog</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link href="#">About Us</Link></li>
                <li><Link href="#">Pricing</Link></li>
                <li><Link href="#">For Institutions</Link></li>
                <li><Link href="#">Affiliate Programme</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 NurseFiti Kenya. All rights reserved. Not affiliated with the Nursing Council of Kenya.</p>
            <div className="social-links">
              <Link href="#" className="social-link" aria-label="Facebook">f</Link>
              <Link href="#" className="social-link" aria-label="Twitter">𝕏</Link>
              <Link href="#" className="social-link" aria-label="Instagram">ig</Link>
              <Link href="#" className="social-link" aria-label="YouTube">▶</Link>
              <Link href="#" className="social-link" aria-label="WhatsApp">w</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
