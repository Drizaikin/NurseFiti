# Vercel Deployment Fixes

## Fix #1: Flashcards 3D Flip Animation TypeScript Error

### Issue

The Vercel deployment was failing with the following TypeScript error:

```
Type error: Type '{ children: Element; className: string; style: { backfaceVisibility: string; }; }' 
is not assignable to type 'IntrinsicAttributes & CardProps'.
Property 'style' does not exist on type 'IntrinsicAttributes & CardProps'.
```

**Location:** `src/app/dashboard/flashcards/page.tsx` (lines 161-162)

### Root Cause

The `Card` component (`src/components/ui/Card.tsx`) has a TypeScript interface that only accepts these props:
- `children: React.ReactNode`
- `className?: string`
- `padding?: 'none' | 'sm' | 'md' | 'lg'`
- `hover?: boolean`

The flashcards page was trying to pass a `style` prop directly to the Card component for the 3D flip animation:

```tsx
<Card
  className="..."
  style={{ backfaceVisibility: 'hidden' }}  // ❌ Not allowed
>
```

This caused a TypeScript compilation error, preventing the build from completing.

### Solution

Wrapped each Card component in a `div` element that handles the inline styles, while the Card component only receives valid props:

**Before (Broken):**
```tsx
<Card
  className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-gradient-to-br from-teal to-teal-mid text-white"
  style={{ backfaceVisibility: 'hidden' }}
>
  {/* content */}
</Card>
```

**After (Fixed):**
```tsx
<div
  className="absolute inset-0"
  style={{ backfaceVisibility: 'hidden' }}
>
  <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-teal to-teal-mid text-white">
    {/* content */}
  </Card>
</div>
```

### Status
✅ **Fixed** - File: `src/app/dashboard/flashcards/page.tsx`

---

## Fix #2: next-themes Import Path Error

### Issue

The Vercel deployment was failing with the following TypeScript error:

```
Type error: Cannot find module 'next-themes/dist/types' or its corresponding type declarations.
```

**Location:** `src/components/shared/ThemeProvider.tsx` (line 4)

### Root Cause

The import path for `ThemeProviderProps` was using an internal path (`next-themes/dist/types`) that is not exposed in the package's public API. This worked in development but fails in production builds.

**Incorrect import:**
```tsx
import { type ThemeProviderProps } from 'next-themes/dist/types';  // ❌ Internal path
```

### Solution

Import `ThemeProviderProps` directly from the main `next-themes` package:

**Before (Broken):**
```tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
```

**After (Fixed):**
```tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
```

### Status
✅ **Fixed** - File: `src/components/shared/ThemeProvider.tsx`

---

## Summary of Changes

### Files Modified
1. ✅ `src/app/dashboard/flashcards/page.tsx` - Fixed Card component style prop issue
2. ✅ `src/components/shared/ThemeProvider.tsx` - Fixed next-themes import path

### Impact
✅ **No functionality changes** - All features work exactly the same  
✅ **No visual changes** - The appearance is identical  
✅ **TypeScript compliance** - Build now passes type checking  
✅ **Vercel deployment** - Should deploy successfully  

### Testing Checklist
- [x] TypeScript compilation passes
- [x] 3D flip animation still works
- [x] Dark mode toggle functionality intact
- [x] Theme persistence works
- [ ] Vercel build succeeds (to be verified on next deployment)

---

**Status:** ✅ All Issues Fixed  
**Date:** May 19, 2026  
**Impact:** Build-blocking errors resolved, no feature changes
