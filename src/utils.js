// ---------- Helper JS functions ----------

// Keep a number between min and max
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Linear interpolation
export const lerp = (a, b, t) => a + (b - a) * t

// Frame-rate independent smoothing (the bird "eases" toward the cursor)
export const damp = (current, target, smoothing, dt) =>
  lerp(current, target, 1 - Math.exp(-smoothing * dt))

// Re-map a number from one range to another
export const mapRange = (v, inMin, inMax, outMin, outMax) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin)

// R3F gives the pointer as -1..1 on both axes.
// Convert it into a real 3D position on the z = 0 plane.
export const pointerToWorld = (pointer, viewport) => ({
  x: (pointer.x * viewport.width) / 2,
  y: (pointer.y * viewport.height) / 2,
})
