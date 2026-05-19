'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { NurseFitiLogo } from '@/components/shared/NurseFitiLogo';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        toast.success('Welcome back!');

        // Redirect based on role
        if (profile.role === 'tutor') {
          router.push('/tutor/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
      toast.success('Check your email for the login link!');
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  // Check if redirected from tutor signup
  const isTutorLogin = searchParams.get('role') === 'tutor';

  return (
    <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <NurseFitiLogo size="lg" />
          </Link>
          <h1 className="font-syne text-2xl font-bold text-dark dark:text-white mt-4">
            {isTutorLogin ? 'Tutor Login' : 'Welcome Back'}
          </h1>
          <p className="text-mid text-sm mt-2">
            {isTutorLogin
              ? 'Access your tutor dashboard'
              : 'Continue your NCK exam preparation'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-white border border-border rounded-lg p-6 shadow">
          {magicLinkSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-syne text-lg font-bold text-dark mb-2">
                Check Your Email
              </h3>
              <p className="text-sm text-mid mb-6">
                We've sent a magic link to <strong>{formData.email}</strong>. Click the link to
                log in instantly.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setMagicLinkSent(false);
                  setFormData({ email: '', password: '' });
                }}
                fullWidth
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <>
              {/* Login Method Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                    loginMethod === 'password'
                      ? 'bg-teal text-white'
                      : 'bg-teal-xlight text-mid hover:bg-teal-light'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('magic')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                    loginMethod === 'magic'
                      ? 'bg-teal text-white'
                      : 'bg-teal-xlight text-mid hover:bg-teal-light'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {/* Password Login Form */}
              {loginMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-mid cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border text-teal focus:ring-teal"
                      />
                      Remember me
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-teal font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                </form>
              )}

              {/* Magic Link Form */}
              {loginMethod === 'magic' && (
                <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                    <p className="text-xs text-mid mt-2">
                      We'll send you a magic link to log in without a password
                    </p>
                  </div>

                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Sending...' : 'Send Magic Link'}
                  </Button>
                </form>
              )}
            </>
          )}

          {/* Signup Link */}
          {!magicLinkSent && (
            <div className="mt-6 text-center">
              <p className="text-sm text-mid">
                Don't have an account?{' '}
                <Link href="/signup" className="text-teal font-semibold hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Tutor Links */}
        {!isTutorLogin && !magicLinkSent && (
          <div className="mt-6 text-center">
            <p className="text-sm text-mid">
              Are you a tutor?{' '}
              <Link
                href="/login?role=tutor"
                className="text-amber-dark font-semibold hover:underline"
              >
                Tutor Login
              </Link>
              {' or '}
              <Link
                href="/signup/tutor"
                className="text-amber-dark font-semibold hover:underline"
              >
                Apply as Tutor
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
