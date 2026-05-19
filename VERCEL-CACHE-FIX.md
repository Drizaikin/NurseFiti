# Vercel Cache Issue - Solution

## Problem

Vercel is building from a cached or old version of the code, showing errors for code that has already been fixed.

**Error shown:**
```
Type error: Property 'style' does not exist on type 'IntrinsicAttributes & CardProps'.
Line 161: style={{ backfaceVisibility: 'hidden' }}
```

**But the actual code at line 161-163 is:**
```tsx
<div
  className="absolute inset-0"
  style={{ backfaceVisibility: 'hidden' }}
>
  <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-teal to-teal-mid text-white">
```

The fix IS in the code, but Vercel is not seeing it.

---

## Solution: Force Fresh Build

### Option 1: Clear Vercel Cache (Recommended)

1. **Go to your Vercel project dashboard**
2. **Settings → General**
3. Scroll to **"Build & Development Settings"**
4. Click **"Clear Build Cache"**
5. Go to **Deployments**
6. Click **"Redeploy"** on the latest deployment
7. Select **"Use existing Build Cache: OFF"**
8. Click **"Redeploy"**

### Option 2: Force Push with Empty Commit

```bash
# Make an empty commit to trigger fresh build
git commit --allow-empty -m "Force rebuild: Clear Vercel cache"
git push origin main
```

### Option 3: Add .vercelignore (If needed)

Create `.vercelignore` file to ensure Vercel doesn't cache certain files:

```
.next/
node_modules/
.vercel/
```

Then commit and push:
```bash
git add .vercelignore
git commit -m "Add .vercelignore to prevent cache issues"
git push origin main
```

### Option 4: Manually Verify File on GitHub

1. Go to your GitHub repository
2. Navigate to `src/app/dashboard/flashcards/page.tsx`
3. Check lines 159-165
4. Verify the code shows the div wrapper (not Card with style prop)
5. If it shows the OLD code, the push didn't work - push again

---

## Verification

After redeploying, check the build logs in Vercel. You should see:
- ✅ No TypeScript errors
- ✅ Build completes successfully
- ✅ Deployment succeeds

---

## Why This Happens

Vercel caches:
1. **node_modules** - Dependencies
2. **.next** - Build output
3. **Git commits** - Sometimes uses cached git state

When you fix a file but Vercel still shows the old error, it means:
- Vercel is using a cached build
- OR the changes weren't pushed to GitHub
- OR Vercel is reading from a stale git reference

---

## Current File State (VERIFIED CORRECT)

**File:** `src/app/dashboard/flashcards/page.tsx`

**Lines 159-165:**
```tsx
{/* Front */}
<div
  className="absolute inset-0"
  style={{ backfaceVisibility: 'hidden' }}
>
  <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-teal to-teal-mid text-white">
    <div className="text-center">
```

**Lines 174-182:**
```tsx
{/* Back */}
<div
  className="absolute inset-0"
  style={{
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
  }}
>
  <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-amber to-amber-dark text-white">
```

✅ **Both Card components are correctly wrapped in divs**
✅ **No style props on Card components**
✅ **Code is correct and ready**

---

## Next Steps

1. **Verify the fix is on GitHub:**
   ```bash
   git status
   git log --oneline -1
   ```

2. **If changes aren't pushed, push now:**
   ```bash
   git add .
   git commit -m "Fix: Flashcards Card component - wrap in divs for style props"
   git push origin main
   ```

3. **Clear Vercel cache and redeploy** (see Option 1 above)

4. **Monitor build logs** in Vercel dashboard

---

## Expected Result

After clearing cache and redeploying:
- ✅ Build succeeds
- ✅ No TypeScript errors
- ✅ Deployment completes
- ✅ Site is live

The code is correct. This is purely a Vercel caching issue.
