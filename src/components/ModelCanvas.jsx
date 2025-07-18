// ModelCanvas.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Recycletek } from './models/RecycleTek';
import { Building } from './models/Building';

export default function ModelCanvas() {
  return (
    <Canvas
      camera={{ position: [5, 1, 6], fov: 45 }}
      shadows
      style={{ width: '100%', height: 360 }}   // banner‑sized canvas
    >
      {/* lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.1} castShadow />

      <Environment preset="city" />

      <Suspense fallback={null}>
        {/* put both models in a parent group so they move together if needed */}
        <group position={[0, -1, 0]}>
          {/* Building: a bit smaller and sunk half a unit so the floor sits on Y=0 */}
          <Building
            scale={[0.75, 0.75, 0.75]}   // 25 % smaller
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}  // face the camera
          />

          {/* Kiosk: tiny + offset to the building’s right‑front corner */}
          <Recycletek
            scale={0.7}  // adjust until it looks right
            position={[2, 0, 2.6]}    // X → right, Z → toward camera
            rotation={[0, -Math.PI / -2, 0]}
          />
        </group>
      </Suspense>

      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0.3, 0]}        // focus a little above the ground
      />
    </Canvas>
  );
}
