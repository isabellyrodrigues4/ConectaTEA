import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { UIContext } from "../contexts/UIContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { dark, setDark, increase, decrease } = useContext(UIContext);
  const nav = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-3 flex items-center justify-between border-b dark:border-gray-700">
      {/* Logo + slogan */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="font-bold text-xl text-primary dark:text-blue-400"
          aria-label="ConectaTEA home"
        >
          ConectaTEA
        </Link>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Conectar famílias • Apoiar desenvolvimento
        </span>
      </div>

      {/* Ações rápidas */}
      <div className="flex items-center gap-4">
        {/* Alternar tema */}
        <button
          onClick={() => setDark(!dark)}
          aria-pressed={dark}
          className="p-2 rounded bg-gray-100 dark:bg-gray-800 focus-ring"
          title="Alternar tema"
        >
          {dark ? "🌙" : "☀️"}
        </button>

        {/* Controle de fonte */}
        <div className="flex items-center border rounded">
          <button
            onClick={decrease}
            aria-label="Diminuir fonte"
            className="px-2 py-1 focus-ring"
          >
            A-
          </button>
          <button
            onClick={increase}
            aria-label="Aumentar fonte"
            className="px-2 py-1 focus-ring"
          >
            A+
          </button>
        </div>

        {/* Login / Dashboard */}
        {user ? (
          <>
            <button
              onClick={() => nav("/dashboard")}
              className="px-3 py-1 bg-primary text-white rounded focus-ring"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                nav("/");
              }}
              className="px-3 py-1 border rounded focus-ring"
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="px-3 py-1 border rounded focus-ring">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
