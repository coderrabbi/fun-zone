import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// All streak travel happens in a vertex shader; the CPU updates one uniform only.
export function WarpTunnel({ mobile, reduced, progress }) {
  const group = useRef(),
    material = useRef();
  const geometry = useMemo(() => {
    const count = mobile ? 36 : 140;
    const vertices = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399963,
        radius = 1.6 + ((i * 17) % 37) / 12;
      for (let n = 0; n < 2; n++) {
        const j = i * 6 + n * 3;
        vertices[j] = Math.cos(angle) * radius;
        vertices[j + 1] = Math.sin(angle) * radius;
        vertices[j + 2] = -((i * 1.73) % 18) - n * 0.32;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return g;
  }, [mobile]);
  const uniforms = useMemo(() => ({ time: { value: 0 }, strength: { value: 0 } }), []);
  useFrame((state) => {
    const p = progress.current;
    const strength = Math.max(0, (p - 0.84) / 0.16);
    group.current.visible = !reduced && strength > 0;
    material.current.uniforms.time.value = state.clock.elapsedTime;
    material.current.uniforms.strength.value = strength;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.18;
  });
  return (
    <group ref={group}>
      <lineSegments geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`uniform float time; uniform float strength; varying float alpha; void main(){vec3 p=position; p.z=mod(p.z+time*(1.0+strength*3.0),18.0)-15.0; alpha=smoothstep(-15.0,-8.0,p.z)*(1.0-smoothstep(0.0,3.0,p.z))*strength; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`}
          fragmentShader={`varying float alpha; void main(){gl_FragColor=vec4(0.58,0.45,1.0,alpha*0.65);}`}
        />
      </lineSegments>
    </group>
  );
}

export function OrbitCage({ mobile, reduced, heroProgress }) {
  const root = useRef();
  useFrame((_, delta) => {
    if (!root.current) return;
    root.current.visible = heroProgress.current < 1;
    if (reduced) return;
    // Calm, smooth rotation around its tilted orbital plane
    root.current.rotation.z += delta * 0.12;
  });

  return (
    <group
      ref={root}
      position={[0, mobile ? 0.75 : 1.05, -0.4]}
      rotation={[1.15, 0.22, -0.1]}
      scale={mobile ? 0.72 : 1}
    >
      {/* Clean Inner Neon Cyan Halo */}
      <mesh>
        <torusGeometry args={[1.72, 0.009, 12, mobile ? 64 : 96]} />
        <meshStandardMaterial
          color="#29d9ff"
          emissive="#00b4ff"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Clean Outer Cyber Purple Halo */}
      <mesh>
        <torusGeometry args={[1.88, 0.006, 12, mobile ? 64 : 96]} />
        <meshStandardMaterial
          color="#a773ff"
          emissive="#8a4bff"
          emissiveIntensity={2.5}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}
