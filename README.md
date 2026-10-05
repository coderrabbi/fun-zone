# FUN ZONE

A Bangla-first, fully static entertainment website with React, Vite, Three.js, React Three Fiber, Drei, GSAP/ScrollTrigger, Framer Motion, Lenis, Tailwind CSS and Lucide.

## Run locally

Requires Node.js 22.12+ (tested with Node.js 24).

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Upload the contents of `dist/` to any static hosting service. There is no backend, database, login, or admin panel. Serve over HTTP(S); opening `index.html` directly from disk will not load JavaScript modules correctly.

## Edit the content

- `src/data/content.js`: service cards, VR experiences, price, duration, reviews, image paths and contact information.
- `src/sections/PlayZones.jsx`: arcade category descriptions.
- `src/styles/global.css`: palette, typography, spacing and responsive layouts.
- `src/three/World.jsx`: persistent starfield, VR headset, controller and portal.
- `src/three/PlayScene.jsx`: arcade machines, racing wheel and friendly kids scene.
- `src/animations/useChoreography.js`: smooth scrolling and section choreography.

Set `business.address`, `hours`, `phone`, and `mapUrl` to the actual venue details. Map/call buttons are intentionally unavailable until their respective values are supplied. Price is the supplied ৳50 for five minutes. No location, opening hours or phone number has been invented.

The gallery uses explicitly labelled illustrative stock images. Replace these with real venue photography before public marketing. Reviews are labelled sample copy and must be replaced with genuine customer feedback. Do not remove the sample label while retaining invented reviews.

## Motion and accessibility

- Native links, landmarks, Bangla document language, one H1, focus outlines and skip navigation.
- Keyboard-operated arcade tabs and a native modal gallery with Escape, arrow-key navigation and focus restoration.
- Responsive mobile menu with Escape and focus containment.
- Reduced-motion users receive native horizontal scrolling and static scene poses, without scroll pinning, large parallax, cursor effects or review marquee motion.
- WebGL scenes are dynamically imported. Local scene rendering pauses offscreen. Background rendering pauses in hidden tabs. Mobile gets fewer particles and lower DPR; no realtime shadows or postprocessing.
- Model geometry is generated in code, so no external GLTF/Draco payload is needed. Starfield uses one GPU Points draw call.
- Google Fonts are loaded with display=swap, with local sans-serif fallbacks. No audio is loaded or autoplayed.

## Content and deployment notes

The site has been built and checked locally. Device-specific frame rates depend on graphics hardware; 60 FPS is a target, not a guarantee. No physical-device thermal or prolonged frame-rate benchmark is claimed.

Sites hosting metadata lives in `.openai/hosting.json`. It is independent of the static site's runtime; remove that directory when moving the source to another hosting service if desired. Image credits and source links are in `ASSET-CREDITS.md`.

## Mobile graphics update

Mobile and coarse-pointer devices use native momentum scrolling, 160 background particles, smooth rounded geometry, fewer lights, and a clarity-preserving DPR of 1.5–2 with antialiasing. Frame-rate dips no longer lower the pixel resolution. The mobile background renders only around the hero and final portal. Local canvases are created on first visibility, pause offscreen and in hidden tabs, and the static arcade scene renders on demand.

New cinematic effects include counter-rotating headset arcs, a GPU-driven portal streak field, perspective tunnel rings and racing light trails. Decorative CSS animations pause offscreen and all new effects respect reduced motion. Browser viewport checks do not substitute for measurements on a physical phone.

