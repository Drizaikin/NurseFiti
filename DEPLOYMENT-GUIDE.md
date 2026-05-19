# NurseFiti Deployment Guide - Fresh Start

## Step 1: Delete Old Vercel Project

1. Go to https://vercel.com/dashboard
2. Find your current NurseFiti project
3. Click on the project
4. Go to **Settings** → **General**
5. Scroll to bottom and click **Delete Project**
6. Confirm deletion

## Step 2: Prepare Your Local Project

### Important: Deploy from the CORRECT folder

Your project structure is:
```
NurseFiti/
└── NursePass-main/
    ├── nck_website_design.html  ❌ OLD FILE - DO NOT DEPLOY THIS
    └── nursepass-web/           ✅ DEPLOY THIS FOLDER
        ├── src/
        ├── package.json
        └── next.config.ts
```

**You MUST deploy the `nursepass-web` folder, NOT the parent folder!**

## Step 3: Push to GitHub (Recommended Method)

### Option A: Create New Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "nursefiti-app")
3. **Do NOT initialize with README**
4. Click "Create repository"

5. Open terminal in the `nursepass-web` folder:
```bash
cd "c:\Users\annes\Downloads\NurseFiti\NursePass-main\nursepass-web"
```

6. Initialize git and push:
```bash
git init
git add .
git commit -m "Initial commit - NurseFiti app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nursefiti-app.git
git push -u origin main
```

### Option B: Use Existing Repository

If you already have a repository:

1. Make sure you're in the `nursepass-web` folder
2. Push your changes:
```bash
cd "c:\Users\annes\Downloads\NurseFiti\NursePass-main\nursepass-web"
git add .
git commit -m "Fresh deployment - correct folder structure"
git push
```

## Step 4: Deploy to Vercel

### Method 1: Deploy from GitHub (Recommended)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub repository
4. **IMPORTANT:** Configure these settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** Leave as `.` (since you're deploying the correct folder)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://fejxmcdzepuremvrezyy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
   ```

6. Click **Deploy**

### Method 2: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to the correct folder:
```bash
cd "c:\Users\annes\Downloads\NurseFiti\NursePass-main\nursepass-web"
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **nursefiti**
   - In which directory is your code located? **.**
   - Want to override settings? **N**

6. Add environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

7. Deploy to production:
```bash
vercel --prod
```

## Step 5: Configure Supabase

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/auth/callback`

4. Navigate to **Authentication** → **Providers** → **Email**
5. **DISABLE "Confirm email"** (for testing)
6. Save changes

## Step 6: Verify Deployment

1. Visit your Vercel URL
2. Check that you see:
   - ✅ **NurseFiti** logo (ECG + checkmark)
   - ✅ Teal color (#08514F)
   - ✅ Amber button (#F5A623)
   - ✅ "Welcome Back" heading on login page

3. If you see:
   - ❌ "NursePass" branding
   - ❌ Stacked books icon
   - ❌ Wrong colors
   
   **Then you deployed the wrong folder!** Go back to Step 3.

## Step 7: Test Authentication

1. Go to `/signup`
2. Create a new account
3. Check your email (if confirmation enabled)
4. Go to `/login`
5. Log in with your credentials
6. Verify you're redirected to `/dashboard`

## Troubleshooting

### Issue: Wrong design showing (old NursePass)
**Solution:** You deployed from the wrong folder. Delete the Vercel project and redeploy from `nursepass-web` folder only.

### Issue: "Cannot coerce to single JSON object"
**Solution:** 
1. Disable email confirmation in Supabase
2. Make sure profiles are created during signup
3. Check that `.maybeSingle()` is used in login page

### Issue: "Invalid path request in specified url"
**Solution:** Check that `NEXT_PUBLIC_SUPABASE_URL` is the base URL only:
- ✅ Correct: `https://fejxmcdzepuremvrezyy.supabase.co`
- ❌ Wrong: `https://fejxmcdzepuremvrezyy.supabase.co/rest/v1/`

### Issue: "Email rate limit exceeded"
**Solution:** 
1. Wait 1 hour
2. Disable email confirmation in Supabase
3. Use a different email address

### Issue: Build fails on Vercel
**Solution:**
1. Check build logs for specific error
2. Make sure all dependencies are in `package.json`
3. Run `npm run build` locally first to test

## Important Files Checklist

Before deploying, verify these files exist in `nursepass-web`:

- ✅ `package.json`
- ✅ `next.config.ts`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `.env.example`
- ✅ `src/app/layout.tsx`
- ✅ `src/components/shared/NurseFitiLogo.tsx`
- ✅ `vercel.json` (just created)

## Environment Variables Template

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fejxmcdzepuremvrezyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For Vercel production, use the Vercel dashboard to add these variables.

## Success Criteria

Your deployment is successful when:

1. ✅ Correct NurseFiti branding displays
2. ✅ Login page loads without errors
3. ✅ Signup creates user and profiles
4. ✅ Login redirects to dashboard
5. ✅ Dashboard displays user data
6. ✅ No console errors
7. ✅ All pages load correctly

## Need Help?

If you still see issues after following this guide:

1. Check Vercel build logs
2. Check browser console for errors
3. Verify environment variables are set
4. Confirm you deployed from `nursepass-web` folder
5. Clear browser cache and try again

---

**Remember: The key issue was deploying from the wrong folder. Always deploy from `nursepass-web`, not the parent directory!**
