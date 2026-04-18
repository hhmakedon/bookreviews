# 📚 Mr. Makedon’s Book Reviews

A Next.js (App Router) application for publishing and managing book reviews, powered by Firebase Authentication and Cloud Firestore.

The site is statically exported for hosting on GitHub Pages.  
Public users can view all published reviews, while only an authorized account can create or edit content.

## ✨ Features

- Publicly accessible book reviews
- Admin-only content creation and editing
- Reviews sorted in descending rating order (highest-rated first)
- Static export for lightweight, fast hosting

## 🧱 Tech Stack

- Next.js (App Router)
- Firebase Authentication
- Cloud Firestore
- GitHub Pages

## 📖 Review Schema

Each review includes:

- `title`
- `author`
- `rating`
- `review`

## 🔐 Access Control

- All published reviews are publicly readable
- Write access is restricted to a single authorized Firebase Authentication user
- Firestore security rules enforce access restrictions

## 📝 Notes

- Designed for static hosting with client-side Firebase access
- Public users read directly from Firestore
- Admin functionality depends on Firebase Authentication and Firestore rules

## 🔒 Security And Billing

- No Firebase Admin private keys or service account files are committed to the repository
- The Firebase web config is not hardcoded in the codebase and must be provided through `.env.local` for local development and GitHub repository variables for GitHub Pages builds
- The seed script requires `SEED_USER_PASSWORD` from your local environment instead of storing a default password in the repo
- Firestore rules should stay limited to the `reviews` collection so random users cannot write data
- Set Firebase budget alerts in Google Cloud if you want an extra safeguard against unexpected usage

## ⚙️ Local Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the Firebase web config values and Firebase Admin values
3. Enable Email/Password authentication in Firebase Auth
4. Create a Firestore database
5. Publish the rules from `firestore.rules`
6. Set `SEED_USER_PASSWORD` in `.env.local`
7. Run `npm run seed:user`
8. Run `npm run dev`

## 🚀 GitHub Pages Deployment

1. Add these repository variables in GitHub:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
2. In GitHub, open `Settings > Pages`
3. Set `Source` to `GitHub Actions`
4. Push to `main`
