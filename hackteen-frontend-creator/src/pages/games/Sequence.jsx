import React, { useState, useEffect } from "react";

const COLORS = ["red", "yellow", "green", "blue"];
const COLOR_CLASSES = {
  red: "bg-red-900",
  yellow: "bg-yellow-800",
  green: "bg-green-900",
  blue: "bg-blue-900",
};


// Sons opcionais por cor
const sounds = {
  red: new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"),
  yellow: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
  green: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
  blue: new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg"),
};

export default function Sequence() {
  const [sequence, setSequence] = useState([]);
  const [player, setPlayer] = useState([]);
  const [active, setActive] = useState(null);
  const [showing, setShowing] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  // Mostra sequência quando ela muda
  useEffect(() => {
    if (sequence.length > 0 && showing) {
      playSequence();
    }
  }, [sequence, showing]);

  // Inicia rodada
  function startRound() {
    setMessage("");
    const next = [...sequence, COLORS[Math.floor(Math.random() * COLORS.length)]];
    setSequence(next);
    setPlayer([]);
    setShowing(true);
  }

  // Reproduz sequência animada
  function playSequence() {
    sequence.forEach((color, i) => {
      setTimeout(() => {
        flashColor(color);
      }, i * 800);
    });
    setTimeout(() => setShowing(false), sequence.length * 800 + 500);
  }

  // Faz cor piscar + som
  function flashColor(color) {
    setActive(color);
    sounds[color]?.play();
    setTimeout(() => setActive(null), 500);
  }

  // Jogador escolhe cor
  function handlePick(color) {
    if (showing) return;
    flashColor(color);
    const nextPlayer = [...player, color];
    setPlayer(nextPlayer);

    const i = nextPlayer.length - 1;
    if (nextPlayer[i] !== sequence[i]) {
      setMessage("❌ Errado! Reiniciando...");
      setScore(0);
      setSequence([]);
      setPlayer([]);
      return;
    }

    if (nextPlayer.length === sequence.length) {
      setScore((s) => s + 1);
      setMessage("✅ Correto! Prepare-se...");
      setTimeout(() => startRound(), 1200);
    }
  }

  function resetGame() {
    setSequence([]);
    setPlayer([]);
    setScore(0);
    setMessage("🔄 Jogo reiniciado");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold">🟦🟩🟨🟥 Jogo da Sequência</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Observe e repita a sequência de cores.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 w-64 mx-auto">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => handlePick(c)}
            disabled={showing}
            className={`h-28 rounded-lg transition 
              ${COLOR_CLASSES[c]} 
              ${active === c ? "brightness-150 scale-105" : "brightness-100"} 
              focus:outline-none`}
          />
        ))}
      </div>

      <div className="mt-4 space-x-3">
        <button
          onClick={startRound}
          disabled={showing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Iniciar
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 border rounded hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 text-lg">Pontuação: <strong>{score}</strong></div>
      {message && <div className="mt-2 text-gray-700">{message}</div>}
    </main>
  );
}
