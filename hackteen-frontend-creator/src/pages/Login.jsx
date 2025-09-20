import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const { login, loading, authError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    setLocalError(null);
  }, [email, password]);

  const handle = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { setLocalError('Email inválido'); return; }
    if (password.length < 6) { setLocalError('Senha muito curta'); return; }
    const resp = await login({ email, password });
    if (resp.ok) nav('/dashboard');
    // authError handled by context
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Entre com sua conta ConectaTEA para acessar recursos e jogos personalizados.</p>

      <form onSubmit={handle} className="mt-4 space-y-3" aria-label="Formulário de login" noValidate>
        {(localError || authError) && <div className="text-red-600" role="alert">{localError || authError}</div>}

        <label className="block">
          <span className="text-sm">Email</span>
          <input
            className="w-full mt-1 p-2 border rounded focus-ring"
            required type="email" value={email}
            onChange={e=>setEmail(e.target.value)} aria-invalid={!validateEmail(email) && email.length>0} />
          <small className="text-xs text-gray-500">Ex.: nome@exemplo.com</small>
        </label>

        <label className="block">
          <span className="text-sm">Senha</span>
          <input
            className="w-full mt-1 p-2 border rounded focus-ring"
            required type="password" value={password}
            onChange={e=>setPassword(e.target.value)} minLength={6} />
        </label>

        <button type="submit" className="w-full py-2 bg-primary text-white rounded focus-ring" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-4 text-sm">
        <p>Não tem conta? <Link to="/signup" className="text-primary underline">Cadastre-se</Link></p>
      </div>
    </main>
  );
}
