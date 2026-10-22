# Bonding and Structure Lab

Interactive AS Chemistry lesson for Chapter 3, Bonding and Structure, with animations, 3D molecule models and a step-by-step guide to hybridization. Works in any modern browser, including iPad Safari.

## Run locally
```
npm start
```
Then open http://localhost:3000

## Deploy on Railway
1. New Project → Deploy from GitHub repo → pick this repo.
2. Railway detects Node and runs `npm start`. No build step, no dependencies.
3. Settings → Networking → Generate Domain to get a public URL.

## Files
- `index.html` page layout, text and styles
- `bonding/` page scripts (`core.js`, `data.js`, `three-kit.js`, `parts.js`)
- `vendor/three.min.js` three.js r128 (MIT license, see `vendor/THREE-LICENSE`)
- `server.js` dependency-free static server used by `npm start`
