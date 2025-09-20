import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary">ConectaTEA</h1>
      <p className="mt-3 text-lg">Conectando apoio, inclusão e desenvolvimento.</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="p-4 border rounded bg-white dark:bg-gray-900">
          <h2 className="font-semibold">Suporte para pais</h2>
          <p className="mt-2">Orientações, conteúdos educativos e dicas práticas.</p>
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-900">
          <h2 className="font-semibold">Jogos interativos</h2>
          <p className="mt-2">Ferramentas lúdicas para desenvolvimento cognitivo e social.</p>
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-900">
          <h2 className="font-semibold">Comunidade</h2>
          <p className="mt-2">Espaço para troca de experiências entre familiares e responsáveis.</p>
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-900">
          <h2 className="font-semibold">Recursos</h2>
          <p className="mt-2">Material de apoio centralizado.</p>
        </div>
      </section>

      <div className="mt-8">
        <Link to="/signup" className="px-4 py-2 bg-accent text-white rounded">Cadastre-se</Link>
        <Link to="/resources" className="ml-4 px-4 py-2 border rounded">Ver recursos</Link>
      </div>
    </main>
  );
}
