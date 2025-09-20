import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-t dark:border-gray-700 text-sm">
      {/* Esquerda: slogan */}
      <div className="text-gray-700 dark:text-gray-300">
        <span className="font-medium">ConectaTEA</span> — Conectando apoio, inclusão e desenvolvimento.
      </div>

      {/* Direita: info extra */}
      <div className="text-gray-600 dark:text-gray-400 text-right">
        <div>ETEC Prof° Edson Galvão - Itapetininga SP</div>
        <div className="mt-0.5">Hackteen 2S/2025</div>
      </div>
    </footer>
  );
}
