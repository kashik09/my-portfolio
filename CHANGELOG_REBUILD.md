# CHANGELOG_REBUILD

## Summary
- Removed the logged-in dashboard strip from the public landing so the cinematic flow stays consistent.
- Rebuilt featured work into a full-bleed, 100dvh scrollytelling sequence with crossfade melt and reduced-motion support.
- Normalized project thumbnail paths to be Vercel-safe and consistently public.

## Files touched
- app/(main)/page.tsx
- components/home/FeaturedWorkStory.tsx
- components/home/ProofSnapshot.tsx
- lib/utils.ts
- app/api/projects/route.ts
- app/api/projects/featured/route.ts
- lib/portfolio/types.ts

## Thumbnails
- Store project thumbnails under `public/uploads/projects/` (or `public/projects/`).
- Persist URLs as public paths like `/uploads/projects/<file>.png` or `/projects/<file>.png`.
- Absolute filesystem paths or `public/...` prefixes are normalized to public URLs via `normalizePublicPath`.

## Config / Env
- No new env vars or Next.js config changes are required for this update.
