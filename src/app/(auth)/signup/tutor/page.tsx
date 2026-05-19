'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { NurseFitiLogo } from '@/components/shared/NurseFitiLogo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Cadre = 'KRCHN' | 'BScN' | 'Higher Diploma';

const higherDiplomaSpecialties = [
  'Critical Care',
  'Oncology',
  'Renal',
  'Psychiatric',
  'Peri-Op',
];

export default function TutorSignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Professional Credentials
    nckRegNumber: '',
    professionalTitle: '',
    yearsExperience: '',
    currentEmployer: '',
    
    // Step 3: Specialization
    cadresTaught: [] as Cadre[],
    specialties: [] as string[],
    bio: '',
    sessionRate: '',
    
    // Step 4: Documents (file uploads would be handled separately)
    mpesaNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCadre = (cadre: Cadre) => {
    setFormData({
      ...formData,
      cadresTaught: formData.cadresTaught.includes(cadre)
        ? formData.cadresTaught.filter(c => c !== cadre)
        : [...formData.cadresTaught, cadre],
    });
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.includes(specialty)
        ? formData.specialties.filter(s => s !== specialty)
        : [...formData.specialties, specialty],
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.phone.match(/^(?:254|\+254|0)?([17]\d{8})$/)) {
      toast.error('Please enter a valid Kenyan phone number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.nckRegNumber || !formData.professionalTitle || !formData.yearsExperience) {
      toast.error('Please fill in all professional credentials');
      return false;
    }
    if (parseInt(formData.yearsExperience) < 0) {
      toast.error('Years of experience must be a positive number');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.cadresTaught.length === 0) {
      toast.error('Please select at least one cadre you can teach');
      return false;
    }
    if (!formData.bio || formData.bio.length < 200) {
      toast.error('Bio must be at least 200 characters');
      return false;
    }
    if (formData.bio.length > 400) {
      toast.error('Bio must not exceed 400 characters');
      return false;
    }
    if (!formData.sessionRate || parseInt(formData.sessionRate) < 500) {
      toast.error('Session rate must be at least KSh 500 per hour');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!formData.mpesaNumber) {
      toast.error('Please enter your M-Pesa number');
      return false;
    }
    if (!formData.mpesaNumber.match(/^(?:254|\+254|0)?([17]\d{8})$/)) {
      toast.error('Please enter a valid M-Pesa number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setLoading(true);

    try {
      // Normalize phone numbers
      const normalizedPhone = formData.phone.replace(/^(?:254|\+254|0)?/, '254');
      const normalizedMpesa = formData.mpesaNumber.replace(/^(?:254|\+254|0)?/, '254');

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'tutor',
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          role: 'tutor',
          full_name: formData.fullName,
          email: formData.email,
          phone: normalizedPhone,
        });

        if (profileError) throw profileError;

        // Create tutor profile
        const { error: tutorError } = await supabase.from('tutor_profiles').insert({
          id: authData.user.id,
          nck_reg_number: formData.nckRegNumber,
          professional_title: formData.professionalTitle,
          bio: formData.bio,
          years_experience: parseInt(formData.yearsExperience),
          cadres_taught: formData.cadresTaught,
          specialties: formData.specialties,
          rate_per_hour: parseInt(formData.sessionRate),
          verification_status: 'pending',
          whatsapp_number: normalizedMpesa, // Using same as M-Pesa for now
        });

        if (tutorError) throw tutorError;

        toast.success('Application submitted! We\'ll review and get back to you within 48 hours.');
        
        // Redirect to a pending verification page
        setTimeout(() => {
          router.push('/tutor/pending-verification');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Tutor signup error:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark py-12 px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <NurseFitiLogo size="lg" />
          </Link>
          <h1 className="font-syne text-2xl font-bold text-dark dark:text-white mt-4">
            Apply as an Expert Tutor
          </h1>
          <p className="text-mid text-sm mt-2">
            Join Kenya's top nursing educators on NurseFiti
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-sm transition-all ${
                  s === step
                    ? 'bg-amber text-dark'
                    : s < step
                    ? 'bg-teal text-white'
                    : 'bg-border text-mid'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    s < step ? 'bg-teal' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-white border border-border rounded-lg p-8 shadow">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne text-xl font-bold text-dark mb-2">
                    Personal Information
                  </h2>
                  <p className="text-sm text-mid">
                    Let's start with your basic details
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Full Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Jane Wanjiku Kamau"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Email Address <span className="text-red">*</span>
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
                      Phone Number <span className="text-red">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0712345678"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Password <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Confirm Password <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                  </div>
                </div>

                <Button type="button" onClick={handleNext} fullWidth>
                  Continue to Professional Credentials
                </Button>
              </div>
            )}

            {/* Step 2: Professional Credentials */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne text-xl font-bold text-dark mb-2">
                    Professional Credentials
                  </h2>
                  <p className="text-sm text-mid">
                    We'll verify these details before approval
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    NCK Registration Number <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="nckRegNumber"
                    value={formData.nckRegNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., NCK/RN/12345"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                  <p className="text-xs text-mid mt-1">
                    This will be manually verified against NCK records
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Professional Title <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="professionalTitle"
                    value={formData.professionalTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., RN, BScN, MSc Clinical Nursing"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Years of Experience <span className="text-red">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      min="0"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Current/Recent Employer
                    </label>
                    <input
                      type="text"
                      name="currentEmployer"
                      value={formData.currentEmployer}
                      onChange={handleInputChange}
                      placeholder="e.g., Kenyatta National Hospital"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={handleBack} variant="outline" fullWidth>
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} fullWidth>
                    Continue to Specialization
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Specialization */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne text-xl font-bold text-dark mb-2">
                    Specialization & Rates
                  </h2>
                  <p className="text-sm text-mid">
                    Tell students what you can teach
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-3">
                    Cadres You Can Teach <span className="text-red">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['KRCHN', 'BScN', 'Higher Diploma'] as Cadre[]).map((cadre) => (
                      <button
                        key={cadre}
                        type="button"
                        onClick={() => toggleCadre(cadre)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          formData.cadresTaught.includes(cadre)
                            ? 'bg-teal text-white'
                            : 'bg-teal-xlight text-mid hover:bg-teal-light'
                        }`}
                      >
                        {cadre}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.cadresTaught.includes('Higher Diploma') && (
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-3">
                      Higher Diploma Specialties
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {higherDiplomaSpecialties.map((specialty) => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            formData.specialties.includes(specialty)
                              ? 'bg-amber text-dark'
                              : 'bg-amber-light text-amber-dark hover:bg-amber/20'
                          }`}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Bio (200-400 characters) <span className="text-red">*</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell students about your experience, teaching style, and what makes you a great tutor..."
                    rows={4}
                    maxLength={400}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                    required
                  />
                  <p className="text-xs text-mid mt-1">
                    {formData.bio.length}/400 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Session Rate (KSh per hour) <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    name="sessionRate"
                    value={formData.sessionRate}
                    onChange={handleInputChange}
                    placeholder="e.g., 1200"
                    min="500"
                    step="100"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                  <p className="text-xs text-mid mt-1">
                    Platform fee: 15% • You receive 85% of your rate
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={handleBack} variant="outline" fullWidth>
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} fullWidth>
                    Continue to Payment Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: M-Pesa & Submit */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne text-xl font-bold text-dark mb-2">
                    Payment Details
                  </h2>
                  <p className="text-sm text-mid">
                    Where should we send your earnings?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    M-Pesa Number <span className="text-red">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mpesaNumber"
                    value={formData.mpesaNumber}
                    onChange={handleInputChange}
                    placeholder="0712345678"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                  <p className="text-xs text-mid mt-1">
                    This number will be used for session payouts
                  </p>
                </div>

                <div className="bg-amber-light border border-amber rounded-lg p-4">
                  <h3 className="font-semibold text-dark text-sm mb-2">
                    📋 What Happens Next?
                  </h3>
                  <ul className="text-sm text-dark space-y-1">
                    <li>• We'll review your application within 48 hours</li>
                    <li>• You'll receive an email and WhatsApp notification</li>
                    <li>• Once approved, you can set your availability and start tutoring</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={handleBack} variant="outline" fullWidth>
                    Back
                  </Button>
                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-mid">
              Already have a tutor account?{' '}
              <Link href="/login?role=tutor" className="text-teal font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Student Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-mid">
            Are you a student?{' '}
            <Link href="/signup" className="text-amber-dark font-semibold hover:underline">
              Sign up as a student
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
