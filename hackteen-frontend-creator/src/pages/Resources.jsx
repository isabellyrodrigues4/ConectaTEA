import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [onlineResources, setOnlineResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Carregar recursos locais
  useEffect(() => {
    let mounted = true;
    api
      .get("/resources")
      .then((r) => {
        if (mounted) setResources(r.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  // Buscar artigos online
  async function fetchOnline() {
    setLoadingOnline(true);
    try {
      const r = await api.get("/resources/online?q=autism");
      setOnlineResources(r.data);
    } catch {
      alert("Erro ao buscar artigos online.");
    } finally {
      setLoadingOnline(false);
    }
  }

  // Filtro e busca
  const allResources = [...resources, ...onlineResources];
  const filtered = allResources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">📚 Central de Recursos</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Explore artigos, guias e materiais úteis para apoiar a jornada do TEA.
      </p>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">Todos</option>
          <option value="PDF">PDF</option>
          <option value="Artigo">Artigos</option>
          <option value="Artigo científico">Artigos científicos (online)</option>
          <option value="Vídeo">Vídeos</option>
        </select>
        <button
          onClick={fetchOnline}
          disabled={loadingOnline}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingOnline ? "Buscando..." : "🔎 Buscar artigos online"}
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Nenhum recurso encontrado.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 border rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{r.title}</h2>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                {r.type}
              </span>
              <div className="mt-3">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline font-medium"
                >
                  ➡ Abrir recurso
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
