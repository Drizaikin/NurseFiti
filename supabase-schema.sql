-- NurseFiti Database Schema
-- Version 1.0 - May 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES & USER DATA
-- ============================================================================

-- Main profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT CHECK (role IN ('student', 'tutor', 'admin')) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL, -- M-Pesa number
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  cadre TEXT CHECK (cadre IN ('KRCHN', 'BScN', 'Higher Diploma')) NOT NULL,
  specialty TEXT, -- for Higher Diploma
  institution TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_cycle TEXT CHECK (exam_cycle IN ('May', 'August', 'November')) NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_study_date DATE,
  plan_tier TEXT CHECK (plan_tier IN ('free', 'standard', 'premium')) DEFAULT 'free',
  plan_expires_at TIMESTAMPTZ
);

-- Tutor profiles
CREATE TABLE tutor_profiles (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  nck_reg_number TEXT UNIQUE NOT NULL,
  professional_title TEXT NOT NULL,
  bio TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  cadres_taught TEXT[] NOT NULL,
  specialties TEXT[] NOT NULL,
  rate_per_hour INTEGER NOT NULL, -- in KSh
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verification_tier TEXT CHECK (verification_tier IN ('standard', 'gold')),
  whatsapp_number TEXT NOT NULL,
  total_students INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  pass_rate NUMERIC(5,2) DEFAULT 0,
  is_accepting_bookings BOOLEAN DEFAULT TRUE,
  session_platform TEXT[] DEFAULT ARRAY['Zoom', 'WhatsApp', 'Google Meet'],
  allow_instant_booking BOOLEAN DEFAULT TRUE,
  allow_group_sessions BOOLEAN DEFAULT FALSE,
  buffer_minutes INTEGER DEFAULT 30
);

-- ============================================================================
-- QUESTIONS & PRACTICE
-- ============================================================================

-- Questions (MCQ bank)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cadre TEXT NOT NULL,
  unit TEXT NOT NULL,
  topic TEXT NOT NULL,
  stem TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT CHECK (correct_option IN ('A','B','C','D')) NOT NULL,
  rationale TEXT NOT NULL,
  rationale_a TEXT,
  rationale_b TEXT,
  rationale_c TEXT,
  rationale_d TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  contributor_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending_review', 'approved', 'rejected', 'needs_revision')) DEFAULT 'approved',
  exam_year INTEGER,
  paper TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student answers
CREATE TABLE student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  selected_option TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  mode TEXT CHECK (mode IN ('practice', 'mock_exam', 'weak_drill')) NOT NULL,
  session_id UUID,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mock exam results
CREATE TABLE mock_exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  cadre TEXT NOT NULL,
  paper TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage NUMERIC(5,2) NOT NULL,
  time_used_minutes INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL
);

-- Flagged questions
CREATE TABLE flagged_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  flagged_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, question_id)
);

-- ============================================================================
-- FLASHCARDS
-- ============================================================================

-- Flashcard decks
CREATE TABLE flashcard_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cadre TEXT NOT NULL,
  unit TEXT NOT NULL,
  card_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id)
);

-- Flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES flashcard_decks(id) NOT NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  back_highlight TEXT,
  cadre TEXT NOT NULL,
  unit TEXT NOT NULL,
  contributor_id UUID REFERENCES profiles(id)
);

-- Flashcard progress (SRS)
CREATE TABLE flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  card_id UUID REFERENCES flashcards(id) NOT NULL,
  ease_factor NUMERIC DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  rating TEXT CHECK (rating IN ('again', 'hard', 'good', 'easy')),
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, card_id)
);

-- ============================================================================
-- TUTORING SYSTEM
-- ============================================================================

-- Tutor availability slots
CREATE TABLE tutor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id) NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(tutor_id, day_of_week, start_time)
);

-- Sessions (bookings)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  tutor_id UUID REFERENCES profiles(id) NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  cadre TEXT NOT NULL,
  topic TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('Zoom', 'Google Meet', 'WhatsApp')) NOT NULL,
  join_link TEXT,
  student_note TEXT,
  tutor_note TEXT,
  duration_minutes INTEGER NOT NULL,
  rate_per_hour INTEGER NOT NULL,
  gross_amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  net_amount INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending_approval', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'confirmed',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')) DEFAULT 'pending',
  mpesa_transaction_id TEXT,
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  reviewed BOOLEAN DEFAULT FALSE
);

-- Session reviews
CREATE TABLE session_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  tutor_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review_text TEXT,
  keywords TEXT[],
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session notes (tutor private notes)
CREATE TABLE session_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  session_id UUID REFERENCES sessions(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STUDY GROUPS
-- ============================================================================

-- Study groups
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cadre TEXT NOT NULL,
  exam_cycle TEXT CHECK (exam_cycle IN ('May', 'August', 'November')) NOT NULL,
  privacy TEXT CHECK (privacy IN ('open', 'invite_only')) DEFAULT 'open',
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group memberships
CREATE TABLE group_members (
  group_id UUID REFERENCES study_groups(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  role TEXT CHECK (role IN ('member', 'admin')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, student_id)
);

-- ============================================================================
-- REVISION PLANS
-- ============================================================================

-- Revision plans (generated)
CREATE TABLE revision_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  cadre TEXT NOT NULL,
  exam_date DATE NOT NULL,
  days_available INTEGER NOT NULL,
  study_hours_weekday INTEGER NOT NULL,
  study_hours_weekend INTEGER NOT NULL,
  work_school_status TEXT NOT NULL,
  plan_html TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  payment_ref TEXT NOT NULL,
  share_token TEXT UNIQUE
);

-- ============================================================================
-- GAMIFICATION
-- ============================================================================

-- Student badges
CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

-- Badge definitions (reference data)
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlock_condition TEXT NOT NULL
);

