# Phoenix - 3D cursor follow (React Three Fiber)

## Run
    npm install
    npm run dev

Open the URL shown in the terminal (usually http://localhost:5173).

## Files
- public/phoenix_bird.glb - Sketchfab model (with built-in wing-flap animation)
- src/Phoenix.jsx - loads the model, plays animation, follows the cursor
- src/Embers.jsx - fire-spark trail + click burst
- src/utils.js - JS helper functions (clamp, lerp, damp, mapRange, pointerToWorld)

## Tweaks
- Bird faces the wrong way? Change MODEL_YAW in src/Phoenix.jsx
- Bigger/smaller bird: TARGET_SIZE in src/Phoenix.jsx
- Follow speed: the 3.2 value in the damp() calls
