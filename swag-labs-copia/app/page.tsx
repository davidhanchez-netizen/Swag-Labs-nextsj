'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Consultar usuario en la tabla 'usuarios' de Supabase
      const { data, error: dbError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('Username and password do not match any user in this service');
        setLoading(false);
        return;
      }

      // Guardar sesión en el navegador
      localStorage.setItem('user', JSON.stringify(data));

      // Redirigir al inventario
      router.push('/inventory');
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Swag Labs</h1>
          <p className="text-sm text-gray-500">Réplica en Next.js + TypeScript</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded bg-red-100 p-3 text-center text-sm font-medium text-red-700 border border-red-300">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-3 text-gray-800 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-3 text-gray-800 focus:border-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'CARGANDO...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 border-t pt-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-700">Accepted usernames:</p>
          <p>standard_user</p>
          <p>locked_out_user</p>
          <p className="mt-2 font-semibold text-gray-700">Password for all users:</p>
          <p>secret_sauce</p>
        </div>
      </div>
    </div>
  );
}