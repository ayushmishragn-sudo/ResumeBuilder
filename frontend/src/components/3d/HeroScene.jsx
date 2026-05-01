import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCard({ position, rotation, scale = 1, speed = 1, color }) {
  const meshRef = useRef();
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;
    meshRef.current.position.y = initialPos.y + Math.sin(t) * 0.3;
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.05;
    meshRef.current.rotation.y = rotation[1] + Math.cos(t * 0.3) * 0.05;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[1.6, 2.2, 0.05]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.85}
        />
      </RoundedBox>
    </group>
  );
}

function GlowOrb({ position, color, size = 0.3 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.scale.setScalar(size + Math.sin(t * 2) * 0.05);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
        roughness={0}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 50 }) {
  const meshRef = useRef();
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8
        ],
        speed: 0.2 + Math.random() * 0.5,
        size: 0.01 + Math.random() * 0.03
      });
    }
    return arr;
  }, [count]);

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <Float key={i} speed={p.speed} floatIntensity={0.5}>
          <mesh position={p.position}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color="#818cf8" transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Scene() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const { pointer } = state;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.1,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.05,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {/* Main resume cards floating in 3D space */}
      <FloatingCard
        position={[-2.5, 0.5, -1]}
        rotation={[0.1, 0.3, -0.05]}
        scale={0.8}
        speed={0.8}
        color="#6366f1"
      />
      <FloatingCard
        position={[2.5, -0.3, -0.5]}
        rotation={[-0.1, -0.2, 0.05]}
        scale={0.7}
        speed={1.2}
        color="#8b5cf6"
      />
      <FloatingCard
        position={[0, 0.2, -2]}
        rotation={[0.05, 0.1, 0]}
        scale={0.9}
        speed={1}
        color="#a78bfa"
      />
      <FloatingCard
        position={[-3.5, -1, -2]}
        rotation={[0.2, -0.3, 0.1]}
        scale={0.5}
        speed={0.6}
        color="#c084fc"
      />
      <FloatingCard
        position={[3.5, 1, -3]}
        rotation={[-0.15, 0.2, -0.1]}
        scale={0.6}
        speed={0.9}
        color="#e879f9"
      />

      {/* Glow orbs */}
      <GlowOrb position={[-4, 2, -3]} color="#6366f1" size={0.4} />
      <GlowOrb position={[4, -1.5, -4]} color="#ec4899" size={0.3} />
      <GlowOrb position={[0, 3, -5]} color="#8b5cf6" size={0.5} />

      {/* Particles */}
      <FloatingParticles count={40} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#818cf8" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#f472b6" />
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#c084fc" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#e0e7ff"
      />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0
    }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
