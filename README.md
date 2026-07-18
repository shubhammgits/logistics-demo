# Logistics Demo

A high-end, WebGL-powered logistics landing page featuring dynamic 3D elements, interactive scroll choreography, and a robust design system.

## Setup Instructions

This project is built with Next.js (App Router), React Three Fiber, Lenis (smooth scrolling), and GSAP (animation).

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the site.

### 3. Build for Production
```bash
npm run build
npm run start
```

## Features
- **WebGL Interactive Globe**: Scroll-scrubbed 3D globe with procedural shipping lanes.
- **Scroll-Gated Intro**: A realistic loading screen tied to active Three.js assets that forces an unlock interaction before scrolling begins.
- **Dynamic Scroll Animations**: Word-by-word staggered typography tied directly to Lenis smooth scrolling and GSAP scroll triggers.
- **Accessible Motion**: Full `prefers-reduced-motion` bypasses built into the intro sequence and WebGL animations.

## Deployment Readiness
This project relies entirely on statically renderable content or client-side WebGL features. There are no server-only Node.js dependencies, making it fully compatible with Vercel, Netlify, or any static hosting provider.
