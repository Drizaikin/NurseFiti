'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { NurseFitiLogo } from '@/components/shared/NurseFitiLogo';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Cadre = 'KRCHN' | 'BScN' | 'Higher Diploma';
type ExamCycle = 'May' | 'August' | 'November';

const higherDiplomaSpecialties = [
  'Critical Care',
  'Oncology',
  'Renal',
  'Psychiatric',
  'Peri-Op',
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cadre: '' as Cadre | '',
    specialty: '',
    institution: '',
    examDate: '',
    examCycle: '' as ExamCycle | '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    const phoneRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.cadre) {
      toast.error('Please select your cadre');
      return false;
    }
    if (formData.cadre === 'Higher Diploma' && !formData.specialty) {
      toast.error('Please select your specialty');
      return false;
    }
    if (!formData.institution) {
      toast.error('Please enter your institution');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.examDate || !formData.examCycle) {
      toast.error('Please select your target exam date');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);

    try {
      // Normalize phone number to 254 format
      const normalizedPhone = formData.phone.replace(/^(?:254|\+254|0)?/, '254');

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'student',
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          role: 'student',
          full_name: formData.fullName,
          email: formData.email,
          phone: normalizedPhone,
        });

        if (profileError) throw profileError;

        // Create student profile
        const { error: studentError } = await supabase.from('student_profiles').insert({
          id: authData.user.id,
          cadre: formData.cadre,
          specialty: formData.cadre === 'Higher Diploma' ? formData.specialty : null,
          institution: formData.institution,
          exam_date: formData.examDate,
          exam_cycle: formData.examCycle,
          plan_tier: 'free',
        });

        if (studentError) throw studentError;

        toast.success('Account created! Please check your email to verify.');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <NurseFitiLogo size="lg" />
          </Link>
          <h1 className="font-syne text-2xl font-bold text-dark dark:text-white mt-4">
            Create Your Account
          </h1>
          <p className="text-mid text-sm mt-2">
            Start your NCK exam preparation journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-amber'
                  : s < step
                  ? 'w-2 bg-teal'
                  : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-white border border-border rounded-lg p-6 shadow">
          <form onSubmit={handleSignup}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-syne text-lg font-bold text-dark mb-4">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g., Jane Wanjiku Kamau"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>

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
                    Phone Number (M-Pesa)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0712345678 or 254712345678"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                  <p className="text-xs text-mid mt-1">
                    Used for M-Pesa payments and WhatsApp notifications
                  </p>
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
                    placeholder="At least 6 characters"
                    minLength={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>

                <Button type="button" onClick={handleNext} fullWidth>
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-syne text-lg font-bold text-dark mb-4">
                  Academic Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Select Your Cadre
                  </label>
                  <select
                    name="cadre"
                    value={formData.cadre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  >
                    <option value="">Choose your cadre...</option>
                    <option value="KRCHN">KRCHN (Kenya Registered Community Health Nurse)</option>
                    <option value="BScN">BScN (Bachelor of Science in Nursing)</option>
                    <option value="Higher Diploma">Higher Diploma</option>
                  </select>
                </div>

                {formData.cadre === 'Higher Diploma' && (
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Specialty
                    </label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    >
                      <option value="">Choose your specialty...</option>
                      {higherDiplomaSpecialties.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Institution / College
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="e.g., Kenya Medical Training College"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={handleBack} variant="outline" fullWidth>
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} fullWidth>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Exam Information */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-syne text-lg font-bold text-dark mb-4">
                  Target Exam Date
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Exam Cycle
                  </label>
                  <select
                    name="examCycle"
                    value={formData.examCycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  >
                    <option value="">Choose exam cycle...</option>
                    <option value="May">May 2026</option>
                    <option value="August">August 2026</option>
                    <option value="November">November 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Exact Exam Date (if known)
                  </label>
                  <input
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                  <p className="text-xs text-mid mt-1">
                    This helps us create your personalized study plan
                  </p>
                </div>

                <div className="bg-teal-xlight border border-teal-light rounded-lg p-4">
                  <p className="text-sm text-dark">
                    <strong>Next:</strong> After signup, you'll take a quick 10-question diagnostic
                    quiz to assess your baseline knowledge.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={handleBack} variant="outline" fullWidth>
                    Back
                  </Button>
                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-mid">
              Already have an account?{' '}
              <Link href="/login" className="text-teal font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Tutor Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-mid">
            Are you a registered nurse?{' '}
            <Link href="/signup/tutor" className="text-amber-dark font-semibold hover:underline">
              Sign up as an Expert Tutor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
