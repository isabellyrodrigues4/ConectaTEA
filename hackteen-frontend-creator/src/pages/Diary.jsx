// src/pages/Diary.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Save, RotateCcw, Trash2, Calendar, Tag, BookOpen } from "lucide-react";

export default function Diary() {
  const { token: ctxToken } = useContext(AuthContext) || {};
  const token = ctxToken || localStorage.getItem("token");
  const navigate = useNavigate();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Você precisa entrar para ver o diário.");
      return;
    }
    setLoading(true);
    setError(null);

    api.get("/diary")
      .then((res) => setEntries(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("GET /api/diary error:", err);
        if (err.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          setTimeout(() => navigate("/login"), 900);
        } else {
          setError("Erro ao carregar entradas.");
        }
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const validate = () => {
    if (!date) return "Preencha a data.";
    if (!note || note.trim().length < 3)
      return "Escreva pelo menos 3 caracteres na observação.";
    return null;
  };

  const addEntry = async () => {
    setError(null);
    setSuccess(null);
    const v = validate();
    if (v) return setError(v);
    if (!token) return setError("É preciso estar logado para salvar.");

    setSaving(true);
    try {
      const res = await api.post("/diary", { date, note, tags });
      if (res?.data) {
        setEntries((prev) => [res.data, ...prev]);
        setNote("");
        setTags("");
        setSuccess("✅ Entrada salva com sucesso!");
      } else {
        setError("Resposta inesperada do servidor.");
      }
    } catch (err) {
      console.error("POST /api/diary error:", err);
      const msg = err.response?.data?.message || "Erro ao salvar.";
      setError(msg);
      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 600);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm("Deseja excluir esta entrada?")) return;
    try {
      await api.delete(`/diary/${id}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setSuccess("🗑️ Entrada excluída.");
    } catch (err) {
      console.error("DELETE /api/diary/:id error:", err);
      setError("Não foi possível excluir.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <BookOpen className="text-blue-600" /> Meu Diário
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
            {success}
          </div>
        )}

        {!token ? (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
            Você precisa{" "}
            <a href="/login" className="underline font-semibold">
              entrar
            </a>{" "}
            para usar o diário.
          </div>
        ) : (
          <>
            {/* Formulário */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="flex items-center gap-1 text-sm font-medium mb-1">
                  <Calendar size={16} /> Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  📝 Observação
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Descreva: o que aconteceu, contexto, reação..."
                  className="w-full border rounded px-3 py-2 h-24 dark:bg-gray-700"
                />
              </div>

              <div className="md:col-span-3">
                <label className="flex items-center gap-1 text-sm font-medium mb-1">
                  <Tag size={16} /> Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="ex: social, crise, fala"
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={addEntry}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                  saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
              </button>

              <button
                onClick={() => {
                  setNote("");
                  setTags("");
                }}
                className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RotateCcw size={16} /> Limpar
              </button>
            </div>
          </>
        )}

        <h2 className="text-xl font-semibold mb-3">Entradas</h2>

        {loading ? (
          <p className="text-gray-500">Carregando entradas...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500">Nenhuma entrada encontrada.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((e) => (
              <li
                key={e.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col"
              >
                <div className="text-sm text-gray-500">
                  {e.date} •{" "}
                  {e.created_at ? new Date(e.created_at).toLocaleString() : ""}
                </div>
                <div className="mt-1 font-medium text-lg">{e.note}</div>
                {e.tags && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    #{e.tags}
                  </div>
                )}
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="mt-3 self-end flex items-center gap-1 text-red-600 hover:underline text-sm"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
