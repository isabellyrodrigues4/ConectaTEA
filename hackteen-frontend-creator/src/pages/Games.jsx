import React from 'react';
import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Jogos Interativos</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Jogos desenvolvidos com foco em estímulos visuais, repetição e interação — pensados para usuários com TEA.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="font-semibold">Snake (Cobra)</h3>
          <p className="mt-2 text-sm">Jogo clássico adaptado com controles visíveis e cores de alto contraste.</p>
          <Link to="/games/snake" className="mt-3 inline-block underline text-primary">Jogar</Link>
        </div>

        <div className="p-4 border rounded bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="font-semibold">Jogo das Emoções</h3>
          <p className="mt-2 text-sm">Reconhecimento de expressões com imagens simples e feedback auditivo/visual.</p>
          <Link to="/games/emotions" className="mt-3 inline-block underline text-primary">Jogar</Link>
        </div>

        <div className="p-4 border rounded bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="font-semibold">Sequência</h3>
          <p className="mt-2 text-sm">Exercício de memória e ordem — padrões simples e progressivos.</p>
          <Link to="/games/sequence" className="mt-3 inline-block underline text-primary">Jogar</Link>
        </div>
      </div>
    </main>
  );
}
