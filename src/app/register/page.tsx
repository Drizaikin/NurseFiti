"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function RegisterLogin() {
  const router = useRouter();
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'tutor' | null>(null);
  const [cadre, setCadre] = useState<'KRCHN' | 'BScN' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLogin) {
      // Login Flow
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      const userRole = data.user?.user_metadata?.role;
      if (userRole === 'tutor') {
        window.location.href = '/tutor_dashboard.html';
      } else {
        router.push('/dashboard');
      }
    } else {
      // Sign Up Flow
      if (!role) {
        setError("Please select a role (Student or Tutor).");
        setIsLoading(false);
        return;
      }
      if (role === 'student' && !cadre) {
        setError("Please select your cadre track.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            cadre: cadre
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        if (role === 'tutor') {
          window.location.href = '/tutor_dashboard.html';
        } else {
          router.push('/dashboard');
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-warm)' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', margin: '20px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-mark" style={{ margin: '0 auto 16px', width: '48px', height: '48px' }}>
            <svg viewBox="0 0 24 24" style={{ width: '28px', height: '28px', fill: 'none', stroke: 'var(--amber)', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dark)' }}>
            {isLogin ? 'Welcome back' : 'Join NurseFiti'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--mid)', marginTop: '8px' }}>
            {isLogin ? 'Enter your details to access your dashboard' : 'Create an account to start your preparation'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#FFE8E8', color: 'var(--red)', borderRadius: 'var(--r-sm)', fontSize: '13px', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--dark)' }}>FULL NAME</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', fontSize: '14px', outline: 'none' }} placeholder="Jane Doe" />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--dark)' }}>EMAIL ADDRESS</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', fontSize: '14px', outline: 'none' }} placeholder="you@example.com" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--dark)' }}>PASSWORD</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', fontSize: '14px', outline: 'none' }} placeholder="••••••••" />
          </div>

          {!isLogin && (
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--dark)', display: 'block', marginBottom: '8px' }}>I AM A...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" onClick={() => setRole('student')} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: role === 'student' ? '2px solid var(--teal)' : '1.5px solid var(--border)', background: role === 'student' ? 'var(--teal-light)' : 'transparent', color: role === 'student' ? 'var(--teal)' : 'var(--mid)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                  Student
                </button>
                <button type="button" onClick={() => { setRole('tutor'); setCadre(null); }} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: role === 'tutor' ? '2px solid var(--amber)' : '1.5px solid var(--border)', background: role === 'tutor' ? 'var(--amber-light)' : 'transparent', color: role === 'tutor' ? 'var(--amber-dark)' : 'var(--mid)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                  Expert Tutor
                </button>
              </div>
            </div>
          )}

          {!isLogin && role === 'student' && (
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--dark)', display: 'block', marginBottom: '8px' }}>MY EXAM TRACK IS...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" onClick={() => setCadre('KRCHN')} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: cadre === 'KRCHN' ? '2px solid var(--teal)' : '1.5px solid var(--border)', background: cadre === 'KRCHN' ? 'var(--teal-light)' : 'transparent', color: cadre === 'KRCHN' ? 'var(--teal)' : 'var(--mid)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                  KRCHN
                </button>
                <button type="button" onClick={() => setCadre('BScN')} style={{ padding: '12px', borderRadius: 'var(--r-sm)', border: cadre === 'BScN' ? '2px solid var(--teal)' : '1.5px solid var(--border)', background: cadre === 'BScN' ? 'var(--teal-light)' : 'transparent', color: cadre === 'BScN' ? 'var(--teal)' : 'var(--mid)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                  BScN
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{ marginTop: '16px', background: 'var(--teal)', color: '#fff', padding: '14px', borderRadius: 'var(--r-full)', fontSize: '15px', fontWeight: 800, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Please wait...' : isLogin ? 'Log In to Dashboard' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--mid)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--mid)', fontWeight: 700, textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
