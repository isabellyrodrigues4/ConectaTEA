// src/contexts/UIContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const v = localStorage.getItem("conectatea_dark");
    return v ? JSON.parse(v) : false; // false = começa claro
  });

  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem("conectatea_font")) || 16;
  });

  useEffect(() => {
    localStorage.setItem("conectatea_dark", JSON.stringify(dark));
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("conectatea_font", String(fontSize));
    document.documentElement.style.fontSize = fontSize + "px";
  }, [fontSize]);

  const increase = () => setFontSize((s) => Math.min(s + 1, 22));
  const decrease = () => setFontSize((s) => Math.max(s - 1, 12));

  return (
    <UIContext.Provider value={{ dark, setDark, fontSize, increase, decrease }}>
      {children}
    </UIContext.Provider>
  );
}
