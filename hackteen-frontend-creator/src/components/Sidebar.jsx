import React, { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false); // mobile drawer
  const [gamesOpen, setGamesOpen] = useState(false); // submenu

  const itemClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-primary text-white"
        : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
    }`;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded shadow focus-ring"
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          transform transition-transform
          md:translate-x-0 md:static md:flex md:flex-col
          w-64 bg-white dark:bg-gray-800 shadow-lg p-4
          ${open ? "fixed top-0 left-0 h-full z-50 translate-x-0" : "fixed -translate-x-full"}
        `}
        aria-label="Sidebar principal"
      >
        {/* header inside sidebar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-xl font-bold text-primary dark:text-blue-300"
          >
            ConectaTEA
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 rounded focus-ring"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav role="navigation" aria-label="Menu principal" className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            <li>
              <NavLink to="/" end className={({ isActive }) => itemClass(isActive)}>
                Início
              </NavLink>
            </li>

            <li>
              <NavLink to="/articles" className={({ isActive }) => itemClass(isActive)}>
                Artigos
              </NavLink>
            </li>

            <li>
              <NavLink to="/diary" className={({ isActive }) => itemClass(isActive)}>
                Diário
              </NavLink>
            </li>

            <li>
              <NavLink to="/checklists" className={({ isActive }) => itemClass(isActive)}>
                Checklists
              </NavLink>
            </li>

            <li>
              <NavLink to="/community" className={({ isActive }) => itemClass(isActive)}>
                Comunidade
              </NavLink>
            </li>

            <li>
              <NavLink to="/resources" className={({ isActive }) => itemClass(isActive)}>
                Recursos & Blog
              </NavLink>
            </li>

            <li>
              <NavLink to="/partnerships" className={({ isActive }) => itemClass(isActive)}>
                Parcerias
              </NavLink>
            </li>

            {/* Jogos com submenu */}
            <li>
              <button
                onClick={() => setGamesOpen((g) => !g)}
                aria-expanded={gamesOpen}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 focus-ring"
              >
                <span>Jogos</span>
                <span className="text-sm opacity-70">
                  {gamesOpen ? "▾" : "▸"}
                </span>
              </button>

              {gamesOpen && (
                <ul className="mt-1 ml-3 space-y-1">
                  <li>
                    <NavLink to="/games" className={({ isActive }) => itemClass(isActive)}>
                      Todos os jogos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/games/snake" className={({ isActive }) => itemClass(isActive)}>
                      Snake (Cobra)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/games/emotions" className={({ isActive }) => itemClass(isActive)}>
                      Emoções
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/games/sequence" className={({ isActive }) => itemClass(isActive)}>
                      Sequência
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <NavLink to="/settings" className={({ isActive }) => itemClass(isActive)}>
                Configurações
              </NavLink>
            </li>

            <li>
              <NavLink to="/about" className={({ isActive }) => itemClass(isActive)}>
                Sobre
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* bottom area: auth actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Olá, <strong>{user.name}</strong>
              </div>
              <Link
                to="/dashboard"
                className="px-3 py-2 bg-primary text-white rounded text-center"
              >
                Painel
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="flex-1 px-3 py-2 border rounded text-center">
                Entrar
              </Link>
              <Link
                to="/signup"
                className="flex-1 px-3 py-2 bg-accent text-white rounded text-center"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
