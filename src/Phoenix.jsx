import { useRef, useLayoutEffect, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { clamp, damp, pointerToWorld } from './utils'

const MODEL_URL = `${import.meta.env.BASE_URL}phoenix_bird.glb`
const TARGET_SIZE = 3.4 // how big the bird looks on screen

// If your bird flies backwards / sideways, change this angle.
// Try 0, Math.PI / 2, Math.PI or -Math.PI / 2
const MODEL_YAW = -Math.PI / 2

export default function Phoenix({ birdRef, speedRef }) {
  const model = useRef()
  const prev = useRef(new THREE.Vector3())
  const vel = useRef({ x: 0, y: 0 })
  const flap = useRef(null)

  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions } = useAnimations(animations, model)

  // Auto-fit: centre the model and scale it to TARGET_SIZE
  useLayoutEffect(() => {
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)
    scene.updateMatrixWorld(true)

    scene.traverse((o) => {
      if (o.isMesh) o.frustumCulled = false
    })

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = TARGET_SIZE / Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(s)
    scene.position.copy(center).multiplyScalar(-s)
  }, [scene])

  // Start the wing-flap animation that is baked into the .glb
  useEffect(() => {
    const action = Object.values(actions)[0]
    if (action) {
      action.reset().fadeIn(0.4).play()
      flap.current = action
    }
    return () => action && action.fadeOut(0.2)
  }, [actions])

  useFrame((state, dt) => {
    const g = birdRef.current
    if (!g) return
    dt = Math.min(dt, 0.05)

    // 1. Where is the cursor in 3D space?
    const t = pointerToWorld(state.pointer, state.viewport)
    const bob = Math.sin(state.clock.elapsedTime * 2) * 0.08 // gentle hover

    // 2. Glide the bird toward the cursor
    g.position.x = damp(g.position.x, t.x, 3.2, dt)
    g.position.y = damp(g.position.y, t.y + bob, 3.2, dt)

    // 3. Measure how fast it is travelling
    vel.current.x = (g.position.x - prev.current.x) / dt
    vel.current.y = (g.position.y - prev.current.y) / dt
    prev.current.copy(g.position)
    const speed = Math.hypot(vel.current.x, vel.current.y)
    speedRef.current = speed

    // 4. Turn, bank and pitch based on that movement
    const yaw = clamp(vel.current.x * 0.45, -1.3, 1.3)
    const pitch = -clamp(vel.current.y * 0.12, -0.5, 0.5)
    const roll = clamp(-vel.current.x * 0.1, -0.6, 0.6)
    g.rotation.order = 'YXZ'
    g.rotation.y = damp(g.rotation.y, yaw, 5, dt)
    g.rotation.x = damp(g.rotation.x, pitch, 5, dt)
    g.rotation.z = damp(g.rotation.z, roll, 5, dt)

    // 5. Flap faster when moving fast
    if (flap.current) flap.current.timeScale = 1 + clamp(speed * 0.35, 0, 2.2)
  })

  return (
    <group ref={birdRef}>
      <pointLight color="#ff7a18" intensity={25} distance={9} position={[0, 0, 1.5]} />
      <group rotation={[0, MODEL_YAW, 0]}>
        <group ref={model}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URL)
