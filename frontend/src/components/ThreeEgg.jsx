import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ThreeEgg({ 
  eggColor = '#dfa576', 
  speckled = false, 
  scale = 1, 
  rotating = true,
  ...props 
}) {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (rotating && mesh.current) {
      mesh.current.rotation.y += delta * 0.2;
    }
  });

  // Basic procedural speckles using a canvas texture so we don't need external image assets
  const speckledTexture = useMemo(() => {
    if (!speckled) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Base color
    context.fillStyle = '#e8e2d2';
    context.fillRect(0, 0, 512, 512);
    
    // Procedural Speckles
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 2.5;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fillStyle = `rgba(80, 70, 60, ${Math.random() * 0.8})`;
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [speckled]);

  return (
    <mesh ref={mesh} scale={[scale, scale * 1.35, scale]} castShadow receiveShadow {...props}>
      {/* A sphere stretched in the Y-axis makes a perfect egg shape */}
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        color={speckled ? '#ffffff' : eggColor} 
        map={speckledTexture}
        roughness={0.65} 
        metalness={0.05}
      />
    </mesh>
  );
}
