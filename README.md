# Mr. Makedon's Book Reviews

A GitHub Pages-ready Next.js site backed by Firebase Auth and Firestore. The public can read every published review, and only the `Makedon` account can add or edit posts.

- `title`
- `author`
- `rating`
- `review`

Reviews are rendered in descending rating order so the best books stay at the top.

## Stack

- Next.js App Router
- Firebase Auth in the browser
- Firestore in the browser
- GitHub Pages static export

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Create a Firebase project.
3. Enable Email/Password authentication in Firebase Auth.
4. Create a Firestore database.
5. Set the Firestore rules from `firestore.rules`.
6. Run `npm run seed:user` to create or update the single allowed login user.
7. Run `npm run dev`.

## Environment variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
AUTHORIZED_USERNAME=Makedon
AUTHORIZED_EMAIL=makedon@bookreviews.local
SEED_USER_PASSWORD=iamsocool1
```

## Notes

- The default seeded login is `Makedon` with the password from `SEED_USER_PASSWORD`.
- The repository already includes the public Firebase web config for the `bookreview-13f32` project, so the site can be built on GitHub Pages without private runtime secrets.
- Public visitors can read reviews directly from Firestore.
- Only the `makedon@bookreviews.local` Firebase Auth user can create or update reviews when the provided Firestore rules are applied.
- Do not commit `.env.local` or your Firebase service account credentials.

## GitHub Pages

- Push to the `main` branch.
- In GitHub, open `Settings > Pages`.
- Set `Source` to `GitHub Actions`.
- The included workflow at `.github/workflows/deploy-pages.yml` will build and publish the static export automatically.

## GitHub

```bash
git remote add origin <your-github-repo-url>
git add .
git commit -m "Build Mr. Makedon's Book Reviews"
git push -u origin main
```
