import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

export default function Community() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await api.get("/community/posts");
      setPosts(res.data);
    } catch {
      setError("Erro ao carregar posts");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Digite algo antes de postar.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      await api.post(
        "/community/posts",
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContent("");
      fetchPosts();
    } catch {
      setError("Erro ao enviar post. Verifique se está logado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(id) {
    try {
      await api.post(
        `/community/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Erro ao curtir", err);
    }
  }

  async function handleComment(id, text) {
    if (!text.trim()) return;
    try {
      await api.post(
        `/community/posts/${id}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Erro ao comentar", err);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Comunidade</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Compartilhe experiências e interaja com outras famílias.
      </p>

      {/* Form de novo post */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white dark:bg-gray-900 border rounded-lg p-4 shadow-sm"
        >
          <textarea
            rows={3}
            maxLength={500}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary"
            placeholder="No que você está pensando?"
          />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span>{content.length}/500</span>
          </div>
          {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Postar"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-gray-500">Faça login para participar.</p>
      )}

      {/* Feed de posts */}
      <ul className="mt-8 space-y-6">
        {posts.map((p) => (
          <li
            key={p.id}
            className="p-4 border rounded bg-white dark:bg-gray-900 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                {p.author?.[0] || "?"}
              </div>
              <div>
                <p className="font-semibold">{p.author}</p>
                <p className="text-xs text-gray-400">
                  Post #{p.id} •{" "}
                  {new Date(p.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-200">{p.content}</p>

            <div className="flex space-x-6 mt-3 text-sm text-gray-500">
              <button
                onClick={() => handleLike(p.id)}
                className="hover:text-primary"
              >
                👍 {p.likes || 0}
              </button>
              <button
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((x) =>
                      x.id === p.id ? { ...x, showComments: !x.showComments } : x
                    )
                  )
                }
                className="hover:text-primary"
              >
                💬 {p.comments?.length || 0}
              </button>
            </div>

            {/* Comentários */}
            {p.showComments && (
              <div className="mt-4 space-y-3">
                {(p.comments || []).map((c) => (
                  <div key={c.id} className="pl-4 border-l">
                    <p className="text-sm">
                      <strong>{c.author}:</strong> {c.text}
                    </p>
                  </div>
                ))}
                {user && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleComment(p.id, e.target.comment.value);
                      e.target.reset();
                    }}
                    className="flex items-center space-x-2"
                  >
                    <input
                      name="comment"
                      placeholder="Escreva um comentário..."
                      className="flex-1 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-primary text-white rounded text-sm"
                    >
                      Enviar
                    </button>
                  </form>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
