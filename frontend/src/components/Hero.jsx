import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import ThreeEgg from './ThreeEgg';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Pasture raised · Delivered fresh</span>
          <h1>
            Eggs the way the <em>hen</em> intended.
          </h1>
          <p className="lede">
            Free range brown eggs and speckled quail eggs, collected each
            morning and packed the same day. Pick a pack, pay online, and
            we bring breakfast to your door.
          </p>
          <div className="hero-actions">
            <a href="#brown-eggs" className="btn-primary">Shop brown eggs</a>
            <a href="#quail-eggs" className="btn-ghost">Shop quail eggs</a>
          </div>
        </div>
        <div className="hero-visual" style={{ height: '400px', width: '100%', position: 'relative', overflow: 'visible' }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ overflow: 'visible' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
              <ThreeEgg eggColor="#c89b7b" scale={1.2} rotating={false} />
            </Float>
            
            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
          </Canvas>
          <span className="price-chip chip-1">From ₹99<small>pack of 6</small></span>
          <span className="price-chip chip-2">₹499<small>tray of 30</small></span>
        </div>
      </div>
    </section>
  );
}
