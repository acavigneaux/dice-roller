"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, Html } from "@react-three/drei";
import { useState, useMemo, useRef, useEffect } from "react";

const faces = [1, 2, 3, 4, 5, 6] as const;
type Face = (typeof faces)[number];

type DiceProps = {
  targetFace: Face | null;
  rolling: boolean;
};

function faceToRotation(face: Face): [number, number, number] {
  // Orientation simple: on ne cherche pas à coller à la vraie numérotation de dé,
  // juste à avoir une face "vers le haut" différente pour chaque valeur.
  switch (face) {
    case 1:
      return [0, 0, 0];
    case 2:
      return [Math.PI, 0, 0];
    case 3:
      return [Math.PI / 2, 0, 0];
    case 4:
      return [-Math.PI / 2, 0, 0];
    case 5:
      return [0, 0, Math.PI / 2];
    case 6:
      return [0, 0, -Math.PI / 2];
  }
}

function Dice({ targetFace, rolling }: DiceProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const baseRotation = useMemo<[number, number, number]>(
    () => (targetFace ? faceToRotation(targetFace) : [0.5, 0.8, 0.2]),
    [targetFace]
  );

  useEffect(() => {
    if (meshRef.current && !rolling && targetFace) {
      const [rx, ry, rz] = faceToRotation(targetFace);
      meshRef.current.rotation.set(rx, ry, rz);
    }
  }, [rolling, targetFace]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (rolling) {
      // Pendant le lancer: rotation bien visible
      meshRef.current.rotation.x += 18 * delta;
      meshRef.current.rotation.y += 22 * delta;
      meshRef.current.rotation.z += 14 * delta;
    } else if (targetFace) {
      // Hors lancer: on interpole vers la rotation cible
      const [tx, ty, tz] = faceToRotation(targetFace);
      const lerp = (a: number, b: number) =>
        a + (b - a) * Math.min(8 * delta, 1);
      meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, tx);
      meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, ty);
      meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, tz);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} rotation={baseRotation} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {/* Label 2D centré sur le dé pour afficher la valeur */}
      {targetFace && !rolling && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="rounded-full bg-slate-900/80 px-2 py-1 text-xs font-semibold text-slate-50 ring-1 ring-slate-700/80">
            {targetFace}
          </div>
        </Html>
      )}
    </group>
  );
}

function rollDie(): Face {
  const idx = Math.floor(Math.random() * faces.length);
  return faces[idx];
}

export default function Home() {
  const [diceCount, setDiceCount] = useState(1);
  const [values, setValues] = useState<Face[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (rolling) return;
    setRolling(true);

    const rolls: Face[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(rollDie());
    }
    setValues(rolls);

    // durée de l'animation avant stabilisation
    setTimeout(() => {
      setRolling(false);
    }, 1000);
  };

  const total = values.reduce((sum, v) => sum + v, 0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 rounded-2xl bg-slate-900/80 px-8 py-10 text-slate-50 shadow-xl ring-1 ring-slate-800/70">
        <h1 className="text-3xl font-semibold tracking-tight">dice-roller 3D</h1>

        <p className="text-sm text-slate-400 text-center">
          Choisis combien de dés lancer (1 à 6), puis clique sur le bouton pour
          voir les dés en 3D.
        </p>

        {/* Sélecteur de nombre de dés */}
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span>Nombre de dés :</span>
          <select
            value={diceCount}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="rounded-full border border-emerald-400/60 bg-slate-900 px-3 py-1 text-sm text-emerald-100 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Scène 3D */}
        <div className="h-80 w-full rounded-2xl bg-slate-950/60">
          <Canvas shadows camera={{ position: [0, 4, 10], fov: 40 }}>
            <color attach="background" args={["#020617"]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[6, 10, 6]}
              intensity={1.2}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Stage
              adjustCamera={false}
              intensity={0.6}
              environment="city"
              shadows="contact"
            >
              {values.length === 0 ? (
                <Dice targetFace={1} rolling={false} />
              ) : (
                values.map((v, idx) => (
                  <group
                    key={`${v}-${idx}`}
                    position={[
                      idx * 1.6 - (diceCount - 1) * 0.8,
                      0,
                      0,
                    ]}
                  >
                    <Dice targetFace={v} rolling={rolling} />
                  </group>
                ))
              )}
            </Stage>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>

        {values.length > 0 && (
          <div className="text-sm text-slate-300">
            Résultats : {values.join(", ")} (total {total})
          </div>
        )}

        <button
          type="button"
          onClick={roll}
          disabled={rolling}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-emerald-500 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 hover:shadow-emerald-400/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:text-emerald-100 disabled:shadow-none"
        >
          {rolling ? "Lancement..." : "Lancer le(s) dé(s)"}
        </button>
      </main>
    </div>
  );
}
