# Taply — Product Requirements Document

**Version:** 1.0  
**Author:** Taply Team  
**Status:** Draft  
**Last Updated:** April 2026  
**Platform:** React Native (Expo) — iOS & Android + Web (Expo Router)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users](#4-target-users)
5. [User Personas](#5-user-personas)
6. [Scope — In & Out](#6-scope--in--out)
7. [Information Architecture](#7-information-architecture)
8. [User Flows](#8-user-flows)
9. [Feature Specifications](#9-feature-specifications)
10. [Data Models](#10-data-models)
11. [API & Integrations](#11-api--integrations)
12. [Security & Privacy](#12-security--privacy)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Tech Stack](#14-tech-stack)
15. [Screens Reference](#15-screens-reference)
16. [Error States & Edge Cases](#16-error-states--edge-cases)
17. [Open Questions](#17-open-questions)
18. [Appendix — Resume Talking Points](#18-appendix--resume-talking-points)

---

## 1. Overview

**Taply** is a mobile-first digital business card app built for developers, students, and professionals. Users build a live profile, receive a unique QR code, and share it at networking events, hackathons, interviews, and career fairs. Anyone who scans the QR opens a live web profile in their browser — no app download required on the recipient's side. Profile updates reflect instantly on every past scan.

### Elevator Pitch

> "Your business card, but alive. Update it once — every QR ever shared updates automatically."

---

## 2. Problem Statement

### Current Pain Points

| Pain Point | Today's Workaround | Why It Fails |
|---|---|---|
| Paper cards go stale | Reprint cards | Expensive, wasteful, slow |
| Contact info changes | WhatsApp everyone | Manual, incomplete reach |
| No analytics on interest | None | Can't tell who's genuinely interested |
| Sharing across platforms | Copy-paste links manually | High friction |
| No single link to all profiles | Multiple URLs | Scattered, hard to remember |

### Core Insight

The exchange of contact information at professional events is a solved ritual — but the tool (paper card) is broken. The replacement doesn't need to reinvent the ritual, it just needs to make the card alive and shareable via the one thing everyone already has: a phone camera.

---

## 3. Goals & Success Metrics

### Product Goals

- Let any user go from sign-up to shareable QR in under **3 minutes**
- Make the public profile load in under **1.5 seconds** on a 4G connection
- Work without internet on the sender side (QR display works offline)
- Require zero app install on the recipient side

### Success Metrics (MVP)

| Metric | Target |
|---|---|
| Time to first QR generated | < 3 minutes from sign-up |
| Profile public page load time | < 1.5s on 4G |
| Day-7 retention | > 40% |
| Scan-to-profile-view conversion | > 85% (scans that successfully load the profile) |
| Crash-free sessions | > 99% |

---

## 4. Target Users

### Primary

- **CS/engineering students** attending hackathons, college fests, placement drives
- **Early-career developers** at networking events, tech meetups
- **Freelancers** who meet clients in person and want a quick professional handoff

### Secondary

- **Professionals** replacing paper cards at conferences
- **Creators** who want a single shareable link to all their online presence

---

## 5. User Personas

### Persona A — Arjun, Final Year CS Student

- Age: 21, Tier-1 engineering college
- Attends 3–4 hackathons per semester
- Has GitHub, LinkedIn, a portfolio site, and a resume PDF
- Pain: Sharing all four links every time he meets a recruiter is awkward
- Goal: One QR they can scan → they see everything

### Persona B — Priya, Junior Developer at a Startup

- Age: 24, 1.5 years experience
- Attends product and tech meetups in her city
- Her LinkedIn URL, phone, and job title change every 12–18 months
- Pain: Paper cards are already wrong by the time she hands them out
- Goal: A card that's always current, always shareable

---

## 6. Scope — In & Out

### In Scope (MVP — 2 weeks)

- Email/password authentication with persistent session
- Profile builder: name, bio, pronouns, avatar, up to 8 links
- QR code generation pointing to live public profile URL
- Public web profile (no-app-needed, opens in any browser)
- Share QR as image, copy link to clipboard, save to photos
- Card themes: 4 presets (light, dark, warm, accent)
- Scan analytics: total scans, device breakdown, recent scan timestamps, approximate city
- Onboarding flow (3 screens, shown once)

### Out of Scope (MVP)

- Social login (Google/Apple) — post-MVP
- NFC tap-to-share — post-MVP
- Multiple cards per user — post-MVP
- In-app QR scanner (to save others' cards) — post-MVP
- Paid/premium tier — post-MVP
- Team/company shared cards — future

---

## 7. Information Architecture

```
Taply App
├── Auth
│   ├── Onboarding (3 screens, first launch only)
│   ├── Sign Up
│   └── Log In
│
├── Home Tab — "My Card"
│   ├── QR Display Screen
│   ├── Share / Save / Copy actions
│   └── Theme selector
│
├── Profile Tab — "Edit Profile"
│   ├── Avatar upload
│   ├── Name, bio, pronouns
│   ├── Links manager (add / reorder / delete)
│   └── Preview mode (simulates public profile)
│
├── Analytics Tab — "Insights"
│   ├── Total scans (count-up animation)
│   ├── Scans this week vs last week
│   ├── Device breakdown chart (mobile / desktop)
│   ├── City breakdown
│   └── Recent scans list (timestamp + device)
│
└── Settings
    ├── Change username
    ├── Change email / password
    ├── Delete account
    └── Log out

Public Web Route (no auth)
└── /u/[username]
    ├── Avatar, name, bio
    ├── Links (tappable)
    └── "Get Taply" footer CTA
```

---

## 8. User Flows

### 8.1 — New User Onboarding Flow

```
App Launch
    │
    ▼
First time? ──YES──► Onboarding Screen 1 (What is Taply)
                          │
                          ▼
                     Onboarding Screen 2 (How to share)
                          │
                          ▼
                     Onboarding Screen 3 (Customize your card)
                          │
                          ▼
                     Sign Up Screen
                          │
                     [Email + Password + Username]
                          │
                     Username available? ──NO──► Show inline error
                          │YES
                          ▼
                     Profile created in Supabase
                          │
                          ▼
                     Home — QR Screen (empty state with prompt to fill profile)
    │
    ▼
Returning user? ──► Check session in SecureStore ──► Auto-login ──► Home
```

### 8.2 — Profile Build Flow

```
Edit Profile Tab
    │
    ▼
Tap avatar area ──► expo-image-picker opens
    │                    │
    │              Pick from gallery OR take photo
    │                    │
    │              expo-image-manipulator resizes to 400×400, quality 0.8
    │                    │
    │              Upload to Supabase Storage (avatars bucket)
    │                    │
    │              Store public URL in profile row
    │
    ▼
Fill name (required), bio (optional, max 120 chars), pronouns (optional)
    │
    ▼
Add links:
    Each link has:
    - Label (GitHub / LinkedIn / Portfolio / Resume / Custom)
    - URL (validated on save)
    Max 8 links. Drag to reorder.
    │
    ▼
Tap Save ──► Upsert to Supabase profiles table
    │
    ▼
Success toast ──► "Your card is live"
```

### 8.3 — QR Share Flow

```
Home (My Card) Tab
    │
    ▼
QR code rendered (react-native-qrcode-svg)
QR encodes: https://Taply.app/u/{username}
    │
    ├──► Tap "Share" ──► react-native-view-shot captures card as PNG
    │                         │
    │                    Expo Sharing sheet opens (WhatsApp, iMessage, etc.)
    │
    ├──► Tap "Save" ──► Request expo-media-library permission (if not granted)
    │                         │
    │                    Save PNG to camera roll
    │
    └──► Tap "Copy link" ──► expo-clipboard copies profile URL
                                   │
                              Toast: "Link copied"
```

### 8.4 — Recipient Scan Flow (No App Required)

```
Recipient opens camera app on their phone
    │
    ▼
Points at Taply QR code
    │
    ▼
Camera auto-detects QR ──► Opens browser
    │
    ▼
GET https://Taply.app/u/{username}
    │
    ▼
Expo Router web route renders public profile
    │
    ▼
[Background] Supabase Edge Function logs scan:
    - profile_id
    - timestamp
    - user-agent (device type)
    - approximate city via IP geolocation
    │
    ▼
Recipient sees: avatar, name, bio, all links as tappable buttons
    │
    ▼
Taps any link ──► Opens in browser
```

### 8.5 — Analytics Flow

```
User opens Insights tab
    │
    ▼
App fetches from scans table WHERE profile_id = current user
    │
    ▼
Renders:
    - Total scan count (animates count-up on mount)
    - This week vs last week comparison
    - Pie/bar chart: Mobile vs Desktop
    - List: City | Device | Time (most recent 20)
    │
    ▼
Pull to refresh ──► Re-fetch from Supabase
```

---

## 9. Feature Specifications

### 9.1 Authentication

| Property | Detail |
|---|---|
| Method | Email + password via Supabase Auth |
| Session storage | `expo-secure-store` as Supabase storage adapter |
| Session persistence | User stays logged in across app restarts |
| Username | Chosen at sign-up, stored in `profiles.username`, unique constraint enforced |
| Password rules | Min 8 chars (Supabase default) |
| Forgot password | Email reset via Supabase `resetPasswordForEmail` |

**Edge cases:**
- Username already taken → inline error before form submit (debounced real-time check)
- Invalid email format → inline error
- Network error on sign-up → show retry toast, do not clear form

---

### 9.2 Profile Builder

| Field | Type | Constraints |
|---|---|---|
| Display name | Text | Required, max 60 chars |
| Username | Text | Required, unique, lowercase, alphanumeric + underscore, 3–20 chars |
| Bio | Text | Optional, max 120 chars with live character counter |
| Pronouns | Text | Optional, max 30 chars |
| Avatar | Image | Optional, compressed to 400×400px JPEG at 0.8 quality before upload |
| Links | Array of {label, url} | Max 8 links, URL validated with regex |
| Theme | Enum | light / dark / warm / accent |

**Link labels (predefined):** GitHub, LinkedIn, Portfolio, Resume PDF, Twitter/X, Instagram, YouTube, Custom

**Link ordering:** Drag-to-reorder using `react-native-draggable-flatlist`. Order persisted as array index in JSONB column.

---

### 9.3 QR Code Generation

- Library: `react-native-qrcode-svg`
- Encoded value: `https://Taply.app/u/{username}`
- Error correction level: **M** (15% recovery — good balance of density and reliability)
- QR size on screen: 240×240dp (centered)
- QR colors adapt to selected card theme:
  - Light theme: black QR on white
  - Dark theme: white QR on dark surface
  - Warm/accent: theme foreground color QR on theme background
- QR is rendered as SVG — no rasterization artifacts at any zoom level
- QR is valid as soon as username is set, even if profile is incomplete

---

### 9.4 Card Themes

| Theme ID | Background | QR Color | Text Color | Button Style |
|---|---|---|---|---|
| `light` | #FFFFFF | #111111 | #111111 | Outlined dark |
| `dark` | #111111 | #FFFFFF | #FFFFFF | Outlined light |
| `warm` | #FDF6EC | #7C5C3E | #3D2B1F | Filled warm |
| `accent` | #EEF2FF | #4F46E5 | #1E1B4B | Filled indigo |

Theme is saved to the `profiles.theme` column on selection (no separate save tap needed).

---

### 9.5 Public Web Profile

- Route: `app/u/[username].tsx` in Expo Router
- Rendered as a web page, visible in any browser without authentication
- Data fetched server-side from Supabase using the username param
- If username not found → render a "Card not found" page with CTA to create own card
- Layout:
  - Avatar (circular, 80px) centered at top
  - Display name (20px, bold)
  - Pronouns (if set, 13px, muted)
  - Bio (14px, centered, max 3 lines)
  - Link buttons stacked vertically (full width, 48px tap target)
  - Footer: "Made with Taply" with link to app
- On every page load, trigger a scan log (see 9.6)
- Meta tags: `og:title`, `og:description`, `og:image` (avatar URL) for link previews when shared on WhatsApp/Slack

---

### 9.6 Scan Analytics

**What gets logged on each profile page load:**

| Field | Source | Storage |
|---|---|---|
| `profile_id` | URL param lookup | Supabase scans table |
| `scanned_at` | Server timestamp | Supabase scans table |
| `device_type` | User-agent string parsing | Supabase scans table |
| `city` | IP → Edge Function → ipapi.co | Supabase scans table |

**Implementation note:** The city lookup must happen server-side in a Supabase Edge Function. Do NOT call ipapi.co from the client — this would expose the user's IP to a third party unnecessarily and also exposes your API key.

**Analytics screen widgets:**
- Total scans: animated count-up number (Reanimated)
- This week: count + delta vs last week (green up / red down)
- Device chart: horizontal bar (Victory Native) — Mobile % vs Desktop %
- Recent scans: FlatList — city | device type | relative time ("2 hours ago")
- Empty state: illustrated empty state with copy "Share your QR to start seeing scans"

---

### 9.7 Share & Export

| Action | Implementation | Notes |
|---|---|---|
| Share as image | `react-native-view-shot` → `expo-sharing` | Captures the QR card view as PNG, triggers native share sheet |
| Save to photos | `expo-media-library` | Requests permission first; graceful denial handling |
| Copy link | `expo-clipboard` | Copies `https://Taply.app/u/{username}` |
| Share link text | `expo-sharing` with text | "Check out my Taply: https://Taply.app/u/username" |

---

### 9.8 Onboarding

- 3 screens shown on first app launch only
- Completion stored in `expo-secure-store` as `onboarding_complete: true`
- Can be re-triggered from Settings > "View intro" (useful for demoing)
- Screens:
  1. "Your card, always current" — illustrate QR + profile concept
  2. "Share in seconds" — show the share flow visually
  3. "Watch who's interested" — tease the analytics feature
- Each screen: full-bleed illustration area (top 60%), copy (bottom 40%), Next/Get Started CTA

---

## 10. Data Models

### Table: `profiles`

```sql
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  name        text not null,
  bio         text,
  pronouns    text,
  avatar_url  text,
  links       jsonb default '[]'::jsonb,
  theme       text default 'light',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

**Links JSONB structure:**
```json
[
  { "id": "link_1", "label": "GitHub", "url": "https://github.com/username", "order": 0 },
  { "id": "link_2", "label": "Portfolio", "url": "https://mysite.dev", "order": 1 }
]
```

---

### Table: `scans`

```sql
create table scans (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  scanned_at  timestamptz default now(),
  device_type text,       -- 'mobile' | 'desktop' | 'unknown'
  city        text,       -- from ipapi.co via Edge Function
  user_agent  text
);
```

---

### Supabase Storage: `avatars` bucket

- Public read: yes (anyone can view avatars via public URL)
- Write: authenticated users only, to their own path (`{user_id}/avatar.jpg`)
- Max file size: 2MB (enforced in bucket policy)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

---

### Row Level Security Policies

```sql
-- Profiles: anyone can read, only owner can write
alter table profiles enable row level security;

create policy "public read profiles"
  on profiles for select using (true);

create policy "owner can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "owner can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Scans: only owner can read their own scans, server-only inserts
alter table scans enable row level security;

create policy "owner reads own scans"
  on scans for select using (
    profile_id in (select id from profiles where id = auth.uid())
  );

-- Inserts handled by Edge Function using service_role key (bypasses RLS)
```

---

## 11. API & Integrations

### Supabase

| Feature | Supabase Service |
|---|---|
| Auth | `supabase.auth.signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail` |
| Profile CRUD | `supabase.from('profiles').upsert(...)` |
| Scan logging | Edge Function with `service_role` key to insert to `scans` |
| Analytics fetch | `supabase.from('scans').select(...)` with filters |
| Avatar storage | `supabase.storage.from('avatars').upload(...)` |
| Username check | `supabase.from('profiles').select('id').eq('username', val)` |

### ipapi.co (via Edge Function)

- Used for: city-level geolocation from scan IP
- Called from: Supabase Edge Function only (server-side)
- Endpoint: `https://ipapi.co/{ip}/json/`
- Free tier: 1,000 requests/day — sufficient for MVP
- Failure handling: if lookup fails, store city as `null` — do not block scan logging

### Vercel (Web Deployment)

- Deploy the Expo web export to Vercel
- Custom domain: `Taply.app` (or free `.vercel.app` subdomain for MVP)
- The `/u/[username]` route must be server-side rendered or statically regenerated to support og:image meta tags

---

## 12. Security & Privacy

### Key Rules

- API keys stored in `.env`, never committed to git (add to `.gitignore` on Day 1)
- Supabase anon key is safe for client use — it is restricted by RLS policies
- `service_role` key used only in Edge Functions (server-side), never shipped in the app bundle
- Avatars are public but tied to a Supabase Storage path that doesn't expose user IDs in a guessable way

### Privacy Considerations

- Scan analytics collect approximate city — not precise GPS. This should be disclosed in a one-line privacy note on the settings screen.
- Users can delete their account from Settings. This should cascade-delete their profile, all scans, and their avatar from storage.
- No scan data is shown to the person who was scanned — only to the card owner.

### Username Squatting

- Usernames are first-come-first-served at MVP
- No profanity filter at MVP (add post-launch)
- Reserved usernames list: `admin`, `api`, `u`, `app`, `Taply`, `support` — blocked at sign-up

---

## 13. Non-Functional Requirements

### Performance

| Requirement | Target |
|---|---|
| App cold start to QR visible | < 2 seconds |
| Public profile page load (web) | < 1.5s on 4G |
| QR renders offline | Yes — QR is generated client-side from username |
| Avatar upload time | < 3s for a 400×400 JPEG |
| Analytics tab load | < 1.5s |

### Reliability

- App must not crash on network loss — QR display works fully offline
- Supabase outage: show cached profile data from local state, disable save until reconnected
- If scan logging fails (network/edge function error), fail silently — do not break the profile page load

### Accessibility

- All interactive elements have accessible labels for screen readers
- Color themes all meet WCAG AA contrast ratio (4.5:1) for text on background
- Minimum touch target size: 48×48dp for all buttons
- Font sizes use Expo's `allowFontScaling` default (do not disable)

### Compatibility

| Platform | Minimum Version |
|---|---|
| iOS | 15.0+ |
| Android | API 29 (Android 10+) |
| Web (public profile) | Any modern browser — Chrome 90+, Safari 14+, Firefox 88+ |

---

## 14. Tech Stack

### Mobile App

| Layer | Choice | Reason |
|---|---|---|
| Framework | React Native + Expo SDK 51 | Targets iOS, Android, and Web from one codebase |
| Navigation | Expo Router v3 | File-based routing, enables web routes natively |
| State management | Zustand | Lightweight, no boilerplate, easy to persist with `expo-secure-store` |
| Styling | NativeWind (Tailwind for RN) | Rapid UI, consistent design tokens |
| QR generation | `react-native-qrcode-svg` | SVG-based, renders crisply at all sizes |
| Image picker | `expo-image-picker` | Expo-managed permissions, works on all platforms |
| Image compression | `expo-image-manipulator` | Resize + quality compress before upload |
| Screen capture | `react-native-view-shot` | Captures QR card view as a PNG for sharing |
| Sharing | `expo-sharing` | Native share sheet on iOS and Android |
| Clipboard | `expo-clipboard` | Copy link to clipboard |
| Media library | `expo-media-library` | Save QR image to camera roll |
| Secure storage | `expo-secure-store` | Store auth session and onboarding flag |
| Animations | `react-native-reanimated` v3 | Smooth count-up animations in analytics |
| Charts | Victory Native | Analytics charts (bar, pie) |

### Backend

| Layer | Choice | Reason |
|---|---|---|
| Database | Supabase Postgres | Managed, RLS built-in, JSONB for links array |
| Auth | Supabase Auth | Email/password, session management, password reset |
| Storage | Supabase Storage | Avatar hosting with public URL |
| Serverless | Supabase Edge Functions (Deno) | Scan logging with IP geolocation, cron jobs |
| IP geolocation | ipapi.co (free tier) | City-level location from IP for scan analytics |

### Web / Deployment

| Layer | Choice |
|---|---|
| Web routing | Expo Router web routes |
| Deployment | Vercel (free tier) |
| Domain | `Taply.vercel.app` (MVP) |

---

## 15. Screens Reference

| Screen | Route | Auth Required | Description |
|---|---|---|---|
| Onboarding 1–3 | `/onboarding` | No | First-launch tutorial |
| Sign Up | `/auth/signup` | No | Create account |
| Log In | `/auth/login` | No | Existing user login |
| My Card (Home) | `/(tabs)/` | Yes | QR display + share actions |
| Edit Profile | `/(tabs)/profile` | Yes | Profile builder form |
| Insights | `/(tabs)/analytics` | Yes | Scan analytics dashboard |
| Settings | `/(tabs)/settings` | Yes | Account + preferences |
| Public Profile | `/u/[username]` | No | Web-only — recipient view |
| Not Found | `/u/[username]` (404) | No | Username doesn't exist |

---

## 16. Error States & Edge Cases

| Scenario | Handling |
|---|---|
| Username taken at sign-up | Debounced check while typing — "username taken" inline error before submit |
| Invalid URL in link builder | Red border + "Enter a valid URL (include https://)" on blur |
| Avatar upload fails | Toast: "Upload failed — tap to retry". Profile saves without avatar. |
| No internet — QR screen | QR still renders (it's generated client-side). Save/share buttons work normally. Profile update disabled with "You're offline" banner. |
| No internet — analytics | Show cached data with "Last updated X ago" label. No error screen. |
| Scan logging fails | Silent fail on the public profile page — do not show error to recipient |
| User deletes account | Cascade delete: profiles row → all scans rows → avatar from Storage → auth.users row |
| Bio over 120 chars | Input stops accepting characters at 120. Counter turns red at 100. |
| More than 8 links | "Add link" button becomes disabled. "8 link maximum reached" tooltip. |
| Profile page — username not found | Friendly 404: "This card doesn't exist yet." + "Create your own Taply" CTA |
| City lookup fails (ipapi.co down) | Store `city = null`. Analytics shows "Unknown" for that scan. Do not retry. |

---

## 17. Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Should the public profile support custom domains (e.g. card.mysite.com)? | Product | Post-MVP |
| 2 | Should scan analytics show a 30-day rolling window or all-time? | Product | Decide before Day 9 |
| 3 | Should usernames be case-insensitive? (e.g. ArjunSingh and arjunsingh = same) | Engineering | Recommend: store lowercase only |
| 4 | Do we need email verification before profile goes live? | Product | Recommend: skip for MVP |
| 5 | What happens to the public profile after account deletion? Instant 404? | Engineering | Recommend: instant 404 |

---

## 18. Appendix — Resume Talking Points

Once built, use these bullet points on your resume and in interviews:

**What to say you built:**
- Developed a live QR digital business card app in React Native Expo where profile updates propagate instantly to all past scans via Supabase real-time data
- Designed and implemented Row Level Security (RLS) policies in Supabase Postgres ensuring users can only access their own scan analytics while public profiles remain unauthenticated
- Built a scan analytics pipeline using Supabase Edge Functions for server-side IP geolocation, storing device type and city data per scan without exposing user IPs to the client
- Implemented avatar upload pipeline with client-side compression via expo-image-manipulator, Supabase Storage with scoped bucket policies, and public CDN URL generation
- Deployed a cross-platform app targeting iOS, Android, and Web from a single Expo Router codebase, with the public profile route live on Vercel

**Likely interview questions this project prepares you for:**
- "How did you handle authentication and session persistence in React Native?"
- "Walk me through your database schema — why did you choose JSONB for links?"
- "How does your QR code work if the user is offline?"
- "What is Row Level Security and why did you use it?"
- "How did you make sure API keys weren't exposed in your mobile app?"

---

*End of Taply PRD v1.0*