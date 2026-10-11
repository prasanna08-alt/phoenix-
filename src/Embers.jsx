import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 400

// Fire sparks that fall off the phoenix while it flies.
// Click anywhere to make it burst.
export default function Embers({ birdRef, speedRef, burstRef }) {
  const geo = useRef()
  const cursor = useRef(0)
  const seenBurst = useRef(0)

  const data = useMemo(
    () => ({
      pos: new Float32Array(COUNT * 3),
      col: new Float32Array(COUNT * 3),
      vel: new Float32Array(COUNT * 3),
      life: new Float32Array(COUNT),
    }),
    []
  )

  const spawn = (origin, spread, power) => {
    const i = cursor.current++ % COUNT
    data.pos[i * 3] = origin.x + (Math.random() - 0.5) * spread
    data.pos[i * 3 + 1] = origin.y + (Math.random() - 0.5) * spread
    data.pos[i * 3 + 2] = origin.z + (Math.random() - 0.5) * spread
    data.vel[i * 3] = (Math.random() - 0.5) * power
    data.vel[i * 3 + 1] = Math.random() * power * 0.6 + 0.1
    data.vel[i * 3 + 2] = (Math.random() - 0.5) * power
    data.life[i] = 0.6 + Math.random() * 0.8
  }

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    const bird = birdRef.current
    if (!bird || !geo.current) return

    // trail: more sparks when the bird moves faster
    const n = 1 + Math.floor(Math.min(speedRef.current, 8) / 2)
    for (let k = 0; k < n; k++) spawn(bird.position, 1.0, 0.6)

    // click burst
    if (seenBurst.current !== burstRef.current) {
      seenBurst.current = burstRef.current
      for (let k = 0; k < 90; k++) spawn(bird.position, 0.4, 4)
    }

    // update every particle
    for (let i = 0; i < COUNT; i++) {
      data.life[i] -= dt
      const l = Math.max(data.life[i], 0)
      data.pos[i * 3] += data.vel[i * 3] * dt
      data.pos[i * 3 + 1] += data.vel[i * 3 + 1] * dt
      data.pos[i * 3 + 2] += data.vel[i * 3 + 2] * dt
      // orange -> dark as it dies (additive blending hides black)
      data.col[i * 3] = l
      data.col[i * 3 + 1] = l * l * 0.45
      data.col[i * 3 + 2] = l * l * l * 0.1
    }
    geo.current.attributes.position.needsUpdate = true
    geo.current.attributes.color.needsUpdate = true
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" count={COUNT} array={data.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={data.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
