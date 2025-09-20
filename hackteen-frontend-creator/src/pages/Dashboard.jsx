import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Painel</h1>
      <p className="mt-3">Bem-vindo, <strong>{user?.name}</strong>!</p>

      <section className="mt-6">
        <h2 className="font-semibold">Minhas atividades</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Em breve: rastreamento de progresso e histórico de jogos.</p>
      </section>
    </main>
  );
}
