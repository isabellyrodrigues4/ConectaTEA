import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0..4
}

export default function Signup() {
  const { signup, loading, authError } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{ setLocalError(null); }, [name, email, password, confirm]);

  const handle = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) { setLocalError('Nome muito curto'); return; }
    if (!validateEmail(email)) { setLocalError('Email inválido'); return; }
    const strength = passwordStrength(password);
    if (strength < 3) { setLocalError('Senha fraca — use 8+ caracteres, letras maiúsculas, números ou símbolos'); return; }
    if (password !== confirm) { setLocalError('Senhas não conferem'); return; }

    const resp = await signup({ name: name.trim(), email, password });
    if (resp.ok) nav('/dashboard');
    // else error from context
  };

  const strength = passwordStrength(password);
  const strengthLabels = ['Muito fraca','Fraca','Média','Forte','Muito forte'];

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cadastre-se para salvar progresso e acessar conteúdos exclusivos.</p>

      <form onSubmit={handle} className="mt-4 space-y-3" aria-label="Formulário de cadastro" noValidate>
        {(localError || authError) && <div className="text-red-600" role="alert">{localError || authError}</div>}

        <label className="block">
          <span className="text-sm">Nome completo</span>
          <input className="w-full mt-1 p-2 border rounded focus-ring" required type="text" value={name} onChange={e=>setName(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm">Email</span>
          <input className="w-full mt-1 p-2 border rounded focus-ring" required type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm">Senha</span>
          <input className="w-full mt-1 p-2 border rounded focus-ring" required type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="mt-1 text-xs text-gray-500">Força: <strong>{strengthLabels[strength]}</strong></div>
        </label>

        <label className="block">
          <span className="text-sm">Confirmar senha</span>
          <input className="w-full mt-1 p-2 border rounded focus-ring" required type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        </label>

        <button type="submit" className="w-full py-2 bg-accent text-white rounded focus-ring" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}