-- ============================================================================
-- CONTENT CONTRIBUTIONS
-- ============================================================================

-- Study notes
CREATE TABLE study_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contributor_id UUID REFERENCES profiles(id) NOT NULL,
  cadre TEXT NOT NULL,
  unit TEXT NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending_review', 'approved', 'needs_revision', 'rejected')) DEFAULT 'pending_review',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS & PAYMENTS
-- ============================================================================

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT CHECK (type IN ('plan_subscription', 'revision_plan', 'session_booking')) NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'KES',
  mpesa_phone TEXT NOT NULL,
  mpesa_receipt TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  reference_id UUID,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_student_answers_student ON student_answers(student_id);
CREATE INDEX idx_student_answers_question ON student_answers(question_id);
CREATE INDEX idx_questions_cadre_unit ON questions(cadre, unit);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_sessions_student ON sessions(student_id);
CREATE INDEX idx_sessions_tutor ON sessions(tutor_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_tutor_availability_tutor ON tutor_availability(tutor_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_flashcard_progress_student ON flashcard_progress(student_id);
CREATE INDEX idx_flashcard_progress_next_review ON flashcard_progress(next_review_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Student profiles: Students can read/update their own
CREATE POLICY "Students can read own profile" ON student_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own profile" ON student_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tutor profiles: Public read for verified tutors, tutors can update own
CREATE POLICY "Anyone can read verified tutor profiles" ON tutor_profiles
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Tutors can update own profile" ON tutor_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Questions: All authenticated users can read approved questions
CREATE POLICY "Authenticated users can read approved questions" ON questions
  FOR SELECT USING (status = 'approved' AND auth.role() = 'authenticated');

-- Student answers: Students can read/write their own answers
CREATE POLICY "Students can read own answers" ON student_answers
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own answers" ON student_answers
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Mock exam results: Students can read/write their own results
CREATE POLICY "Students can read own mock results" ON mock_exam_results
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own mock results" ON mock_exam_results
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Sessions: Students and tutors can read their own sessions
CREATE POLICY "Students can read own sessions" ON sessions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Tutors can read own sessions" ON sessions
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Students can book sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Tutors can update own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = tutor_id);

-- Tutor availability: Public read, tutors can manage own
CREATE POLICY "Anyone can read tutor availability" ON tutor_availability
  FOR SELECT USING (true);

CREATE POLICY "Tutors can manage own availability" ON tutor_availability
  FOR ALL USING (auth.uid() = tutor_id);

-- Notifications: Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Revision plans: Students can read their own plans or via share token
CREATE POLICY "Students can read own revision plans" ON revision_plans
  FOR SELECT USING (auth.uid() = student_id);

-- Payments: Users can read their own payments
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA - BADGE DEFINITIONS
-- ============================================================================

INSERT INTO badges (id, name, description, icon, unlock_condition) VALUES
('streak_master', 'Streak Master', 'Maintain a 14-day study streak', '🔥', '14-day streak'),
('pharma_warrior', 'Pharma Warrior', 'Answer 100 Pharmacology questions', '💊', '100 Pharmacology answers'),
('mock_maestro', 'Mock Maestro', 'Complete 3 full mock exams', '📝', '3 full mock exams'),
('speed_demon', 'Speed Demon', 'Finish mock exam 20+ minutes early', '⚡', 'Finish mock 20+ min early'),
('top_10_percent', 'Top 10%', 'Reach 90th percentile in peer comparison', '🏆', '90th percentile'),
('knowledge_god', 'Knowledge God', 'Answer all 5,000 questions', '🧠', 'Answer 5,000 questions'),
('perfect_score', 'Perfect Score', 'Score 90%+ on any mock exam', '💯', '90%+ on mock exam'),
('team_captain', 'Team Captain', 'Create and lead a study group', '👥', 'Create study group');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update tutor average rating
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tutor_profiles
  SET average_rating = (
    SELECT AVG(rating)::NUMERIC(3,2)
    FROM session_reviews
    WHERE tutor_id = NEW.tutor_id
  )
  WHERE id = NEW.tutor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tutor_rating
AFTER INSERT ON session_reviews
FOR EACH ROW
EXECUTE FUNCTION update_tutor_rating();

-- Function to update student XP and level
CREATE OR REPLACE FUNCTION update_student_xp()
RETURNS TRIGGER AS $$
DECLARE
  xp_gain INTEGER := 0;
  current_xp INTEGER;
  current_level INTEGER;
  new_level INTEGER;
BEGIN
  -- Calculate XP gain based on action
  IF NEW.is_correct THEN
    xp_gain := 8;
  END IF;

  -- Update student XP
  UPDATE student_profiles
  SET xp = xp + xp_gain
  WHERE id = NEW.student_id
  RETURNING xp, level INTO current_xp, current_level;

  -- Calculate new level (Level 1 = 0 XP, Level 2 = 200 XP, +300 XP per level)
  new_level := FLOOR((current_xp + 100) / 300) + 1;

  -- Update level if changed
  IF new_level > current_level THEN
    UPDATE student_profiles
    SET level = new_level
    WHERE id = NEW.student_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_xp
AFTER INSERT ON student_answers
FOR EACH ROW
EXECUTE FUNCTION update_student_xp();
