// src/pages/Checklists.jsx
import React, { useState, useEffect, useContext } from "react";
import { CheckSquare, Square, PlusCircle, Trash2 } from "lucide-react";
import api from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Checklists() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // carregar checklists do backend (por usuário)
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    console.log("[Checklists] carregando checklists para user:", user);
    api.get("/checklists")
      .then((res) => {
        // converte done (0/1) para boolean se necessário
        const list = Array.isArray(res.data)
          ? res.data.map((it) => ({ ...it, done: !!Number(it.done) }))
          : [];
        setItems(list);
      })
      .catch((err) => {
        console.error("[Checklists] GET /checklists erro:", err);
        setError("Erro ao carregar checklists. Veja console (F12).");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // adicionar item (envia para /api/checklists { text })
  const addItem = async () => {
    setError(null);
    if (!user) {
      setError("Faça login para adicionar tarefas.");
      return;
    }
    if (!newItem.trim()) return;
    setSaving(true);
    try {
      console.log("[Checklists] POST /checklists ->", newItem);
      const res = await api.post("/checklists", { text: newItem.trim() });
      // servidor deve retornar o objeto criado { id, text, done, ... }
      const created = res.data || {};
      const normalized = { ...created, done: !!Number(created.done) };
      setItems((prev) => [normalized, ...prev]);
      setNewItem("");
    } catch (err) {
      console.error("[Checklists] POST error:", err);
      setError(err?.response?.data?.message || "Erro ao adicionar item.");
      if (err?.response?.status === 401) {
        setError("Sessão inválida. Faça login novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  // toggle: tenta rota /checklists/:id/toggle, se 404 tenta atualizar via PUT /checklists/:id
  const toggleItem = async (id) => {
    setError(null);
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const optimistic = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
    setItems(optimistic);

    try {
      // primeiro tenta endpoint toggle (caso o server tenha este)
      let res;
      try {
        res = await api.put(`/checklists/${id}/toggle`);
      } catch (e) {
        if (e?.response?.status === 404) {
          // fallback: atualizar via PUT /checklists/:id com body { done: 0/1 }
          const newDone = it.done ? 0 : 1;
          res = await api.put(`/checklists/${id}`, { done: newDone });
        } else {
          throw e;
        }
      }
      const updated = res?.data || {};
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, done: !!Number(updated.done ?? (i.done ? 1 : 0)) } : i))
      );
    } catch (err) {
      console.error("[Checklists] toggle error:", err);
      setError("Não foi possível atualizar o item (veja console).");
      // reverte alteração otimista
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: it.done } : i)));
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Deseja excluir esta tarefa?")) return;
    setError(null);
    try {
      await api.delete(`/checklists/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("[Checklists] DELETE error:", err);
      setError("Não foi possível excluir (veja console).");
    }
  };

  const progress = items.length
    ? Math.round((items.filter((i) => i.done).length / items.length) * 100)
    : 0;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center bg-white dark:bg-gray-800 rounded shadow">
        <p className="text-gray-600 dark:text-gray-300">⚠️ Faça login para acessar seus checklists.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">✅ Checklists</h1>

      {error && <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">{error}</div>}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Nova tarefa..."
          className="flex-1 border rounded px-3 py-2 dark:bg-gray-700"
        />
        <button
          onClick={addItem}
          disabled={saving}
          className={`px-4 py-2 ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white rounded flex items-center gap-1`}
        >
          <PlusCircle size={18} /> {saving ? "Adicionando..." : "Adicionar"}
        </button>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
        <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-gray-500 mb-4">{progress}% concluído</p>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Nenhuma tarefa ainda.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
              <button onClick={() => toggleItem(item.id)} className="flex items-center gap-2 flex-1 text-left">
                {item.done ? <CheckSquare className="text-green-600" /> : <Square className="text-gray-400" />}
                <span className={item.done ? "line-through text-gray-500" : ""}>{item.text}</span>
              </button>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
