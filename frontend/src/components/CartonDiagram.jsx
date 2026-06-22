import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import ThreeEgg from './ThreeEgg';

export default function CartonDiagram({ packSize, category }) {
  const isQuail = category === 'quail';
  const color = isQuail ? '#ffffff' : '#c89b7b';
  
  // Arrange eggs in rows of 6
  const cols = 6;
  const rows = Math.ceil(packSize / cols);
  
  const eggs = [];
  for (let i = 0; i < packSize; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    // Center the grid
    const x = (col - (cols - 1) / 2) * 1.0;
    const z = (row - (rows - 1) / 2) * 1.0;
    eggs.push(
      <ThreeEgg 
        key={i} 
        position={[x, 0, z]} 
        scale={0.4} 
        eggColor={color} 
        speckled={isQuail} 
        rotating={false}
      />
    );
  }

  // Calculate height dynamically so big trays don't look squished
  const canvasHeight = Math.max(140, rows * 40);

  return (
    <div className="carton-3d" style={{ height: `${canvasHeight}px`, width: '100%', position: 'relative', marginBottom: '16px' }}>
      <Canvas camera={{ position: [0, 4, 4], fov: 40 }} style={{ borderRadius: '8px' }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} castShadow />
        <Environment preset="warehouse" />
        
        <group position={[0, -0.2, 0]}>
          {eggs}
          <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />
        </group>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}
