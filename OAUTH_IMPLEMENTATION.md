# 🛡️ RoyalPropertyFinder - Google OAuth 2.0 Integration Guide

This document outlines the complete story of how Google OAuth 2.0 is implemented within the **RoyalPropertyFinder** application, from clicking the button on the frontend to the database storage on the backend.

---

## 📦 1. Packages Used & Why They Were Chosen

To implement the OAuth flow, the backend uses two primary packages:

1. **`passport`**:
   - **Why?** Passport is the gold standard Node.js authentication middleware. It is highly modular and allows us to easily plug in different authentication "strategies" (e.g., local Email/Password, Google, Facebook, Apple) using the same consistent API without rewriting core logic.
2. **`passport-google-oauth20`**:
   - **Why?** This is the specific "plugin" strategy for Passport that handles the complex Google OAuth 2.0 protocol. It abstracts away the heavy lifting of signing requests, exchanging authorization codes for access tokens, and fetching user profile data from Google APIs.

---

## 🛤️ 2. The Complete User Journey (Step-by-Step)

Here is exactly what happens when a user decides to log in using Google.

### Step 1: The User Clicks "Continue with Google" (Frontend)

When the user clicks the Google login button inside `LoginModal.tsx`, it does **not** trigger a standard React API fetch. Instead, it is a direct anchor link (`<a href="http://localhost:5000/api/v1/auth/google">`).
This forces the browser to leave the React app entirely and navigate to the backend.

### Step 2: The Backend Initial Request (`auth.route.ts`)

The request hits the Express router at `GET /api/v1/auth/google`.

```typescript
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
```

Here, Passport intercepts the request. Because of the scopes (`profile`, `email`), Passport constructs a secure URL and **redirects the user's browser directly to Google's consent screen**.

### Step 3: Google Consent & Callback

The user logs into their Google account and clicks "Allow".
Google then redirects the user's browser _back_ to our backend at our pre-configured Callback URL (`/api/v1/auth/google/callback`), attaching a temporary "Authorization Code" in the URL.

### Step 4: Token Exchange & Profile Fetching

Our backend catches this redirect.

```typescript
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleOAuthCallback,
);
```

Behind the scenes, the `passport-google-oauth20` package immediately grabs that Authorization Code, makes a secure server-to-server request to Google, and exchanges it for an Access Token and the user's Google Profile (Name, Email, Profile Picture).

### Step 5: Database Logic & User Reconciliation (`passport.ts`)

With the Google profile data in hand, the code fires the verify callback configured inside `passport.ts`:

1. **Existing Google User?** It checks the DB (`User.findOne({ googleId })`). If found, it returns the user to log them in.
2. **Existing Email User?** If they don't have a `googleId` but they signed up previously using Email/Password, the backend finds the matching email, links the `googleId` to their account seamlessly, and logs them in.
3. **Brand New User?** If the email is completely new, the backend creates a brand new document in MongoDB dynamically mapping Google's display name, email, and photo to our schema with `authProvider: "google"`.

The resulting `user` object is successfully attached to the Express request object (`req.user`).

### Step 6: Stateless JWT Generation & HttpOnly Cookie (`auth.controller.ts`)

Because this is a modern stateless application, we **do not use Express Sessions** mapping to local server memory.
The request flows into `authController.googleOAuthCallback`:

1. We generate a custom JWT using the user's MongoDB `_id`.
2. To keep the app highly secure against Cross-Site Scripting (XSS), the token is inserted into an **HttpOnly Cookie** (`res.cookie('token', token)`). The frontend cannot read this cookie via JS, but the browser will automatically attach it to all future API calls.
3. Finally, the backend executes `res.redirect("http://localhost:3000/")` to send the user back to the React app.

### Step 7: Frontend Rehydration

The user lands fully back on the Next.js frontend frontend homepage.

1. The app mounts, and a passive background request triggers to `GET /api/v1/auth/me`.
2. The browser automatically attaches the newly acquired HttpOnly cookie containing the JWT.
3. The backend validates the JWT, decodes the User ID, fetches the user from MongoDB, and returns the full User object to the frontend.
4. Redux captures this data, updates the global `isAuthenticated` state, and the UI dynamically re-renders to show the User's avatar in the Navbar natively!

---

### Summary Diagram

`Frontend Button Click` ➔ `Backend /auth/google` ➔ `Google Consent Screen` ➔ `Backend /callback` ➔ `Passport fetches Profile` ➔ `DB Search/Create Module` ➔ `Generate JWT` ➔ `Set HttpOnly Cookie` ➔ `Redirect to Frontend` ➔ `Frontend /me fetches real User data` ➔ **AUTHENTICATED!**
