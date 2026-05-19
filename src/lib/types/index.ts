// User roles
export type UserRole = 'student' | 'tutor' | 'admin';

// Cadre types
export type Cadre = 'KRCHN' | 'BScN' | 'Higher Diploma';

// Higher Diploma specialties
export type HigherDiplomaSpecialty = 
  | 'Critical Care' 
  | 'Oncology' 
  | 'Renal' 
  | 'Psychiatric' 
  | 'Peri-Op';

// Exam cycles
export type ExamCycle = 'May' | 'August' | 'November';

// Plan tiers
export type PlanTier = 'free' | 'standard' | 'premium';

// Verification status
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

// Verification tier
export type VerificationTier = 'standard' | 'gold';

// Session platforms
export type SessionPlatform = 'Zoom' | 'Google Meet' | 'WhatsApp';

// Session status
export type SessionStatus = 
  | 'pending_approval' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

// Payment status
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

// Question difficulty
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

// Content status
export type ContentStatus = 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'needs_revision';

// Practice modes
export type PracticeMode = 'practice' | 'mock_exam' | 'weak_drill';

// Flashcard ratings (SRS)
export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

// Profile interface
export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
}

// Student profile
export interface StudentProfile {
  id: string;
  cadre: Cadre;
  specialty?: HigherDiplomaSpecialty;
  institution: string;
  exam_date: string;
  exam_cycle: ExamCycle;
  xp: number;
  level: number;
  streak_count: number;
  last_study_date?: string;
  plan_tier: PlanTier;
  plan_expires_at?: string;
}

// Tutor profile
export interface TutorProfile {
  id: string;
  nck_reg_number: string;
  professional_title: string;
  bio: string;
  years_experience: number;
  cadres_taught: Cadre[];
  specialties: string[];
  rate_per_hour: number;
  verification_status: VerificationStatus;
  verification_tier?: VerificationTier;
  whatsapp_number: string;
  total_students: number;
  total_sessions: number;
  average_rating: number;
  pass_rate: number;
  is_accepting_bookings: boolean;
  session_platform: SessionPlatform[];
  allow_instant_booking: boolean;
  allow_group_sessions: boolean;
  buffer_minutes: number;
}

// Question
export interface Question {
  id: string;
  cadre: Cadre;
  unit: string;
  topic: string;
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
  difficulty: QuestionDifficulty;
  contributor_id?: string;
  status: ContentStatus;
  exam_year?: number;
  paper?: string;
  views: number;
  created_at: string;
}

// Student answer
export interface StudentAnswer {
  id: string;
  student_id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
  time_taken_seconds: number;
  mode: PracticeMode;
  session_id?: string;
  answered_at: string;
}

// Mock exam result
export interface MockExamResult {
  id: string;
  student_id: string;
  cadre: Cadre;
  paper: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_used_minutes: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
}

// Session
export interface Session {
  id: string;
  student_id: string;
  tutor_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  cadre: Cadre;
  topic: string;
  platform: SessionPlatform;
  join_link?: string;
  student_note?: string;
  tutor_note?: string;
  duration_minutes: number;
  rate_per_hour: number;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  status: SessionStatus;
  payment_status: PaymentStatus;
  mpesa_transaction_id?: string;
  booked_at: string;
  completed_at?: string;
  reviewed: boolean;
}

// Tutor availability
export interface TutorAvailability {
  id: string;
  tutor_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// Study group
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  cadre: Cadre;
  exam_cycle: ExamCycle;
  privacy: 'open' | 'invite_only';
  creator_id: string;
  member_count: number;
  max_members: number;
  created_at: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// Badge
export interface Badge {
  id: string;
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  unlock_condition: string;
}

// Revision plan
export interface RevisionPlan {
  id: string;
  student_id: string;
  cadre: Cadre;
  exam_date: string;
  days_available: number;
  study_hours_weekday: number;
  study_hours_weekend: number;
  work_school_status: string;
  plan_html: string;
  plan_data: any;
  generated_at: string;
  payment_ref: string;
  share_token?: string;
}
