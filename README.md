# NurseFiti — NCK Exam Preparation Platform

Kenya's most intelligent NCK (Nursing Council of Kenya) exam preparation platform. NurseFiti serves nursing graduates preparing for the NCK licensure exam and verified registered nurses offering personalized tutoring.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** M-Pesa Daraja API
- **Deployment:** Vercel
- **Version Control:** GitHub

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- M-Pesa Daraja API credentials (for payments)
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd nursepass-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:
- Supabase URL and keys (from your Supabase project settings)
- M-Pesa credentials (from Safaricom Daraja portal)
- WhatsApp API credentials (optional, for notifications)
- Anthropic API key (for AI revision plan generation)

### 4. Set up Supabase database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the schema SQL file in the Supabase SQL editor:
   - Copy contents of `supabase-schema.sql`
   - Paste into Supabase SQL Editor
   - Execute the script

This will create all tables, indexes, RLS policies, and seed data.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nursepass-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (student)/         # Student dashboard pages
│   │   ├── (tutor)/           # Tutor dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── shared/            # Shared components (Navbar, Logo, etc.)
│   │   ├── student/           # Student-specific components
│   │   └── tutor/             # Tutor-specific components
│   ├── lib/
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   └── utils/
│       └── supabase/          # Supabase client configuration
├── public/                     # Static assets
├── supabase-schema.sql        # Database schema
└── tailwind.config.ts         # Tailwind configuration
```

## 🎨 Brand Identity

### Colors
- **Primary Teal:** `#08514F` - Primary actions, headers
- **Amber Accent:** `#F5A623` - CTAs, highlights, XP
- **Dark:** `#0F1C1C` - Primary text
- **Cream:** `#FFFDF8` - Page backgrounds

### Typography
- **Display/Headings:** Syne (400, 600, 700, 800)
- **Body/UI:** Nunito (400, 500, 600, 700)

## 🔐 Authentication

NurseFiti supports two user types:
- **Students** - Nursing graduates preparing for NCK exam
- **Tutors** - Verified registered nurses offering tutoring

Authentication is handled by Supabase Auth with email/password and magic link options.

## 💳 Payments

All payments are processed via M-Pesa (Safaricom Daraja API):
- **STK Push** - Customer-initiated payments (subscriptions, bookings)
- **B2C** - Platform payouts to tutors

## 🚢 Deployment

The project is configured for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 📝 Development Phases

### Phase 0 — Foundation ✅
- [x] Next.js setup with TypeScript
- [x] Tailwind CSS configuration
- [x] Supabase client setup
- [x] Dark mode with next-themes
- [x] Base UI components
- [x] NurseFiti logo component
- [x] Database schema

### Phase 1 — Auth System (Next)
- [ ] Student signup
- [ ] Tutor application signup
- [ ] Login page
- [ ] Auth middleware

### Phase 2 — Student Dashboard
- [ ] Dashboard home
- [ ] MCQ practice
- [ ] Mock exams
- [ ] Flashcards
- [ ] Analytics
- [ ] Achievements

### Phase 3 — Tutor Dashboard
- [ ] Tutor home
- [ ] Schedule management
- [ ] Student roster
- [ ] Content studio
- [ ] Earnings

### Phase 4 — Booking System
- [ ] Tutor directory
- [ ] Session booking
- [ ] Real-time availability sync

### Phase 5 — Revision Plan Generator
- [ ] AI-powered plan generation
- [ ] Payment integration
- [ ] PDF export

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built for Kenyan nursing students preparing for the NCK licensure exam.

---

**Note:** This is the working name "NursePass" in the codebase. All user-facing content uses **NurseFiti**.
