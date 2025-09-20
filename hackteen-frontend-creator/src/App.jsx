import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Games from "./pages/Games";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Articles from "./pages/Articles";
import Diary from "./pages/Diary";
import Checklists from "./pages/Checklists";
import Partnerships from "./pages/Partnerships";
import Settings from "./pages/Settings";

// jogos
import Snake from "./pages/games/Snake";
import Emotions from "./pages/games/Emotions";
import Sequence from "./pages/games/Sequence";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar fixa */}
        <Sidebar />

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1">
          <Header />

          {/* Área de páginas */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/checklists" element={<Checklists />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/snake" element={<Snake />} />
              <Route path="/games/emotions" element={<Emotions />} />
              <Route path="/games/sequence" element={<Sequence />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
