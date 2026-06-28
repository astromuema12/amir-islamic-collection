<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deployment
- Before deploying to Vercel, ensure `git config user.email` matches your GitHub account email (`musauedwin2004@gmail.com`).
- Commits with unmatched emails will be blocked by Vercel.

## Legal Pages
- `/terms` (existing), `/privacy` (existing), `/account-deletion` (added) — all follow the same pattern: server component, `sections` array with `{id, title, icon, content}`, two-column layout with sticky sidebar nav on desktop, hero with gradient bg and breadcrumbs.
- SEO metadata is exported from each page (title, description, openGraph with canonical URL).
- Add new legal pages by copying the pattern from `src/app/account-deletion/page.tsx`.

## Category Icons
- `CATEGORIES` in `src/lib/constants.ts` uses emoji strings by default, but any entry can have an image URL as `icon`.
- Renderers in `featured-categories.tsx` and `mobile-nav.tsx` detect `startsWith("http")` to render `<Image>`/`<img>` instead of emoji text.
- Remote image domains must be listed in `next.config.ts` `images.remotePatterns`.
- Niqab icon switched from `🧣👁️` to an image URL from `imgproxy.attic.sh`.

## Account Deletion
- Server action in `src/lib/actions/auth-actions.ts`: `deleteAccount()` — no arguments (uses session).
- Anonymizes the user record (clears PII, randomizes email, removes password) instead of hard-deleting, so order FK references remain intact. Orders retain `userId` pointing to anonymized user.
- Deletes cascade-able data: sessions, notifications, wishlists, reviews, seller profiles, cart, addresses.
- Clears session cookie, revalidates `/`, returns `{ success: true }` or `{ error: string }`.
- Settings page at `src/app/(dashboard)/settings/page.tsx` triggers it via `handleDeleteAccount` → `router.push("/")` on success.
- The danger-zone dialog shows deleted vs retained data and links to `/account-deletion`.

## Env Variables (Vercel)
- Only `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` are set in Vercel. The rest (`CLOUDINARY_*`, `PAYSTACK_*`, `RESEND_API_KEY`) are missing — Vercel picks up local `.env` during deploy as fallback (triggers the "strongly recommended to use Vercel's env handling" warning).
- Add missing env vars to https://vercel.com/astromuema12s-projects/amir-islamic-collection/settings/environment-variables
