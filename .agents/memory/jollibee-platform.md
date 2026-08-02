---
name: Jollibee Platform Setup
description: Key decisions, countries, settings, DB quirks for the ALLAN investment platform (formerly TREK).
---

# ALLAN Investment Platform

## Branding
- Platform name: **ALLAN Construction** (was TREK)
- Primary color: `#1B4FA0` (Allan blue) for headers/nav elements
- Gold/amber: `#F5C518 → #F59E0B → #D97706` gradient — used for all buttons, cards, CTAs
- Purple gradient: `#7B2FBE → #5B1A9B` — used for home, team, account background pages
- Warm beige: `#FFF5EE → #FAF0E0` — used for withdrawal, history, facture pages
- Logo: `attached_assets/allan_logo.jpg`

## DB / Settings
- `platform_settings` table (NOT `settings`)
- `server/seed.ts` force-updates key values every restart: minDeposit=5000, minWithdrawal=2000, withdrawalFees=20, signupBonus=200
- 9 VIP products (VIP 1–9) with 30-day cycles
- Reviews table: `reviews` (added manually, NOT in drizzle schema push)

## Countries
- Active: Tchad (TD), Niger (NE), Centrafrique (CF)
- Platform intended for Niger only — Tchad and Centrafrique should be deactivated

## Image uploads
- All images stored as base64 strings in `text` columns (no S3/Cloudinary)
- `deposit.screenshot`, `review.images` (JSON array)

## Routes / Pages redesigned (gold/beige theme)
- `/commande` → MyProductsPage (warm cream cards, gold accents)
- `/avis` → AvisPage (black header, gold tabs, gold upload button)
- `/team` → TeamPage (purple bg, gold cards)
- `/account` → AccountPage (purple bg, gold cards)
- `/service` → ServicePage (purple bg, banner, gold "Début" buttons)
- `/about` → AboutPage (white, simple text)
- `/history` → HistoryPage (beige bg, white cards)
- `/wallet` → WalletPage (white, blue balance card, gold buttons)
- `/change-password` → ChangePasswordPage (white, gold button)
- `/withdrawal-history` → WithdrawalHistoryPage (beige bg, white cards)
- `/deposits-history` → DepositHistoryRealPage (beige bg, white cards)
- `/withdrawal` → WithdrawalPage (beige bg, gold balance card, wallet selector pills)

## Avis feature
- DB table `reviews` created manually via SQL (reviews in shared/schema.ts but push not run)
- POST /api/reviews — submit, GET /api/reviews — approved list
- Admin approves → +50 FCFA bonus auto-credited
- Admin tab "Avis" added to /admin

## Admin credentials
- Phone: 99935673, Country: TG, Password: pagetstudio, PIN: 9993

**Why:** Decisions recorded so future sessions don't redo the same styling work or break DB assumptions.
