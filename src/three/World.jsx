import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMobileGraphics, usePageVisible } from '../hooks/usePreferences';
import RenderBudget from './RenderBudget';
import { WarpTunnel, OrbitCage } from './CinematicFX';
function Ring({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radius = 2,
  color = '#b777ff',
  tube = 0.015,
  mobile = false,
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[radius, tube, mobile ? 6 : 12, mobile ? 48 : 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
    </mesh>
  );
}
function Headset({ mobile }) {
  const rounded = { smoothness: mobile ? 2 : 5, bevelSegments: mobile ? 1 : 4 };
  return (
    <group rotation={[0.15, -0.28, -0.13]}>
      <mesh position={[0, 0.13, -0.2]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
        <torusGeometry args={[1.03, 0.15, 12, 64, Math.PI * 1.65]} />
        <meshStandardMaterial color="#292333" roughness={0.4} metalness={0.6} />
      </mesh>
      <RoundedBox args={[2.45, 1.25, 0.87]} radius={0.3} {...rounded}>
        <meshStandardMaterial color="#ccc1dc" metalness={0.45} roughness={0.24} />
      </RoundedBox>
      <RoundedBox position={[0, 0.035, 0.47]} args={[2.25, 1.06, 0.13]} radius={0.28} {...rounded}>
        {mobile ? (
          <meshStandardMaterial color="#170f2d" metalness={0.7} roughness={0.2} />
        ) : (
          <meshPhysicalMaterial color="#170f2d" metalness={0.85} roughness={0.16} clearcoat={1} />
        )}
      </RoundedBox>
      <RoundedBox position={[0, 0.015, 0.55]} args={[2.03, 0.85, 0.025]} radius={0.22} {...rounded}>
        <meshStandardMaterial color="#39205b" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <mesh position={[-0.73, 0.16, 0.58]}>
        <sphereGeometry args={[0.095, 20, 16]} />
        <meshStandardMaterial color="#0a0815" metalness={0.7} roughness={0.05} />
      </mesh>
      <mesh position={[0.73, 0.16, 0.58]}>
        <sphereGeometry args={[0.095, 20, 16]} />
        <meshStandardMaterial color="#0a0815" metalness={0.7} roughness={0.05} />
      </mesh>
      <RoundedBox
        position={[0, -0.29, 0.58]}
        args={[1.13, 0.022, 0.016]}
        radius={0.008}
        {...rounded}
      >
        <meshStandardMaterial color="#be94ff" emissive="#985eff" emissiveIntensity={5} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <RoundedBox
          key={s}
          position={[s * 1.24, 0.05, -0.05]}
          args={[0.15, 0.56, 0.5]}
          radius={0.07}
          {...rounded}
        >
          <meshStandardMaterial color="#ddd5e7" metalness={0.35} roughness={0.3} />
        </RoundedBox>
      ))}
      <mesh position={[0, 0.48, 0.57]}>
        <boxGeometry args={[0.22, 0.027, 0.013]} />
        <meshBasicMaterial color="#bdff63" />
      </mesh>
    </group>
  );
}
function Controller({ mobile }) {
  return (
    <group rotation={[0.2, 0.2, -0.3]}>
      <RoundedBox
        args={[0.85, 0.4, 0.25]}
        radius={0.16}
        smoothness={mobile ? 2 : 4}
        bevelSegments={mobile ? 1 : 4}
      >
        <meshStandardMaterial color="#e2d5ef" metalness={0.35} roughness={0.28} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.29, -0.18, 0]} rotation={[0, 0, s * 0.35]}>
          <capsuleGeometry args={[0.12, 0.25, 4, 12]} />
          <meshStandardMaterial color="#d6c5e8" />
        </mesh>
      ))}
      <mesh position={[-0.2, 0.01, 0.14]}>
        <boxGeometry args={[0.2, 0.055, 0.035]} />
        <meshStandardMaterial color="#322341" />
      </mesh>
      <mesh position={[-0.2, 0.01, 0.15]}>
        <boxGeometry args={[0.055, 0.2, 0.035]} />
        <meshStandardMaterial color="#322341" />
      </mesh>
      {[
        [0.19, 0.06],
        [0.28, -0.02],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.14]}>
          <sphereGeometry args={[0.043, 12, 8]} />
          <meshStandardMaterial
            color={i ? '#a8ff69' : '#bd7aff'}
            emissive={i ? '#a8ff69' : '#bd7aff'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
function Scene({ reduced, mobile }) {
  const invalidate = useThree((state) => state.invalidate);
  const headset = useRef(),
    objects = useRef(),
    portal = useRef(),
    dust = useRef();
  const progress = useRef(0),
    heroProgress = useRef(0),
    velocity = useRef(0),
    burst = useRef(0),
    pointer = useRef({ x: 0, y: 0 });
  const count = reduced ? 80 : mobile ? 160 : 2000;
  const positions = useMemo(() => {
    let a = new Float32Array(count * 3);
    let seed = 19;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < a.length; i += 3) {
      a[i] = (random() - 0.5) * 25;
      a[i + 1] = (random() - 0.5) * 24;
      a[i + 2] = (random() - 0.5) * 14;
    }
    return a;
  }, [count]);
  const originalPositions = useMemo(() => positions.slice(), [positions]);
  useEffect(() => {
    let previous = scrollY;
    const f = () => {
      velocity.current = Math.min(Math.abs(scrollY - previous) * 0.002, 0.25);
      previous = scrollY;
      progress.current = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      invalidate();
    };
    const move = (e) => {
      pointer.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: 1 - (e.clientY / innerHeight) * 2,
      };
    };
    if (!mobile) addEventListener('pointermove', move, { passive: true });
    const click = () => {
      burst.current = 1;
    };
    addEventListener('scroll', f, { passive: true });
    if (!mobile) addEventListener('pointerdown', click);
    f();
    return () => {
      removeEventListener('scroll', f);
      removeEventListener('pointerdown', click);
      removeEventListener('pointermove', move);
    };
  }, [mobile, invalidate]);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime,
      p = progress.current;
    const heroP = Math.min(scrollY / innerHeight, 1);
    heroProgress.current = heroP;
    const end = Math.max(0, (p - 0.85) / 0.15);
    const k = 1 - Math.exp(-delta * 4);
    if (headset.current) {
      headset.current.visible = heroP < 1;
      headset.current.position.y = THREE.MathUtils.lerp(
        headset.current.position.y,
        mobile ? 0.75 : 1.05,
        k,
      );
      headset.current.position.z = reduced || mobile ? 0 : heroP * 3;
      headset.current.rotation.y = THREE.MathUtils.lerp(
        headset.current.rotation.y,
        reduced ? 0 : pointer.current.x * 0.18 + heroP * 0.8,
        k,
      );
      headset.current.rotation.x = reduced ? 0 : pointer.current.y * -0.1;
      headset.current.scale.setScalar(mobile ? 0.72 : 1.2);
    }
    if (objects.current) {
      objects.current.visible = heroP < 1;
      objects.current.rotation.z = reduced ? 0 : Math.sin(t * 0.18) * 0.08;
      objects.current.scale.setScalar(mobile ? 0.85 : 1 + heroP * 0.9);
    }
    if (portal.current) {
      portal.current.visible = heroP > 0.5;
      portal.current.rotation.z = reduced ? 0 : t * 0.09;
      portal.current.position.z = reduced ? -3 : -6 + p * 7;
      portal.current.scale.setScalar(0.75 + end * 0.4);
      portal.current.position.x = Math.sin(p * Math.PI * 4) * (mobile ? 0.3 : 1.4);
      portal.current.children.forEach((ring) => {
        ring.material.emissiveIntensity = 2 + end * 4;
      });
    }
    if (dust.current) {
      dust.current.rotation.y = reduced ? 0 : t * 0.015 + pointer.current.x * 0.018;
      dust.current.position.y = reduced ? 0 : -p * 2;
      dust.current.scale.y = reduced ? 1 : 1 + velocity.current + burst.current * 0.035;
      if (!reduced && !mobile) {
        const coords = dust.current.geometry.attributes.position;
        const px = pointer.current.x * 6,
          py = pointer.current.y * 4;
        for (let i = 0; i < count; i++) {
          const j = i * 3,
            x = originalPositions[j],
            y = originalPositions[j + 1];
          const dx = x - px,
            dy = y - py,
            distance = Math.hypot(dx, dy);
          const push = mobile ? 0 : Math.max(0, 1 - distance / 1.2) * 0.3;
          const explosion = burst.current * Math.max(0, 1 - distance / 2.2) * 0.7;
          const suction = 1 - end * ((t * 0.17 + i / count) % 1) * 0.8;
          coords.array[j] = (x + dx * (push + explosion)) * suction;
          coords.array[j + 1] = (y + dy * (push + explosion)) * suction;
        }
        coords.needsUpdate = true;
      }
      velocity.current *= 0.93;
      burst.current *= 0.93;
    }
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      reduced ? 0 : pointer.current.x * 0.12,
      k,
    );
  });
  return (
    <>
      <ambientLight intensity={1.3} />
      <OrbitCage mobile={mobile} reduced={reduced} heroProgress={heroProgress} />
      <WarpTunnel mobile={mobile} reduced={reduced} progress={progress} />
      <directionalLight position={[3, 5, 4]} intensity={3} color="#e6d3ff" />
      <pointLight position={[-4, 2, 2]} intensity={35} color="#9144ff" />
      {!mobile && <pointLight position={[4, -1, 3]} intensity={25} color="#51c7ff" />}
      {!mobile && <pointLight position={[0, 4, -3]} intensity={40} color="#ff73b9" />}
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={mobile ? 0.018 : 0.022}
          color="#bca0ed"
          transparent
          opacity={0.48}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <group ref={headset}>
        <Float
          speed={reduced ? 0 : 1.5}
          rotationIntensity={reduced ? 0 : 0.12}
          floatIntensity={reduced ? 0 : 0.3}
        >
          <Headset mobile={mobile} />
        </Float>
      </group>
      <group ref={objects}>
        <group
          position={[mobile ? -1.35 : -2.6, mobile ? 0.9 : 1.0, 0.1]}
          scale={mobile ? 0.65 : 1}
        >
          <Float speed={reduced ? 0 : 2} floatIntensity={0.4}>
            <Controller mobile={mobile} />
          </Float>
        </group>
        <group position={[mobile ? 1.4 : 2.8, 1.85, -0.7]} rotation={[0.4, 0.6, 0.3]}>
          <Ring radius={mobile ? 0.25 : 0.38} color="#bdff63" tube={0.07} mobile={mobile} />
        </group>
        <mesh
          position={[mobile ? 1.5 : 2.45, mobile ? -0.15 : -0.15, 0]}
          rotation={[0.5, 0.5, 0.2]}
        >
          <octahedronGeometry args={[mobile ? 0.15 : 0.22]} />
          <meshStandardMaterial
            color="#a45fff"
            metalness={0.55}
            roughness={0.2}
            emissive="#6125b4"
            emissiveIntensity={0.3}
          />
        </mesh>
        <group position={[0, 1, -1]} rotation={[0.9, 0.1, -0.25]}>
          <Ring radius={mobile ? 1.85 : 2.65} color="#9b5bff" tube={0.009} mobile={mobile} />
          {!mobile && <Ring radius={2.8} color="#4c306b" tube={0.006} />}
        </group>
      </group>
      <group ref={portal} position={[0, 0, -5]}>
        {(mobile ? [0, 1, 2] : [0, 1, 2, 3, 4]).map((i) => (
          <Ring
            key={i}
            radius={2 + i * 0.2}
            position={[0, 0, -i * 0.4]}
            color={i % 2 ? '#6954ea' : '#b06fff'}
            tube={i === 0 ? 0.045 : 0.014}
            mobile={mobile}
          />
        ))}
      </group>
    </>
  );
}
export default function World({ reduced }) {
  const visible = usePageVisible();
  const mobile = useMobileGraphics();
  const [inScene, setInScene] = useState(true);
  useEffect(() => {
    const intersecting = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) intersecting.add(entry.target);
        else intersecting.delete(entry.target);
      });
      setInScene(intersecting.size > 0);
    });
    document.querySelectorAll('#home, .finale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const active = visible && (!mobile || inScene);
  return (
    <div
      className="world"
      aria-hidden="true"
      data-active={active}
      style={{ visibility: mobile && !inScene ? 'hidden' : 'visible' }}
    >
      <Canvas
        dpr={mobile ? 1 : [1, 1.7]}
        frameloop={!active ? 'never' : reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        fallback={<div className="scene-fallback" />}
      >
        <Scene reduced={reduced} mobile={mobile} />
        <RenderBudget mobile={mobile} active={active} />
      </Canvas>
    </div>
  );
}
