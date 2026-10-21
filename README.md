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
