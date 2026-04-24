'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Participante {
  id: number;
  nome?: string;
  participante?: string;
}

const BALL_COLOR = '#C0392B';

interface BallData {
  id: number;
  nome?: string;
  participante?: string;
  color: string;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  radius: number;
}

function Ball({ data, isWinner, showWinner }: { data: BallData; isWinner: boolean; showWinner: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.copy(data.pos);
    if (glowRef.current) {
      glowRef.current.visible = isWinner && showWinner;
      if (isWinner && showWinner) {
        const s = 1 + Math.sin(Date.now() * 0.008) * 0.15;
        glowRef.current.scale.setScalar(s);
      }
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <sphereGeometry args={[data.radius, 24, 24]} />
        <meshPhongMaterial color={data.color} shininess={120} specular="#ffffff" />
      </mesh>
      <mesh ref={glowRef} visible={false}>
        <sphereGeometry args={[data.radius * 1.6, 16, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.25} />
      </mesh>
      <Text
        position={[0, 0, data.radius + 0.001]}
        fontSize={data.radius * 0.65}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        outlineWidth={0.008}
        outlineColor="#00000066"
      >
        {(() => { const n = data.participante || data.nome || '?'; return n.length > 4 ? n.substring(0, 3) : n; })()}
      </Text>
      <Text
        position={[0, 0, -(data.radius + 0.001)]}
        rotation={[0, Math.PI, 0]}
        fontSize={data.radius * 0.65}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        outlineWidth={0.008}
        outlineColor="#00000066"
      >
        {(() => { const n = data.participante || data.nome || '?'; return n.length > 4 ? n.substring(0, 3) : n; })()}
      </Text>
    </group>
  );
}

function Scene({
  participantes,
  spinCount,
  onSpinComplete,
  winnerIndex,
}: {
  participantes: Participante[];
  spinCount: number;
  onSpinComplete: () => void;
  winnerIndex: number;
}) {
  const sphereRef = useRef<THREE.Group>(null);
  const [balls, setBalls] = useState<BallData[]>([]);
  const ballsPhysics = useRef<BallData[]>([]);
  const spinActive = useRef(false);
  const spinTimer = useRef(0);
  const currentPhase = useRef<'idle' | 'spinning' | 'slowing' | 'reveal'>('idle');
  const [showWinner, setShowWinner] = useState(false);
  const rotSpeedX = useRef(0);
  const rotSpeedZ = useRef(0);
  const completeCalled = useRef(false);
  const lastSpinCount = useRef(0);

  const GLOBE_R = 2.3;
  const BALL_R = participantes.length > 12 ? 0.18 : participantes.length > 8 ? 0.22 : 0.28;

  // Criar bolas
  useEffect(() => {
    const list = participantes.length > 0
      ? participantes
      : Array.from({ length: 6 }, (_, i) => ({ id: -(i + 1), participante: '?' }));

    const newBalls = list.map((p) => ({
      id: p.id,
      participante: (p as any).participante || (p as any).nome || '?',
      color: BALL_COLOR,
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ),
      radius: BALL_R,
    }));
    ballsPhysics.current = newBalls;
    setBalls(newBalls);
    setShowWinner(false);
  }, [participantes, BALL_R]);

  // Detectar click em sortear (spinCount muda toda vez)
  useEffect(() => {
    if (spinCount > 0 && spinCount !== lastSpinCount.current) {
      lastSpinCount.current = spinCount;
      currentPhase.current = 'spinning';
      spinTimer.current = 0;
      spinActive.current = true;
      completeCalled.current = false;
      setShowWinner(false);
      rotSpeedX.current = 6;
      rotSpeedZ.current = 8;

      // Dar impulso forte nas bolas
      for (const b of ballsPhysics.current) {
        b.vel.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
        );
      }
    }
  }, [spinCount]);

  useFrame((_, dt) => {
    const clampedDt = Math.min(dt, 0.033);

    // === ROTACAO DA ESFERA (so a esfera, nao a base) ===
    if (sphereRef.current) {
      if (spinActive.current) {
        sphereRef.current.rotation.x += rotSpeedX.current * clampedDt;
        sphereRef.current.rotation.z += rotSpeedZ.current * clampedDt;
      }
      // No idle, nao gira
    }

    // === FASES DO SORTEIO ===
    if (spinActive.current) {
      spinTimer.current += clampedDt;

      if (currentPhase.current === 'spinning' && spinTimer.current > 3.5) {
        currentPhase.current = 'slowing';
        spinTimer.current = 0;
      }

      if (currentPhase.current === 'slowing') {
        rotSpeedX.current *= 0.95;
        rotSpeedZ.current *= 0.95;

        if (rotSpeedX.current < 0.05 && !completeCalled.current) {
          currentPhase.current = 'reveal';
          rotSpeedX.current = 0;
          rotSpeedZ.current = 0;
          spinActive.current = false;
          completeCalled.current = true;
          setShowWinner(true);

          // Bola vencedora sobe
          const w = ballsPhysics.current[winnerIndex];
          if (w) {
            w.vel.set(0, 10, 0);
          }

          setTimeout(() => {
            onSpinComplete();
          }, 1500);
        }
      }
    }

    // === FISICA DAS BOLAS ===
    const bList = ballsPhysics.current;
    const isActive = spinActive.current;
    const time = performance.now() * 0.001;

    for (let i = 0; i < bList.length; i++) {
      const b = bList[i];

      // Gravidade
      b.vel.y += -12 * clampedDt;

      // Turbulencia constante leve (bolas nunca ficam 100% paradas)
      b.vel.x += (Math.random() - 0.5) * 2 * clampedDt;
      b.vel.z += (Math.random() - 0.5) * 2 * clampedDt;

      // Turbulencia forte durante spin
      if (isActive && currentPhase.current === 'spinning') {
        b.vel.x += (Math.random() - 0.5) * 35 * clampedDt;
        b.vel.y += (Math.random() - 0.3) * 35 * clampedDt; // bias pra cima
        b.vel.z += (Math.random() - 0.5) * 35 * clampedDt;
      }

      // Limitar velocidade
      const maxSpd = isActive ? 14 : 8;
      const spd = b.vel.length();
      if (spd > maxSpd) b.vel.multiplyScalar(maxSpd / spd);

      // Damping leve (quase nenhum — bolas ficam vivas)
      b.vel.multiplyScalar(isActive ? 0.999 : 0.997);

      // Mover
      b.pos.x += b.vel.x * clampedDt;
      b.pos.y += b.vel.y * clampedDt;
      b.pos.z += b.vel.z * clampedDt;

      // Colisao com o globo — bounce forte + empurra pra dentro
      const dist = b.pos.length();
      const maxDist = GLOBE_R - b.radius;
      if (dist > maxDist) {
        const n = b.pos.clone().normalize();
        // Posiciona levemente dentro da esfera
        b.pos.copy(n.clone().multiplyScalar(maxDist - 0.02));

        // Reflexao com bounce alto
        const dot = b.vel.dot(n);
        b.vel.sub(n.clone().multiplyScalar(2 * dot));
        b.vel.multiplyScalar(0.85);

        // Empurrão extra pra dentro (evita grudar)
        b.vel.add(n.clone().multiplyScalar(-2.5));
      }

      // Colisao entre bolas — empurra com mais forca
      for (let j = i + 1; j < bList.length; j++) {
        const o = bList[j];
        const diff = new THREE.Vector3().subVectors(b.pos, o.pos);
        const distance = diff.length();
        const minDist = b.radius + o.radius;

        if (distance < minDist && distance > 0.001) {
          const normal = diff.normalize();
          const overlap = minDist - distance;

          // Separar com mais forca
          b.pos.add(normal.clone().multiplyScalar(overlap * 0.6));
          o.pos.sub(normal.clone().multiplyScalar(overlap * 0.6));

          // Trocar velocidades com impulso
          const relVel = new THREE.Vector3().subVectors(b.vel, o.vel);
          const velN = relVel.dot(normal);
          if (velN > 0) {
            const imp = normal.clone().multiplyScalar(velN * 0.6);
            b.vel.sub(imp);
            o.vel.add(imp);
          }

          // Empurrão extra de separacao
          b.vel.add(normal.clone().multiplyScalar(1.5));
          o.vel.sub(normal.clone().multiplyScalar(1.5));
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 8]} intensity={1.2} color="#FFF5E8" />
      <directionalLight position={[-4, -3, 5]} intensity={0.4} color="#E8D5C0" />
      <pointLight position={[0, 3, 4]} intensity={0.6} color="#D4B896" />

      {/* BASE FIXA - nunca gira */}
      <mesh position={[0, -2.8, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 0.5, 32]} />
        <meshPhongMaterial color="#3D2B1F" shininess={40} />
      </mesh>
      <mesh position={[0, -2.55, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
        <meshPhongMaterial color="#C8A87E" shininess={100} specular="#FFE8C0" />
      </mesh>

      {/* ESFERA + BOLAS - gira junto no sorteio */}
      <group ref={sphereRef}>
        {/* Esfera transparente */}
        <mesh>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            roughness={0.05}
            metalness={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Wireframe */}
        <mesh>
          <sphereGeometry args={[2.51, 20, 20]} />
          <meshBasicMaterial color="#C8A87E" wireframe transparent opacity={0.1} />
        </mesh>

        {/* Aro horizontal */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.55, 0.06, 16, 64]} />
          <meshPhongMaterial color="#C8A87E" shininess={120} specular="#FFE8C0" />
        </mesh>

        {/* Aro vertical */}
        <mesh>
          <torusGeometry args={[2.55, 0.06, 16, 64]} />
          <meshPhongMaterial color="#C8A87E" shininess={120} specular="#FFE8C0" />
        </mesh>

        {/* Saida topo */}
        <mesh position={[0, 2.55, 0]}>
          <cylinderGeometry args={[0.35, 0.25, 0.3, 16]} />
          <meshPhongMaterial color="#C8A87E" shininess={100} specular="#FFE8C0" />
        </mesh>

        {/* Bolas */}
        {balls.map((b, i) => (
          <Ball
            key={b.id}
            data={b}
            isWinner={i === winnerIndex}
            showWinner={showWinner}
          />
        ))}
      </group>
    </>
  );
}

export default function RouletteWheel({
  participantes,
  spinCount,
  onSpinComplete,
  winnerIndex,
  fullscreen,
}: {
  participantes: Participante[];
  spinCount: number;
  onSpinComplete: () => void;
  winnerIndex: number;
  fullscreen?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const h = fullscreen ? '100%' : 620;
  if (!mounted) return <div style={{ width: '100%', height: h }} />;

  return (
    <div style={{ width: '100%', height: h }}>
      <Canvas
        camera={{ position: [0, 0, 11], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Scene
          participantes={participantes}
          spinCount={spinCount}
          onSpinComplete={onSpinComplete}
          winnerIndex={winnerIndex}
        />
      </Canvas>
    </div>
  );
}
