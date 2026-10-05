import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox as DetailedBox, Float } from '@react-three/drei';
import { useVisible, useMobileGraphics, usePageVisible } from '../hooks/usePreferences';
import RenderBudget from './RenderBudget';
import { sceneDpr } from './resolution';
// Small scene props do not need dense bevel geometry on either screen size.
function RoundedBox(props) {
  return <DetailedBox {...props} smoothness={4} bevelSegments={3} />;
}
function Machine({ position, color, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[1.1, 2, 0.8]} radius={0.07}>
        <meshStandardMaterial color="#181024" metalness={0.55} roughness={0.3} />
      </RoundedBox>
      <RoundedBox position={[0, 0.32, 0.43]} args={[0.89, 0.84, 0.05]} radius={0.05}>
        <meshStandardMaterial color="#161328" emissive={color} emissiveIntensity={0.22} />
      </RoundedBox>
      <mesh position={[0, 0.34, 0.47]}>
        <torusGeometry args={[0.27, 0.018, 8, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      <RoundedBox position={[0, 0.99, 0.03]} args={[1.14, 0.22, 0.86]} radius={0.03}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </RoundedBox>
      <RoundedBox position={[0, -0.3, 0.53]} args={[1.1, 0.15, 0.44]} radius={0.04}>
        <meshStandardMaterial color="#2d223c" />
      </RoundedBox>
      <mesh position={[-0.25, -0.18, 0.57]}>
        <cylinderGeometry args={[0.035, 0.035, 0.22]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh position={[-0.25, -0.06, 0.57]}>
        <sphereGeometry args={[0.08, 16, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.1 + i * 0.12, -0.2, 0.59]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.035, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      <mesh position={[0, -0.93, 0.411]}>
        <boxGeometry args={[0.85, 0.02, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
    </group>
  );
}
function Wheel({ reduced }) {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current && !reduced)
      ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.6) * 0.15;
  });
  return (
    <group ref={ref} rotation={[0.2, -0.25, 0]}>
      <mesh>
        <torusGeometry args={[1.45, 0.19, 16, 80]} />
        <meshStandardMaterial color="#211c2a" metalness={0.4} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0, -0.015]}>
        <torusGeometry args={[1.47, 0.026, 12, 80]} />
        <meshStandardMaterial color="#bdff63" emissive="#8ccb4d" emissiveIntensity={2} />
      </mesh>
      {[0, 2.1, 4.2].map((r, i) => (
        <group key={i} rotation={[0, 0, r]}>
          <RoundedBox args={[1.3, 0.3, 0.12]} position={[0.5, 0, 0]} radius={0.08}>
            <meshStandardMaterial color="#726281" metalness={0.8} roughness={0.25} />
          </RoundedBox>
        </group>
      ))}
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.38, 0.4, 0.22, 32]} />
        <meshStandardMaterial color="#392b47" />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color="#bdff63" emissive="#bdff63" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.45, 0.1]}>
        <boxGeometry args={[0.12, 0.24, 0.13]} />
        <meshStandardMaterial color="#baff5a" />
      </mesh>
    </group>
  );
}
function KidsShapes({ reduced }) {
  return (
    <group>
      <Float speed={reduced ? 0 : 1.7} floatIntensity={reduced ? 0 : 0.5}>
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.9, 32, 24]} />
          <meshStandardMaterial color="#b298ff" roughness={0.3} />
        </mesh>
        {[-0.28, 0.28].map((x) => (
          <mesh key={x} position={[x, -0.08, 0.82]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshStandardMaterial color="#25203e" />
          </mesh>
        ))}
        <mesh position={[0, -0.35, 0.86]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.2, 0.035, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#332149" />
        </mesh>
      </Float>
      {[
        [-1.4, 0.8, '#ffbf61', 0.44],
        [1.3, 1, '#9ef1d3', 0.5],
        [1.3, -0.9, '#ff94bb', 0.28],
        [-1.3, -0.9, '#9ad6ff', 0.24],
      ].map(([x, y, c, size], i) => (
        <Float key={i} speed={reduced ? 0 : 1 + i * 0.2} floatIntensity={reduced ? 0 : 0.6}>
          <mesh position={[x, y, -0.3]}>
            <sphereGeometry args={[size, 24, 16]} />
            <meshStandardMaterial color={c} roughness={0.24} />
          </mesh>
        </Float>
      ))}
      <mesh position={[0, 1.25, -0.5]} rotation={[0.4, 0.2, 0.4]}>
        <octahedronGeometry args={[0.26]} />
        <meshStandardMaterial color="#ffee9e" />
      </mesh>
    </group>
  );
}
export default function PlayScene({ kind, reduced }) {
  const ref = useRef();
  const visible = useVisible(ref);
  const pageVisible = usePageVisible();
  const mobile = useMobileGraphics();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);
  const active = visible && pageVisible;
  return (
    <div
      ref={ref}
      className="play-canvas"
      aria-hidden="true"
      data-active={active}
      data-scene={kind}
    >
      {mounted && (
        <Canvas
          frameloop={!active ? 'never' : reduced || kind === 'arcade' ? 'demand' : 'always'}
          dpr={sceneDpr(mobile, window.devicePixelRatio)}
          camera={{ position: [0, 0, 6], fov: 43 }}
          gl={{ powerPreference: 'low-power', alpha: true, antialias: true }}
        >
          <ambientLight intensity={1.6} />
          <directionalLight position={[3, 4, 5]} intensity={3} />
          <pointLight position={[-3, 1, 3]} color="#b777ff" intensity={25} />
          <RenderBudget mobile={mobile} active={active && kind !== 'arcade'} />
          {kind === 'arcade' ? (
            <group position={[0, 0.1, 0]}>
              <Machine position={[-1.2, 0, -0.55]} color="#98e7ff" rotation={0.3} />
              <Machine position={[0, 0, 0]} color="#c188ff" />
              <Machine position={[1.2, 0, -0.55]} color="#ff8aac" rotation={-0.3} />
            </group>
          ) : kind === 'racing' ? (
            <Wheel reduced={reduced} />
          ) : (
            <KidsShapes reduced={reduced} />
          )}
        </Canvas>
      )}
    </div>
  );
}
