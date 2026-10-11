import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Phoenix from './Phoenix'
import Embers from './Embers'

export default function App() {
  const birdRef = useRef()
  const speedRef = useRef(0)
  const burstRef = useRef(0)

  return (
    <div className="page" onPointerDown={() => (burstRef.current += 1)}>
      <h1 className="title">PHOENIX</h1>

      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.6} />
        <hemisphereLight args={['#ffd9a0', '#1a0a2e', 0.9]} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffb067" />
        <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#7a5cff" />
        <Suspense fallback={null}>
          <Phoenix birdRef={birdRef} speedRef={speedRef} />
        </Suspense>
        <Embers birdRef={birdRef} speedRef={speedRef} burstRef={burstRef} />
      </Canvas>

    </div>
  )
}
