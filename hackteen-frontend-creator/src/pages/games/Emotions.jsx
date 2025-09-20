import React, { useState } from 'react';

/*
  Simple Emotions game:
  - Shows one face (emoji or image) and asks to pick the right label
  - Provides immediate feedback and keeps score
  - Uses emojis for simplicity (accessible & clear)
*/

const cards = [
  { id: 1, emoji: '😀', label: 'Feliz' },
  { id: 2, emoji: '😢', label: 'Triste' },
  { id: 3, emoji: '😠', label: 'Bravo' },
  { id: 4, emoji: '😮', label: 'Surpreso' },
  { id: 5, emoji: '😐', label: 'Neutro' }
];

export default function Emotions() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  function handlePick(label) {
    const correct = cards[index].label === label;
    if (correct) {
      setScore(s => s + 1);
      setFeedback('Correto 🎉');
    } else {
      setFeedback('Tente novamente');
    }
    setTimeout(() => {
      setFeedback(null);
      setIndex(i => (i + 1) % cards.length);
    }, 900);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Jogo das Emoções</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Identifique a emoção mostrada.</p>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="text-6xl">{cards[index].emoji}</div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {shuffleOptions(cards[index]).map(opt => (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              className="p-3 border rounded bg-white dark:bg-gray-900 focus-ring"
              aria-pressed="false"
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">Pontuação: <strong>{score}</strong></div>
        {feedback && <div className="mt-2 text-green-600">{feedback}</div>}
      </div>
    </main>
  );
}

function shuffleOptions(current) {
  // current: card object; create array of labels with one correct and 3 random
  const labels = new Set([current.label]);
  const pool = ['Feliz','Triste','Bravo','Surpreso','Neutro','Ansioso','Calmo'];
  while (labels.size < 4) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    labels.add(pick);
  }
  const arr = Array.from(labels).sort(() => Math.random() - 0.5);
  return arr;
}
