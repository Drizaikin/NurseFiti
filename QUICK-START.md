# Quick Start - Deploy NurseFiti in 5 Minutes

## The Problem
You were deploying from the **wrong folder**. The parent directory contains old HTML files with "NursePass" branding. You need to deploy from the `nursepass-web` folder only.

## The Solution - 3 Steps

### Step 1: Delete Old Deployment
1. Go to https://vercel.com/dashboard
2. Delete your current project
3. Start fresh

### Step 2: Deploy Correct Folder

**Option A: Vercel CLI (Fastest)**
```bash
# Navigate to the CORRECT folder
cd "c:\Users\annes\Downloads\NurseFiti\NursePass-main\nursepass-web"

# Install Vercel CLI if you haven't
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# When prompted:
# - Set up and deploy? Y
# - Link to existing project? N
# - Project name? nursefiti
# - Directory? . (just press Enter)
# - Override settings? N

# Deploy to production
vercel --prod
```

**Option B: GitHub + Vercel (Recommended)**
```bash
# Navigate to the CORRECT folder
cd "c:\Users\annes\Downloads\NurseFiti\NursePass-main\nursepass-web"

# Initialize git (if not already done)
git init
git add .
git commit -m "NurseFiti app"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nursefiti.git
git push -u origin main

# Then go to vercel.com/new and import the repository
```

### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://fejxmcdzepuremvrezyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

Then redeploy.

## Verify Success

Visit your Vercel URL. You should see:
- ✅ **NurseFiti** logo (not NursePass)
- ✅ ECG + checkmark icon
- ✅ Teal and amber colors
- ✅ "Welcome Back" on login page

## Still Wrong?

If you still see "NursePass" or wrong design:
1. You deployed from the wrong folder
2. Delete the Vercel project
3. Make SURE you're in `nursepass-web` folder
4. Run `pwd` (Mac/Linux) or `cd` (Windows) to confirm
5. Deploy again

## Supabase Configuration

After deployment:
1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel URL to Site URL and Redirect URLs
3. Go to Authentication → Providers → Email
4. **Disable "Confirm email"** for testing
5. Save

## Test Login

1. Go to `/signup`
2. Create account
3. Go to `/login`
4. Login
5. Should redirect to `/dashboard`

---

**Key Point: Always deploy from the `nursepass-web` folder, NOT the parent directory!**
