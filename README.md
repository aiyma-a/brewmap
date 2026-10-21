# Brewmap

Artisanal coffee shop finder for Kyrgyzstan (Bishkek, Kant and beyond). React + Vite + Tailwind, deployed to GitHub Pages.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `GOOGLE_MAPS_PLATFORM_KEY`
3. `npm run dev`

## Deploy
Every push to `main` builds and deploys via `.github/workflows/deploy.yml`.
The Maps key comes from the repo secret `GOOGLE_MAPS_PLATFORM_KEY`.
It ends up in the public page, so restrict it by HTTP referrer in Google Cloud.

## Error tracking (optional)
Create a free project at sentry.io (platform: React), then add its DSN as the repo secret `SENTRY_DSN`.
Without it, nothing is sent. Before enabling, update `public/privacy.html` to mention Sentry.

## Tests
`npm test` runs the unit tests (distance and shop filtering). CI runs them before every deploy.
