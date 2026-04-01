
<<<<<<< HEAD
<div align="center">

# 🎵 TikTok-Style React Video Player

**A high-fidelity, mobile-first short-form video experience built for the modern web.**

<br />

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> Building the future of mobile-first scrolling with raw HTML5 video power and butter-smooth CSS snap physics!

</div>

<br/>

## 🍿 The Experience

<p align="center">
  <a href="https://toktikproject-production.up.railway.app">
    <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="60" alt="Watch the Live Demo" />
  </a>
  <br />
  <b>Tap the icon above to watch the Full Walkthrough</b>
</p>

---

<table align="center" style="width: 100%; border: none;">
  <tr>
    <td width="50%" valign="top">
      <h3>⚡ Lightning Fast Core</h3>
      <ul>
        <li><b>Scroll Snap:</b> Silky smooth <code>&lt;CSS scroll-snap&gt;</code> integration for native-feeling vertical swiping.</li>
        <li><b>Infinite Loop Illusion:</b> Seamlessly loops boundaries <code>[last...first]</code> via invisible coordinate leaps!</li>
        <li><b>IntersectionObserver:</b> Playback is paused automatically outside the viewport entirely saving CPU/Battery life.</li>
        <li><b>Loading Skeletons:</b> Beautiful shimmer effects mask the layout gracefully while heavy video assets buffer.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🎭 Rich Overlays & Gestures</h3>
      <ul>
        <li><b>Double Tap:</b> Triggers a gorgeous animated center-screen heart pop.</li>
        <li><b>Long Press to Pause:</b> Instantly suspends the video while the screen is held.</li>
        <li><b>Music Engine:</b> An elegant spinning vinyl record reacting exactly to the playback state.</li>
        <li><b>Dual Theme Modes:</b> Included universal light and dark modes in a sleek settings popup to change the vibe instantly.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ The Technology Behind The Magic

<details>
  <summary><b>✨ View System Architecture & Hierarchy</b></summary>
  
  ```mermaid
  graph TD;
      A[App Shell & Theme Provider] --> B[Infinite Scroll Feed UI];
      B --> C[Video Card Context];
      C --> D[HTML5 Video Controller];
      C --> E[Right Action Bar Overlay];
      C --> F[Bottom User Info Panel];
      C --> G[Spinning Music Disc];
  ```

  ### 💡 Intelligent Video Management
  Using `useRef` directly on `<video>` nodes instead of hammering React state `onTimeUpdate` completely eliminates massive re-renders. Every single play/pause action and progress bar update feels incredibly responsive.
</details>

<details>
  <summary><b>📁 View Project Folder Tree</b></summary>

  ```text
  tiktok-player-khushipriyadarshni/
  ├── src/
  │   ├── components/
  │   │   ├── VideoCard.jsx      # Auto-play / Heavy Gesture Logic
  │   │   ├── ActionBar.jsx      # Likes, Comments, Saves
  │   │   └── UserInfo.jsx       # Avatar & Follow System Toggle
  │   ├── data/
  │   │   └── videos.js          # Video segment boundaries & mock backend
  │   └── App.jsx                # Feed generation and Infinite logic
  ├── index.html
  └── package.json
  ```
</details>

=======
# 🎥 TikTok-Style Vertical Video Player

A high-fidelity, TikTok-like video feed built with React (Vite) and native HTML5 video. This project delivers a smooth, mobile-first vertical scrolling experience with auto-playing videos, interactive overlays, and a suite of bonus features for a polished, engaging user experience.

---

## 🚀 Demo

