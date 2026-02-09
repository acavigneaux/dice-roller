"use client";

import { useState } from "react";

const faces = [1, 2, 3, 4, 5, 6] as const;
type Face = (typeof faces)[number];

function rollDie(): Face {
  const idx = Math.floor(Math.random() * faces.length);
  return faces[idx];
}

export default function Home() {
  const [value, setValue] = useState<Face | null>(null);

  const roll = () => {
    setValue(rollDie());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <main className="flex flex-col items-center gap-8 rounded-2xl bg-slate-900/80 px-10 py-12 text-slate-50 shadow-xl ring-1 ring-slate-800/70">
        <h1 className="text-3xl font-semibold tracking-tight">dice-roller</h1>

        <p className="text-sm text-slate-400">
          Clique sur le bouton pour lancer un dé à 6 faces.
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-800 text-4xl font-bold">
            {value ?? "🎲"}
          </div>

          {value && (
            <div className="text-sm text-slate-300">Résultat : {value}</div>
          )}
        </div>

        <button
          type="button"
          onClick={roll}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-emerald-500 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 hover:shadow-emerald-400/40 active:scale-[0.98]"
        >
          Roll Dice
        </button>
      </main>
    </div>
  );
}
