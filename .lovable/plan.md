

# Fix: "Get Started" Button and Dashboard Showing Placeholder Data

## Problem Analysis

Two issues identified:

1. **"Get Started Free" button links to `/dashboard`** (line 240 of `Index.tsx`). If a user happens to have an active session, they land on the Dashboard which displays hardcoded placeholder data for "Alex Chen" — this is the "alex page" users are seeing.

2. **Dashboard uses hardcoded placeholder data** (`src/data/placeholder-data.ts`) with `userProfile.name = "Alex Chen"` instead of the authenticated user's real information.

## Planned Changes

### 1. Fix "Get Started Free" CTA link (`src/pages/Index.tsx`)
- Change `<Link to="/dashboard">` to `<Link to="/auth">` on line 240 so unauthenticated users are sent to the sign-in/sign-up page instead of the dashboard.

### 2. Update Dashboard to show real user data (`src/pages/Dashboard.tsx`)
- Import `useAuth` and retrieve the authenticated user's display name and email.
- Replace the hardcoded `userProfile.name` reference with the actual user's display name (from `user.user_metadata.display_name`) or email as fallback.

### 3. Update Header "Sign In" behavior
- Already correct — links to `/auth`. No change needed.

## Technical Details

- The `ProtectedRoute` wrapper on `/dashboard` works correctly: it redirects unauthenticated users to `/auth`. The issue is specifically that the CTA button bypasses the intended flow by linking directly to `/dashboard`, and when a session exists, the placeholder "Alex Chen" data appears.
- The dashboard welcome message on line 50 currently reads: `Welcome back, {userProfile.name.split(" ")[0]}!` — this will be changed to use the real authenticated user's name.