[![Video Demo](https://img.shields.io/badge/📹-Watch_Demo-FF0000?style=for-the-badge&logo=youtube)](https://toktikproject-production.up.railway.app)
*(Run the app locally to see the full interactive experience)*

---

## ✨ Features

### Core Features
- **Vertical Video Feed** – Full‑screen layout with CSS scroll‑snap; smooth scrolling between videos.
- **Infinite Looping** – Seamless loop from last video back to first.
- **Auto‑Play/Pause** – Video plays when it enters the viewport, pauses when leaving.
- **Tap to Play/Pause** – Tap video area toggles playback with a subtle icon overlay.
- **Progress Bar** – Thin real‑time progress bar at the bottom of each video.
- **Interactive Overlays**  
  - Right‑side action bar: Like (with heart animation), Comment, Share, Bookmark.  
  - Bottom‑left user info: username, caption (with expand option), Follow button on avatar.  
  - Rotating music disc (bottom‑right) that spins while video plays.  
  - Sound toggle button (mute/unmute).

### Bonus Features
- **Double‑Tap to Like** – Large heart animation in the center.
- **Follow Button** – Toggles between “Follow” and “Following”.
- **Long‑Press to Pause** – Hold to pause; release to resume.
- **Loading Skeleton** – Shimmer overlay while video buffers.
- **Responsive Design** – Works on mobile (375x812) and desktop.
- **Dark Mode Toggle** – Simple settings menu (gear icon) switches light/dark themes.
- **Keyboard Navigation** – Arrow Up/Down to scroll, Space to play/pause.
>>>>>>> 0b41ca28cf7d6b204fab474ac4749dad044e5b6e

## 🚀 Boot It Up

<<<<<<< HEAD
```bash
# 1. Grab the code
git clone https://github.com/khushipriyadarshni/tiktok-player.git

# 2. Drop into the directory
cd tiktok-player-khushipriyadarshni

# 3. Install packages & fly!
npm install && npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) and resize your browser window or open your mobile phone simulator to experience the complete responsive design!

<div align="center">

<br/><hr/><br/>

### Built with ❤️ by **Khushi Priyadarshni**
*B.E. Artificial Intelligence & Data Science*

**Thank you for exploring my project!**
</div>
=======
## 🛠️ Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Core Library   | React 18+ (Functional Components & Hooks)       |
| Build Tool     | Vite                                            |
| Styling        | Plain CSS (with animations in `App.css`)        |
| Video Player   | Native HTML5 `<video>` element                  |
| State Mgmt     | React Hooks (`useState`, `useEffect`, `useRef`, `useMemo`) |

---

## 🧠 Technical Approach & Key Details

### High‑Level Architecture

App
└── VideoCard (active / inactive)
├── HTML5 <video>
├── ActionBar (like, comment, share, save)
├── UserInfo (username, caption, follow button)

### Key Implementations

#### 1. Infinite Looping
- Feed renders `[last, ...videos, first]`
- Smooth seamless scrolling loop

#### 2. Playback Control
- Uses `IntersectionObserver`
- Only visible video plays
- Controlled using `ref` (no unnecessary re-renders)

#### 3. Segment Playback
- Each video uses:
  - `segmentStartSec`
  - `segmentDurationSec`
- Loops only a portion of video

#### 4. Performance Optimization
- Only one video plays at a time
- Localized state management
- `useMemo` prevents recalculations

---

## 📁 Project Structure


tiktok-player/
│── src/
│ ├── components/
│ │ ├── VideoCard.jsx
│ │ ├── ActionBar.jsx
│ │ └── UserInfo.jsx
│ ├── data/
│ │ └── videos.js
│ ├── App.jsx
│ ├── main.jsx
│ └── App.css
│
│── index.html
│── package.json
│── README.md

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

## ⚡ Installation & Setup

```bash
# Clone repository
git clone https://github.com/khushipriyadarshni/tiktok-player.git

# Navigate to project
cd tiktok-player-khushipriyadarshni

# Install dependencies
npm install

# Run project
npm run dev

Open:
[http://localhost:5173](http://localhost:5173)
```

---

## 👩‍💻 Author

**Khushi Priyadarshni**  
🎓 B.E. Artificial Intelligence & Data Science  

---

✨ Thank you for reviewing my project!


>>>>>>> 0b41ca28cf7d6b204fab474ac4749dad044e5b6e
