"use client";

import { useState } from "react";

const faces = [1, 2, 3, 4, 5, 6] as const;
type Face = (typeof faces)[number];

function rollDie(): Face {
  const idx = Math.floor(Math.random() * faces.length);
  return faces[idx];
}

export default function Home() {
  const [diceCount, setDiceCount] = useState(1);
  const [values, setValues] = useState<Face[]>([]);

  const roll = () => {
    const rolls: Face[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(rollDie());
    }
    setValues(rolls);
  };

  const total = values.reduce((sum, v) => sum + v, 0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <main className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl bg-slate-900/80 px-8 py-10 text-slate-50 shadow-xl ring-1 ring-slate-800/70">
        <h1 className="text-3xl font-semibold tracking-tight">dice-roller</h1>

        <p className="text-sm text-slate-400 text-center">
          Choisis combien de dés lancer (1 à 6), puis clique sur le bouton.
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

        {/* Affichage des dés */}
        <div className="flex flex-col items-center gap-4">
          {values.length === 0 ? (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-800 text-4xl">
              🎲
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {values.map((v, idx) => (
                <div
                  key={`${v}-${idx}`}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 text-3xl"
                >
                  {v}
                </div>
              ))}
            </div>
          )}

          {values.length > 0 && (
            <div className="text-sm text-slate-300">
              Résultats : {values.join(", ")} (total {total})
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={roll}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-emerald-500 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 hover:shadow-emerald-400/40 active:scale-[0.98]"
        >
          Lance le(s) dé(s)
        </button>
      </main>
    </div>
  );
}
