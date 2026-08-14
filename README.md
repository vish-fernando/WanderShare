# WanderShare 🌍✈️

A family-friendly travel community website where real explorers share travel stories, photos and videos.

## Pages
- **Home** - hero, stats, recent adventures, top members
- **Inspire Me** - random destination inspiration
- **Explore** - community feed with filters, search and a live world map
- **Countries** - country directory with capitals and community stories
- **Community** - share a trip (photos + optional MP4 video)
- **Profile** - sign in with Google; your posts, saved locations and personal world map

## Tech
- Static HTML/CSS/JS (no build step)
- Firebase Authentication (`wandershare-dc628`)
- Firebase Firestore - shared posts + photos across all devices (free Spark plan)
- Leaflet + globe.gl for maps
- Optional Groq-powered AI chat via a Cloudflare Worker

## Deploy (GitHub Pages)
1. Push this repo to GitHub (or upload the files).
2. Repo **Settings → Pages → Source: Deploy from a branch → `main` → `/ (root)`**.
3. In Firebase Console → Authentication → **Authorized domains**, add:
   - `<your-username>.github.io`
   - `<your-username>.github.io/<repo-name>` (if using a project site)
4. The site is live at `https://<your-username>.github.io/<repo-name>/`.

## Firebase setup (one-time, free)
1. Console → Firestore Database → **Create database** → **Test mode** → Enable.
2. Firestore → **Rules** → paste and Publish:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    match /reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```
3. Authentication → **Authorized domains**: add `localhost` and `<your-username>.github.io`.
4. No Storage needed - photos are stored directly inside Firestore (free).

## AI chat (optional)
The chat works out of the box with built-in rules. For real AI answers:
1. Deploy `chat-worker.js` to Cloudflare Workers.
2. Add the secret: `npx wrangler secret put GROQ_API_KEY` (key stays secret - never commit it).
3. Put your worker URL in `groq-config.js` → `proxyUrl`.

## Privacy
Posts marked "public" sync to Firestore for everyone. "Only me" and "Followers" posts stay private in the browser.

© 2026 WanderShare · All rights reserved. Created & owned by Hashen Fernando.
