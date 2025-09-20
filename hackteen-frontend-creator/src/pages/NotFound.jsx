import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold">404 — Página não encontrada</h1>
      <p className="mt-3">Parece que você se perdeu. <Link to="/" className="text-primary underline">Voltar ao início</Link></p>
    </main>
  );
}
