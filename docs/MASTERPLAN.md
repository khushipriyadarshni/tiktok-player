# TokTik — Complete Master Plan
### React Intern Assessment · Kamao.ai · March 2026
> A TikTok-inspired short-form video web app built for mobile-first native web experience. Smooth, professional, light-themed. No installation required.

---

## Table of Contents

1. [Project Identity](#1-project-identity)
2. [Design System](#2-design-system)
3. [Technical Stack](#3-technical-stack)
4. [Local Database Architecture](#4-local-database-architecture)
5. [App Architecture & File Structure](#5-app-architecture--file-structure)
6. [Pages & Routes](#6-pages--routes)
7. [Core Features — In Depth](#7-core-features--in-depth)
8. [Video Caching & Preloading](#8-video-caching--preloading)
9. [Haptic Feedback System](#9-haptic-feedback-system)
10. [Profile System](#10-profile-system)
11. [Profile Search](#11-profile-search)
12. [Skeleton Loaders & Feed Animation](#12-skeleton-loaders--feed-animation)
13. [Performance Expectations](#13-performance-expectations)
14. [Hosting & Deployment](#14-hosting--deployment)
15. [Seed Data Specification](#15-seed-data-specification)
16. [Component Inventory](#16-component-inventory)
17. [Custom Hooks Inventory](#17-custom-hooks-inventory)
18. [Context Providers](#18-context-providers)
19. [Interaction & Gesture Map](#19-interaction--gesture-map)
20. [Accessibility Baseline](#20-accessibility-baseline)
21. [Known Trade-offs & Limitations](#21-known-trade-offs--limitations)
22. [Submission Checklist](#22-submission-checklist)

---

## 1. Project Identity

| Property | Value |
|---|---|
| App name | **TokTik** |
| Tagline | *Smooth moments, instantly.* |
| Primary audience | Mobile web users (375px–430px viewport) |
| Experience type | Native-feeling web app, no installation |
| Theme | Light, airy, professional — NOT dark/neon |
| Personality | Calm, clean, minimal chrome, content-first |
| Inspiration | TikTok UX patterns + Notion/Linear visual calm |

TokTik is not a TikTok clone in appearance. It shares the interaction paradigm — vertical swipe, action bar, music disc — but the visual language is its own: soft whites, warm neutrals, subtle shadows, rounded everything, generous whitespace. The app should feel like a premium product, not a copy.

---

## 2. Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FAFAF8` | App background, all screens |
| `--color-surface` | `#FFFFFF` | Cards, sheets, modals |
| `--color-surface-raised` | `#F5F4F0` | Input backgrounds, skeleton base |
| `--color-border` | `#E8E6E0` | Dividers, card borders |
| `--color-text-primary` | `#1A1917` | Headlines, usernames |
| `--color-text-secondary` | `#6B6860` | Captions, counts, meta |
| `--color-text-tertiary` | `#A8A49C` | Placeholders, hints |
| `--color-accent` | `#FF6B6B` | Like heart, active states |
| `--color-accent-soft` | `#FFF0F0` | Like button bg on tap |
| `--color-follow` | `#1A1917` | Follow button fill |
| `--color-shimmer-start` | `#F0EEE8` | Skeleton loader base |
| `--color-shimmer-end` | `#E8E6DE` | Skeleton loader highlight |

### Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Username | Inter | 15px | 600 |
| Caption | Inter | 13px | 400 |
| Count labels | Inter | 12px | 500 |
| Music track | Inter | 12px | 400 |
| Profile name | Inter | 18px | 700 |
| Profile bio | Inter | 14px | 400 |
| Comment text | Inter | 14px | 400 |
| Search input | Inter | 16px | 400 |

Use Inter from Google Fonts. All text is `#1A1917` or `#6B6860` — no pure blacks, no grays below 60% lightness.

### Spacing & Radius

| Token | Value |
|---|---|
| `--radius-sm` | 8px |
| `--radius-md` | 16px |
| `--radius-lg` | 24px |
| `--radius-full` | 9999px |
| Base spacing unit | 4px |
| Action bar gap | 24px between icons |
| Safe area bottom | env(safe-area-inset-bottom) |

### Motion

All animations follow a single easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` for springy feels (like/bookmark pop), and `cubic-bezier(0.4, 0, 0.2, 1)` for directional transitions (feed scroll, sheet slide). Duration ranges: micro = 120ms, standard = 240ms, sheet = 360ms. Never use `ease-in-out` — it feels browser-default and cheap.

---

## 3. Technical Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, ESM native, smallest bundle |
| Routing | React Router v6 | Declarative, nested routes |
| Styling | Tailwind CSS v3 + CSS custom properties | Utility speed + design token flexibility |
| Local DB | Dexie.js (IndexedDB) | Richest API, Promise-based, React hooks |
| Icons | Lucide React | Consistent stroke weight, tree-shakeable |
| Gestures | Custom touch handlers (no library) | Full control, no bloat |
| Video | Native HTML5 `<video>` element only | Assessment requirement |
| State | React Context + useState/useRef/useEffect | No Redux needed at this scale |
| Animation | CSS keyframes + Framer Motion (lightweight) | Sheet transitions + list stagger |
| Fonts | Inter via Google Fonts (self-hosted fallback) | Performance |
| Deployment | GitHub Pages + Railway (or Render) | Free tier, easy CI |

No class components. No jQuery. No react-player or video.js. No Redux.

---

## 4. Local Database Architecture

### Technology: Dexie.js

Dexie wraps IndexedDB with a clean, Promise-based API and supports versioned migrations. It persists data across page reloads in the same browser — perfect for a demo that needs to feel real.

### Schema (Version 1)

#### `profiles` table

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `username` | string | Unique, e.g. `@luna.creates` |
| `displayName` | string | Full display name |
| `bio` | string | Up to 120 characters |
| `avatarUrl` | string | Path to local asset or Pexels URL |
| `followerCount` | number | Initialised from seed |
| `followingCount` | number | Initialised from seed |
| `videoCount` | number | Computed or stored |
| `isVerified` | boolean | Adds a verified badge in UI |
| `joinedAt` | timestamp | ISO string |

#### `videos` table

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `profileId` | string | Foreign key → profiles.id |
| `url` | string | Local `/videos/` path or CDN URL |
| `thumbnailUrl` | string | First-frame poster image |
| `description` | string | Caption text (up to 200 chars) |
| `tags` | string[] | e.g. `["#design", "#calm"]` |
| `musicTitle` | string | e.g. `Original Audio - luna.creates` |
| `likes` | number | Seed count, incremented locally |
| `comments` | number | Seed count |
| `shares` | number | Seed count |
| `bookmarks` | number | Seed count |
| `duration` | number | Seconds |
| `createdAt` | timestamp | ISO string |

#### `interactions` table

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `type` | enum | `like` / `bookmark` / `follow` / `comment_like` |
| `actorProfileId` | string | The active user's profile id |
| `targetId` | string | videoId or profileId depending on type |
| `createdAt` | timestamp | ISO string |

#### `comments` table

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `videoId` | string | FK → videos.id |
| `profileId` | string | FK → profiles.id (commenter) |
| `text` | string | Comment body |
| `likes` | number | Like count on the comment itself |
| `createdAt` | timestamp | ISO string |

### Active User Convention

Since there is no auth, the app picks `profiles[0]` as the "active user" on first load and stores their `id` in `localStorage` under the key `toktik_active_user`. All like/bookmark/follow interactions are attributed to this profile. The active user's profile is the one shown when tapping the bottom nav "Profile" tab.

### DB Context

A single `DBContext` provides the Dexie instance and a set of helper functions to all components. All DB reads/writes go through this context — components never import Dexie directly.

---

## 5. App Architecture & File Structure

```
toktik/
├── public/
│   ├── videos/               ← Local .mp4 sample files (5–8 videos)
│   ├── avatars/              ← Local avatar images
│   ├── thumbnails/           ← Poster frames for each video
│   └── icons/                ← Favicon, apple-touch-icon
│
├── src/
│   ├── main.jsx              ← Vite entry point
│   ├── App.jsx               ← Router + context providers wrapper
│   │
│   ├── db/
│   │   ├── schema.js         ← Dexie DB definition + version migrations
│   │   └── seed.js           ← Seed data: profiles, videos, comments
│   │
│   ├── context/
│   │   ├── DBContext.jsx     ← Dexie instance + helper functions
│   │   ├── AppContext.jsx    ← Active user, mute state, theme
│   │   └── FeedContext.jsx   ← Current index, scroll lock, preloader ref
│   │
│   ├── hooks/
│   │   ├── useVideoFeed.js   ← IntersectionObserver, index tracking
│   │   ├── useVideoPreloader.js ← Sliding window cache
│   │   ├── usePlayer.js      ← Play/pause/seek/mute per video ref
│   │   ├── useInteractions.js ← Like/bookmark/follow DB writes
│   │   ├── useProfile.js     ← Profile reads + follow state
│   │   ├── useComments.js    ← Comment CRUD from DB
│   │   ├── useHaptics.js     ← Vibration API wrapper
│   │   └── useGestures.js    ← Touch events: tap, double-tap, long-press, swipe
│   │
│   ├── pages/
│   │   ├── FeedPage.jsx      ← Main vertical scroll feed
│   │   ├── ProfilePage.jsx   ← Creator profile with video grid
│   │   ├── SearchPage.jsx    ← Profile search with suggestions
│   │   └── SavedPage.jsx     ← Bookmarked videos grid
│   │
│   ├── components/
│   │   ├── feed/
│   │   │   ├── VideoCard.jsx       ← Full-screen video unit
│   │   │   ├── VideoPlayer.jsx     ← HTML5 video + progress bar
│   │   │   ├── ActionBar.jsx       ← Right-side icon stack
│   │   │   ├── UserInfo.jsx        ← Bottom-left username + caption
│   │   │   ├── MusicDisc.jsx       ← Spinning bottom-right disc
│   │   │   └── PlayPauseOverlay.jsx ← Fading center icon on tap
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileHeader.jsx   ← Avatar, stats, follow button
│   │   │   ├── VideoGrid.jsx       ← 3-col thumbnail grid
│   │   │   └── ProfileTabs.jsx     ← Posts / Liked / Saved tabs
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.jsx       ← Input with clear button
│   │   │   └── ProfileSuggestion.jsx ← Suggestion pill/row
│   │   │
│   │   ├── comments/
│   │   │   ├── CommentSheet.jsx    ← Bottom drawer container
│   │   │   ├── CommentList.jsx     ← Scrollable list of comments
│   │   │   ├── CommentItem.jsx     ← Single comment row
│   │   │   └── CommentInput.jsx    ← Sticky input at sheet bottom
│   │   │
│   │   ├── shared/
│   │   │   ├── BottomNav.jsx       ← 4-tab persistent nav bar
│   │   │   ├── Avatar.jsx          ← Circular image with fallback
│   │   │   ├── SkeletonCard.jsx    ← Full-screen shimmer placeholder
│   │   │   ├── SkeletonGrid.jsx    ← 3-col shimmer for profile grid
│   │   │   ├── HeartBurst.jsx      ← Double-tap heart animation
│   │   │   └── VerifiedBadge.jsx   ← Small checkmark icon
│   │   │
│   │   └── overlays/
│   │       └── ShareSheet.jsx      ← Native Web Share API trigger
│   │
│   └── styles/
│       ├── globals.css         ← CSS custom properties + resets
│       ├── animations.css      ← Keyframes (shimmer, burst, spin)
│       └── utilities.css       ← Thin helpers not in Tailwind
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── .env.example
└── README.md
```

---

## 6. Pages & Routes

| Path | Page | Description |
|---|---|---|
| `/` | FeedPage | Main vertical swipe feed |
| `/profile/:id` | ProfilePage | Individual creator profile |
| `/search` | SearchPage | Profile search with suggestions |
| `/saved` | SavedPage | Bookmarked videos grid |

All routes are rendered inside `App.jsx` which wraps everything in the context providers and renders the persistent `BottomNav`. The bottom nav remains visible on all pages. On the FeedPage, the bottom nav has a subtle translucent blur background so it sits over the video without fully obscuring it.

---

## 7. Core Features — In Depth

### 7.1 Vertical Video Feed

The feed is a vertically scrollable container using `scroll-snap-type: y mandatory` on the parent and `scroll-snap-align: start` on each video card. Each card is exactly `100dvh` tall (using `dvh` units for correct mobile viewport handling, accounting for browser chrome).

The user scrolls naturally with their thumb — no custom scroll hijacking, no JavaScript-driven scroll. The browser's native scroll snap handles all momentum and snap alignment.

`IntersectionObserver` watches each video card with a threshold of `0.8` — when 80% of a card is in view, that card is considered "active" and its video begins playing. The previously active card's video is immediately paused.

After the last video, scrolling further brings the first video back into view, creating a seamless loop. This is achieved by rendering an extra copy of the first video at the end of the list and silently resetting scroll position when it snaps.

### 7.2 Video Playback

Each `<video>` element has the following attributes set programmatically (not as static HTML attributes, to allow dynamic control):
- `playsInline` — critical for iOS, prevents full-screen takeover
- `muted` — default state, overridden by the sound toggle
- `loop` — each individual video loops
- `preload="auto"` — for the active and adjacent videos only
- `poster` — thumbnail image shown before first play

The progress bar is a `<div>` with `width` driven by `video.currentTime / video.duration` updated every `timeupdate` event. It is positioned absolutely at the very bottom of the video card, 3px tall, using the accent color with 80% opacity, with a smooth `transition: width 100ms linear`.

### 7.3 Action Bar

The action bar sits on the right side of the video, vertically centered between 40% and 90% of the card height. It contains five interactive items stacked vertically with 24px gaps:

**Like (heart)**
- Outline heart by default
- On tap: fills with `--color-accent` (#FF6B6B), count increments by 1, spring scale animation (1 → 1.4 → 1), haptic pulse
- On second tap: reverts to outline, count decrements, haptic soft
- Like state is persisted to the `interactions` DB table

**Comment (speech bubble)**
- On tap: opens CommentSheet from bottom, haptic light
- Count reflects DB comment count for this video

**Share (arrow-up-from-bracket)**
- On tap: triggers `navigator.share()` (Web Share API) with the video URL and description
- Falls back to copying URL to clipboard if Web Share not supported
- Toast notification confirms copy, haptic light

**Bookmark (bookmark)**
- On tap: fills bookmark icon, haptic light
- Persisted to `interactions` DB table
- Bookmarked videos appear in `/saved`

**Avatar (circular profile image)**
- Tapping navigates to `/profile/:id` for the video's creator
- A small "+" badge overlays the avatar if the active user does not yet follow this creator
- Tapping the "+" badge toggles follow state directly, without navigating, haptic medium

### 7.4 User Info Overlay

Positioned at the bottom-left of the video card, above the bottom nav. Contains:

- `@username` in 15px/600 weight white with soft text-shadow for legibility on any video
- Caption text in 13px/400 weight, max 2 lines, truncated with ellipsis
- A "more" tap expands the caption inline (no sheet, just height animation)
- Scrolling music ticker below caption: `♪ musicTitle` text that scrolls horizontally on loop while video plays, pauses when video pauses
- Tapping the username navigates to `/profile/:id`

### 7.5 Music Disc

A circular element, 48×48px, at the bottom-right corner, sitting above the action bar. It shows the creator's avatar image (or a music note placeholder) inside a rotating disc border. The disc rotates at `animation: spin 4s linear infinite` while the video is playing and `animation-play-state: paused` when the video is paused. The border is a thin 2px ring in `--color-border` with a small colored quadrant to show rotation.

### 7.6 Sound Toggle

A small speaker icon positioned at the top-right of the video card, inside the safe area. On tap, it toggles the `muted` property of the active video element and updates the global mute state in `AppContext` so all subsequent videos respect the same setting. Haptic light feedback on toggle. Icon switches between `Volume2` and `VolumeX` from Lucide.

---

## 8. Video Caching & Preloading

### Strategy: Sliding Window Cache

At any point in the feed, three videos are buffered: the one before, the current one, and the one after (window size ±1). On higher-end connections this expands to ±2 automatically.

### Implementation Details

A custom hook `useVideoPreloader` maintains a `ref` (not state, to avoid re-renders) that maps video URLs to detached `HTMLVideoElement` objects created with `document.createElement('video')`. These elements are never mounted in the DOM — they exist solely to trigger browser-level network requests and fill the media buffer.

When the active index changes:
1. Calculate the new window: `[currentIndex - 1, currentIndex, currentIndex + 1]`
2. For each URL in the new window that is not already in the cache, create a detached `<video>`, set `src`, set `preload="auto"`, and store it in the cache map
3. For each URL in the cache that is now outside the window, set `src = ''` to release the buffer, then delete the entry from the map

The actual `<video>` elements rendered in the DOM share the same `src` as the cached detached elements, so the browser reuses the already-buffered media data via its internal cache — the DOM video plays instantly without re-fetching.

### Connection Awareness

On load, check `navigator.connection.effectiveType`. If `4g`, use window ±2. If `3g` or `slow-2g`, use window ±1 and also set `video.preload = 'metadata'` for off-window videos instead of `'auto'`. This prevents excessive data consumption on slow connections.

---

## 9. Haptic Feedback System

All haptic feedback goes through a single custom hook `useHaptics` that wraps `navigator.vibrate()`. The hook checks for API support on init and no-ops silently on unsupported devices (desktop, iOS Safari — iOS does not support Vibration API).

### Haptic Patterns

| Action | Pattern | Feel |
|---|---|---|
| Like (tap to like) | `[12]` | Single short pulse |
| Like (tap to unlike) | `[6]` | Half-strength short |
| Double-tap like | `[15, 40, 15]` | Double pop |
| Bookmark | `[10]` | Quick tick |
| Comment open | `[8]` | Soft tap |
| Share | `[10]` | Soft tap |
| Follow | `[20]` | Medium confirm |
| Unfollow | `[8]` | Soft confirm |
| Sound toggle | `[6]` | Micro tick |
| Avatar "+" follow | `[20]` | Medium confirm |
| Long-press pause start | `[30]` | Hold confirm |
| Long-press pause release | `[10]` | Release tick |
| Scroll snap (video change) | `[5]` | Micro transition |

All patterns are arrays passed directly to `navigator.vibrate()`. The hook exposes named methods (`haptics.like()`, `haptics.bookmark()`, etc.) so callsites never reference raw numbers.

---

## 10. Profile System

### Profile Page Layout

The profile page renders a full-screen scrollable layout:

**Header Section (non-scrollable sticky)**
- Back arrow (if navigated from feed) or app logo (if accessed via bottom nav)
- Username at top-center

**Profile Info Block**
- Large circular avatar, 80×80px, centered
- Display name below in 18px/700
- Bio text in 14px/400, up to 3 lines, centered
- Three stat pills in a row: `{videoCount} Posts`, `{followerCount} Followers`, `{followingCount} Following`
- Follow button (full-width on own profile → Edit Profile; on other profiles → Follow/Following toggle)

**Tab Bar**
- Three tabs: `Posts` / `Liked` / `Saved`
- Active tab has a bottom border indicator in `--color-text-primary`
- Tab content switches without animation (instant, no slide)

**Video Grid (Posts tab)**
- 3-column CSS Grid, each cell is a square thumbnail (`aspect-ratio: 1 / 1`)
- On tap, the video opens in a single-video overlay (or navigates to feed at that video's index)
- Play count shown in bottom-left of each thumbnail with a small play icon

**Liked and Saved tabs** follow the same grid layout but sourced from the `interactions` DB table filtered by type.

### Follow State

When the active user follows a creator, an entry is written to `interactions` with `type: 'follow'`. The follow button on the profile page reads from this table to determine initial state. The creator's `followerCount` in the `profiles` table is incremented/decremented accordingly. All this happens locally in Dexie.

---

## 11. Profile Search

### Page Layout

The search page (`/search`) is the third tab in the bottom nav (magnifying glass icon).

**Top section: Search bar**
- A full-width rounded input with a magnifying glass icon on the left and a clear (×) button that appears when text is present
- `font-size: 16px` to prevent iOS auto-zoom on focus
- Auto-focuses when page is navigated to

**Below search bar: Suggestions**
When the search input is empty, show 2–3 pre-populated profile suggestions sourced from the DB. These are the most-followed profiles in the seed data. Each suggestion row contains:
- Circular avatar (36×36px)
- Display name + username on the right
- Follower count in muted text on the far right
- The entire row is tappable and navigates to `/profile/:id`

**Search results**
As the user types, the DB is queried with `profiles.where('username').startsWithIgnoreCase(query)` combined with a `.or()` for `displayName`. Results update in real time (debounced 150ms). Each result is a profile row identical in layout to the suggestions. Empty state shows: *"No creators found for '…'"*

**No separate video search.** The explore paradigm is creator-first: find a person, then see their content on their profile page.

---

## 12. Skeleton Loaders & Feed Animation

### Feed Skeleton

On initial page load, before the DB has resolved and videos have been fetched, the feed renders a full-screen `SkeletonCard` component. This skeleton mimics the exact layout of a `VideoCard`:
- A dark shimmer rectangle filling the entire screen (representing the video area)
- A shimmer block at the bottom-left (representing username + caption)
- Four shimmer circles on the right (representing the action bar icons)
- A shimmer circle at the bottom-right (representing the music disc)

The shimmer animation is a CSS `@keyframes` that moves a `linear-gradient` from left to right across the element, using `--color-shimmer-start` and `--color-shimmer-end`. Duration: 1.4s, infinite.

After the DB resolves (typically under 100ms for Dexie), the skeleton fades out with a 200ms opacity transition and the real feed fades in.

### Feed Entry Animation

When the feed first renders its video cards, each card animates in with a staggered vertical entry:
- Cards start at `translateY(24px)` and `opacity: 0`
- They animate to `translateY(0)` and `opacity: 1`
- Each card's animation is delayed by `index * 60ms` (so card 0 starts immediately, card 1 at 60ms, card 2 at 120ms, etc.)
- Duration: 320ms, easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`

Only the first 3 cards animate in this way on initial load. Subsequent cards that come into view during scrolling do not animate — they appear normally to avoid visual fatigue.

### Profile Grid Skeleton

When the profile page is loading (DB query in flight), the video grid shows a `SkeletonGrid`: 9 square shimmer cells in a 3-column grid with 2px gaps.

### Comment Sheet Skeleton

When the comment sheet opens and comments are loading, show 4 skeleton comment rows: a circle (avatar), two shimmer lines (name + text), identical shimmer animation.

---

## 13. Performance Expectations

### Render Performance

- Only the currently visible video's `<video>` element should have `autoplay` logic active
- All other video elements in the DOM are paused via `ref.current.pause()`
- The feed container holds at most 7 `VideoCard` components in the DOM at once (a virtual window). Cards outside this window are unmounted. This prevents memory buildup during long sessions.
- No state updates should trigger re-renders of sibling video cards. Each `VideoCard` is wrapped in `React.memo`. The action bar like/bookmark state is local to each card and does not propagate upward.

### Bundle Size Targets

- Target: initial JS bundle under 180KB gzipped
- Tailwind is purged in production build
- Lucide icons are individually imported (tree-shaken), not the full set
- Framer Motion is imported selectively (only `motion.div` and `AnimatePresence`)

### Mobile Viewport

- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- `viewport-fit=cover` enables the app to use the full notch/island area on modern iPhones
- Safe area insets are respected: `padding-bottom: env(safe-area-inset-bottom)` on the bottom nav
- Font size minimum 13px (no text below this to ensure legibility on 375px screens)
- All tap targets minimum 44×44px (WCAG AA touch target size)

---

## 14. Hosting & Deployment

### Frontend: GitHub Pages

The Vite app is built with `npm run build` which outputs a `dist/` folder. This is deployed to GitHub Pages using the `gh-pages` npm package or GitHub Actions.

Steps:
1. Add `base: '/toktik-[yourname]/'` to `vite.config.js` to match the GitHub Pages subdirectory
2. Add a `deploy` script in `package.json`: `"deploy": "gh-pages -d dist"`
3. Run `npm run build && npm run deploy` to publish

The app is accessible at `https://[yourusername].github.io/toktik-[yourname]/`.

### Backend / DB: Railway (if needed)

Since the app uses IndexedDB (client-side only), there is no backend server required. Railway is only needed if you later add a real API. For this project, Railway can optionally host a tiny Express static file server as a fallback for the video files if GitHub Pages has size limits.

### Video Files

GitHub has a 100MB file size limit per file and a 1GB soft repository limit. For sample videos (typically 5–15MB each at 720p), 5–8 videos fit comfortably. Use Pexels free stock videos compressed to 720p using FFmpeg before committing.

If video file sizes are a concern, host videos on Cloudinary free tier (25GB storage, 25GB bandwidth/month) and reference them by URL in the seed data. No code changes needed — the `<video src>` accepts any URL.

### Environment Variables

```
VITE_APP_NAME=TokTik
VITE_ACTIVE_USER_SEED_INDEX=0
```

No API keys. No auth tokens. All data is local.

---

## 15. Seed Data Specification

The app must ship with enough seed data to feel real. Minimum requirements:

### Profiles (seed 5 distinct creators)

| id | username | displayName | bio | isVerified | followers |
|---|---|---|---|---|---|
| `p1` | `@luna.creates` | Luna Mira | Visual designer & dreamer ✦ | true | 142K |
| `p2` | `@devwitharjun` | Arjun Mehta | Building things on the internet | false | 38K |
| `p3` | `@zara.frames` | Zara Osei | Filmmaker · Lagos → London 🎬 | true | 291K |
| `p4` | `@calm.with.kai` | Kai Nakamura | Mindfulness & morning rituals 🍵 | false | 67K |
| `p5` | `@bytebymia` | Mia Fernandes | Code, coffee, late nights ☕ | false | 19K |

Each profile has a local avatar image referenced from `/public/avatars/`.

### Videos (seed at minimum 8 videos, spread across profiles)

Each video has a description, 2–3 hashtag tags, a music title, and realistic seed counts for likes (100–50K range), comments (10–2K), shares (5–500), bookmarks (20–3K).

Example distribution: Luna → 2 videos, Arjun → 1, Zara → 2, Kai → 2, Mia → 1.

### Comments (seed 3–5 comments per video)

Use the seeded profiles as commenters. Comments should feel natural and diverse in length — some one word ("Love this!"), some longer (2–3 sentences).

### Seed Execution

`seed.js` checks if the DB is empty on first load. If `profiles.count() === 0`, it runs the seed. This ensures the seed only runs once and does not overwrite any interactions the user has created.

---

## 16. Component Inventory

### Feed Components

**VideoCard** — The main unit. Receives a `video` object and an `isActive` boolean. When `isActive` is true, it triggers autoplay. Renders `VideoPlayer`, `ActionBar`, `UserInfo`, `MusicDisc`, `PlayPauseOverlay`. Wrapped in `React.memo`.

**VideoPlayer** — Contains the `<video>` element and the progress bar. Exposes a `ref` to the parent so the feed controller can call `.play()` and `.pause()` directly. Handles `timeupdate`, `waiting`, and `ended` events.

**ActionBar** — Receives `video` object and interaction state (isLiked, isBookmarked). Renders five vertically stacked items. All DB writes are done via `useInteractions` hook, keeping the component presentation-only.

**UserInfo** — Receives username, profileId, description. Handles caption expand/collapse state internally.

**MusicDisc** — Receives `avatarUrl`, `musicTitle`, `isPlaying`. Rotation animation driven by CSS, toggled by `animation-play-state`.

**PlayPauseOverlay** — Renders a centered icon that appears on tap and fades after 800ms. State (`show`, `type`) is managed internally with a timeout ref.

### Profile Components

**ProfileHeader** — Receives a `profile` object. Reads follow state from `useProfile` hook. Renders avatar, stats, bio, and the follow/edit button.

**VideoGrid** — Receives an array of video objects. Renders a 3-column CSS grid of thumbnail images. Each cell shows the video thumbnail and play count.

**ProfileTabs** — Manages the active tab index as local state. Passes the active tab to the parent so it can fetch the correct video list.

### Search Components

**SearchBar** — Controlled input component. Emits `onChange` on every keystroke. The parent debounces the query before hitting the DB.

**ProfileSuggestion** — Receives a `profile` object. Renders avatar, name, username, follower count. Navigates on tap.

### Comment Components

**CommentSheet** — A bottom drawer. Opens with an upward slide animation using Framer Motion's `AnimatePresence`. Renders a dark semi-transparent backdrop. Closes on backdrop tap or drag-down gesture.

**CommentList** — A scrollable list inside the sheet. Reads from `useComments(videoId)`. Shows skeleton while loading.

**CommentItem** — Single row: avatar, name, comment text, time-ago, like count.

**CommentInput** — Sticky input at the bottom of the sheet. On submit, writes to the `comments` DB table and increments the video's comment count.

### Shared Components

**BottomNav** — Four tabs: Home (house), Search (magnifying glass), Saved (bookmark), Profile (person). Active tab is determined by `useLocation()`. Renders above `env(safe-area-inset-bottom)`.

**SkeletonCard** — Full-screen shimmer. Described in section 12.

**HeartBurst** — Absolutely positioned animated heart rendered at the tap coordinates on double-tap. Animates from scale 0 to scale 1.4 to scale 0, with opacity fade. Duration 600ms. Unmounts after animation.

**Avatar** — Circular image with a letter-based color fallback (uses the first letter of the display name on a deterministic background color derived from the username hash).

---

## 17. Custom Hooks Inventory

**`useVideoFeed(videos)`** — Sets up `IntersectionObserver` on all video card refs. Returns `activeIndex` and `setActiveIndex`. Handles the infinite loop reset logic.

**`useVideoPreloader(videos, activeIndex)`** — Manages the sliding window cache. Returns `cacheRef` (not used by callers, side-effect hook).

**`usePlayer(videoRef, isActive)`** — Watches `isActive`. Calls `videoRef.current.play()` or `pause()`. Handles the `play()` Promise rejection (browser may block autoplay). Returns `isPlaying`, `togglePlay`, `currentTime`, `duration`.

**`useInteractions(videoId, profileId)`** — Returns `isLiked`, `isBookmarked`, `toggleLike`, `toggleBookmark` for a given video. All functions write to the `interactions` DB table and update local state optimistically.

**`useProfile(profileId)`** — Returns the `profile` object from DB, `isFollowing` (boolean), and `toggleFollow`. Used by both `ProfileHeader` and the avatar "+" badge on `ActionBar`.

**`useComments(videoId)`** — Returns `comments` array, `isLoading`, and `addComment(text)`. Sorts by newest first.

**`useHaptics()`** — Returns an object of named haptic trigger functions. No-ops on unsupported devices.

**`useGestures(elementRef, handlers)`** — Attaches touch event listeners to the given ref. Accepts `{ onTap, onDoubleTap, onLongPress, onSwipeUp, onSwipeDown }`. Manages the tap disambiguation timer (180ms window to distinguish single vs double tap). Cleans up listeners on unmount.

**`useSearch(query)`** — Debounces the query by 150ms, then queries the `profiles` DB table. Returns `results` array and `isLoading`.

---

## 18. Context Providers

### AppContext

Provides:
- `activeUser` — the active user's full profile object (read from DB on mount using the id stored in localStorage)
- `isMuted` — global mute state, boolean, persisted to localStorage
- `toggleMute` — function
- `theme` — always `'light'` for TokTik (no dark mode, by design — light theme is the brand)

### DBContext

Provides:
- `db` — the raw Dexie instance (rarely used directly)
- `profiles` — helper: `getById`, `getAll`, `search`
- `videos` — helper: `getFeed`, `getByProfileId`, `getById`
- `interactions` — helper: `hasLiked`, `hasBookmarked`, `isFollowing`, `toggleLike`, `toggleBookmark`, `toggleFollow`, `getBookmarkedVideos`
- `comments` — helper: `getByVideoId`, `add`

### FeedContext

Provides:
- `activeIndex` — current video index
- `setActiveIndex` — called by `useVideoFeed`
- `videos` — full video array for the feed (loaded once from DB on mount)
- `isLoading` — boolean, true while initial DB load is in flight

---

## 19. Interaction & Gesture Map

| Gesture | Where | Result |
|---|---|---|
| Single tap | Video area | Toggle play/pause + show overlay icon |
| Double tap | Video area | Like animation (HeartBurst) + haptic double-pop |
| Long press (500ms) | Video area | Pause video while held, resume on release + haptic hold |
| Swipe up | Feed | Next video (native scroll snap) + micro haptic |
| Swipe down | Feed | Previous video (native scroll snap) + micro haptic |
| Tap | Like button | Toggle like state + spring animation + haptic |
| Tap | Comment button | Open CommentSheet + haptic |
| Tap | Share button | Trigger Web Share API + haptic |
| Tap | Bookmark button | Toggle bookmark state + haptic |
| Tap | Avatar "+" badge | Toggle follow + haptic |
| Tap | Username / avatar | Navigate to ProfilePage |
| Tap | Caption "more" | Expand caption inline |
| Tap | Thumbnail in grid | Open video overlay |
| Drag down | CommentSheet | Dismiss sheet |
| Tap backdrop | CommentSheet | Dismiss sheet |
| Tap row | Search suggestion | Navigate to ProfilePage |
| Keyboard: ↑ ↓ | Feed | Previous / next video |
| Keyboard: Space | Feed | Toggle play/pause |

---

## 20. Accessibility Baseline

- All interactive elements have `aria-label` attributes
- All images have `alt` text
- The `<video>` element has `aria-label` with the video description
- Minimum tap target size: 44×44px for all buttons
- Color contrast: all text meets WCAG AA (4.5:1 for normal text, 3:1 for large text) against the light background
- `prefers-reduced-motion` media query disables the feed entry stagger animation and skeleton shimmer movement (replaces with instant appearance)
- Focus styles are visible on keyboard navigation (custom outline style in globals.css)

---

## 21. Known Trade-offs & Limitations

**IndexedDB is per-browser, per-origin.** Data does not sync across devices or browsers. This is appropriate for a demo; acknowledged in the README.

**Video file hosting on GitHub Pages.** If video files exceed 100MB total, they should be hosted on Cloudinary or another CDN and referenced by URL in the seed data.

**No real authentication.** The "active user" concept is a convention. Any user who clears their browser storage will start fresh. Acknowledged in README.

**iOS Safari vibration.** The Vibration API is not supported on iOS Safari. Haptic feedback is silently absent on iPhone. This is a platform limitation, not a bug. Acknowledged in README.

**Autoplay policy.** Some browsers (particularly desktop Chrome) block autoplay of unmuted video. The app handles the `play()` Promise rejection and shows a "tap to play" state instead of crashing.

**Infinite loop seam.** The feed loop trick (appending the first video at the end and resetting scroll position) may cause a brief flicker on very slow devices. Acceptable trade-off at this stage.

**No real-time comments.** Comments are local only. Two users on different devices will not see each other's comments. Appropriate for the scope.

---

## 22. Submission Checklist

### Code Quality
- [ ] Zero console errors or warnings in Chrome DevTools
- [ ] All components are functional components with hooks only
- [ ] No monolithic components — every component has one clear responsibility
- [ ] `useRef` used for all video element references
- [ ] `useEffect` cleanup functions present wherever listeners or timers are created
- [ ] `React.memo` on `VideoCard` to prevent sibling re-renders
- [ ] No direct DOM manipulation outside of `useRef`-accessed elements

### Features
- [ ] Vertical scroll snap feed, at least 8 videos
- [ ] Autoplay on scroll into view, auto-pause on scroll away
- [ ] Tap to play/pause with fading icon overlay
- [ ] Progress bar on each video
- [ ] Like button with count and animation — persisted to IndexedDB
- [ ] Comment button opens CommentSheet — comments in IndexedDB
- [ ] Share button using Web Share API
- [ ] Bookmark button — persisted to IndexedDB
- [ ] Sound toggle
- [ ] User info overlay with expand caption
- [ ] Spinning music disc
- [ ] Double-tap to like (HeartBurst animation)
- [ ] Long-press to pause
- [ ] Infinite loop feed
- [ ] Sliding window video preloader with eviction
- [ ] Haptic feedback on all interactions
- [ ] Profile page with grid, tabs, follow state
- [ ] Profile search with 2–3 suggestions, live results, navigates to ProfilePage
- [ ] Skeleton loaders on feed, profile grid, comment sheet
- [ ] Feed entry stagger animation on initial load
- [ ] Saved / bookmarks page
- [ ] Bottom nav with 4 tabs

### Design
- [ ] TokTik branding (name + light theme — no TikTok logos or colors)
- [ ] Inter font loaded
- [ ] Design tokens in `globals.css` as CSS custom properties
- [ ] Mobile viewport meta tag with `viewport-fit=cover`
- [ ] Safe area insets respected on bottom nav
- [ ] All tap targets 44×44px minimum
- [ ] Light, airy, professional visual feel

### Performance
- [ ] Only visible video is playing
- [ ] Feed DOM window: max 7 cards at once (unmount off-screen)
- [ ] No unnecessary re-renders (verify with React DevTools Profiler)
- [ ] Production build under 180KB JS gzipped

### Deployment
- [ ] Deployed and live on GitHub Pages
- [ ] Repo is public, named `toktik-[yourname]`
- [ ] Single command setup: `npm install && npm run dev`
- [ ] `npm run build` produces a working production build
- [ ] README includes: setup instructions, tech choices + rationale, known limitations, live URL, demo video link

### Submission
- [ ] Screen recording (1–2 min) demonstrating all core features
- [ ] GitHub repo link ready
- [ ] Demo video link ready (Loom / YouTube unlisted / Google Drive)
- [ ] Both links submitted before the 48-hour deadline

---

*TokTik · Masterplan v1.0 · March 2026 · Prepared for Kamao.ai React Intern Assessment*
