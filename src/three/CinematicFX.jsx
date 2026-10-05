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
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    root.current.visible = heroProgress.current < 1;
    if (reduced) return;
    root.current.children.forEach((ring, i) => {
      ring.rotation.z = t * (i % 2 ? -0.19 : 0.15) + i * 1.4;
      ring.rotation.x = 0.9 + Math.sin(t * 0.25 + i) * 0.22;
      ring.rotation.y = Math.cos(t * 0.2 + i) * 0.2;
    });
  });
  return (
    <group ref={root} position={[0, mobile ? 0.75 : 1.05, -0.6]} scale={mobile ? 0.75 : 1}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[1, 0, i]}>
          <torusGeometry
            args={[1.9 + i * 0.2, 0.012, 5, mobile ? 64 : 80, Math.PI * (i === 1 ? 1.15 : 0.65)]}
          />
          <meshBasicMaterial color={i === 1 ? '#bdff63' : '#b778ff'} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}
