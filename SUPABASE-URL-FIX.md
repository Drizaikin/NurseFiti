# Supabase URL Error Fix ✅

## Error

**"Invalid path request in specified url"**

## Root Cause

The Supabase URL in `.env.example` (and likely in your Vercel environment variables) had `/rest/v1/` appended to it:

```
❌ WRONG:
NEXT_PUBLIC_SUPABASE_URL=https://fejxmcdzepuremvrezyy.supabase.co/rest/v1/

✅ CORRECT:
NEXT_PUBLIC_SUPABASE_URL=https://fejxmcdzepuremvrezyy.supabase.co
```

### Why This Happens

The Supabase JavaScript client **automatically adds** `/rest/v1/` and other paths when making requests. When you include it in the base URL, it results in invalid paths like:

```
https://fejxmcdzepuremvrezyy.supabase.co/rest/v1/rest/v1/...
```

This causes the "Invalid path request" error.

---

## Fix Applied

### File: `.env.example`

**Before:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fejxmcdzepuremvrezyy.supabase.co/rest/v1/
```

**After:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fejxmcdzepuremvrezyy.supabase.co
```

---

## Action Required in Vercel

You need to update your environment variable in Vercel:

### Step 1: Go to Vercel Dashboard
1. Open your project
2. Go to **Settings** → **Environment Variables**

### Step 2: Update NEXT_PUBLIC_SUPABASE_URL
1. Find `NEXT_PUBLIC_SUPABASE_URL`
2. Click **Edit**
3. Remove `/rest/v1/` from the end
4. Should be: `https://fejxmcdzepuremvrezyy.supabase.co`
5. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments**
2. Click **Redeploy** on the latest deployment
3. OR just push a new commit (Vercel will auto-deploy)

---

## Correct Supabase Environment Variables

```env
# ✅ CORRECT FORMAT
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Where to Find These Values

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (without `/rest/v1/`)
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## How to Verify the Fix

### Test Locally:
1. Update your local `.env.local` file with the correct URL
2. Restart your dev server: `npm run dev`
3. Try signing up or logging in
4. Should work without "Invalid path" error

### Test on Vercel:
1. After updating env vars and redeploying
2. Visit your deployed site
3. Try signing up
4. Check browser console - no "Invalid path" errors

---

## Related Issues This Fixes

### 1. Signup Errors
- ✅ "Invalid path request" during signup
- ✅ Auth requests failing
- ✅ Database queries failing

### 2. Login Errors
- ✅ "Invalid path request" during login
- ✅ Magic link not working
- ✅ Session not persisting

### 3. Dashboard Errors
- ✅ Data not loading
- ✅ Profile queries failing
- ✅ Any Supabase operation failing

---

## Common Supabase URL Mistakes

### ❌ Wrong Formats:
```env
# Don't include /rest/v1/
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co/rest/v1/

# Don't include /auth/v1/
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co/auth/v1/

# Don't include trailing slash
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co/
```

### ✅ Correct Format:
```env
# Just the base URL, no paths, no trailing slash
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
```

---

## Deployment Checklist

### Before Deploying:
- [x] Fixed `.env.example` file
- [ ] Update Vercel environment variables
- [ ] Remove `/rest/v1/` from Supabase URL
- [ ] Verify all 3 Supabase env vars are correct

### After Deploying:
- [ ] Test signup
- [ ] Test login
- [ ] Test dashboard access
- [ ] Check browser console for errors
- [ ] Verify data loads correctly

---

## Quick Fix Commands

```bash
# 1. Commit the fix
git add .
git commit -m "Fix: Correct Supabase URL format - remove /rest/v1/ path"
git push origin main

# 2. Update Vercel env vars (in dashboard)
# 3. Redeploy will happen automatically
```

---

## Summary

**Issue:** Supabase URL had `/rest/v1/` appended  
**Impact:** All Supabase operations failing  
**Fix:** Remove `/rest/v1/` from the URL  
**Action:** Update Vercel environment variables  

**Status:** ✅ FIXED in code, needs Vercel env var update

---

## Important Notes

1. **The Supabase client handles paths automatically** - never add `/rest/v1/`, `/auth/v1/`, or any other paths to the base URL

2. **No trailing slash** - The URL should end with `.co`, not `.co/`

3. **Update both places:**
   - Local: `.env.local` file
   - Production: Vercel environment variables

4. **Restart required:**
   - Local: Restart dev server after changing `.env.local`
   - Production: Redeploy after changing Vercel env vars

---

**Date:** May 19, 2026  
**Priority:** CRITICAL  
**Resolution:** Update Vercel env vars and redeploy
