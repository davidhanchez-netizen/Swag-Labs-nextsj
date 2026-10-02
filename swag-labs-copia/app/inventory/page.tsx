'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Producto {
  id: string | number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
}

export default function InventoryPage() {
  const [user, setUser] = useState<any>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cart, setCart] = useState<(string | number)[]>([]);
  const [sortOption, setSortOption] = useState<string>('az');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Validar sesión del usuario
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));

    // Cargar carrito guardado
    const storedCart = localStorage.getItem('swag_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    fetchProductos();
  }, [router]);

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) {
        console.error('Error al cargar productos:', error);
      } else {
        setProductos(data || []);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleCart = (id: string | number) => {
    let updatedCart: (string | number)[];
    if (cart.includes(id)) {
      updatedCart = cart.filter((itemId) => itemId !== id);
    } else {
      updatedCart = [...cart, id];
    }
    setCart(updatedCart);
    localStorage.setItem('swag_cart', JSON.stringify(updatedCart));
  };

  // Ordenar productos según la opción seleccionada
  const sortedProductos = [...productos].sort((a, b) => {
    if (sortOption === 'az') return a.nombre.localeCompare(b.nombre);
    if (sortOption === 'za') return b.nombre.localeCompare(a.nombre);
    if (sortOption === 'lohi') return a.precio - b.precio;
    if (sortOption === 'hilo') return b.precio - a.precio;
    return 0;
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Encabezado con Ícono del Carrito */}
      <header className="flex items-center justify-between bg-slate-800 px-8 py-4 text-white shadow">
        <h1 className="text-2xl font-bold tracking-wide">Swag Labs</h1>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/cart')}
            className="relative flex items-center justify-center"
          >
            <svg
              className="w-7 h-7 text-white hover:text-gray-300 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <span className="text-sm font-medium text-gray-300">
            Usuario: <strong className="text-white">{user.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-300 pb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
          
          {/* Selector de Ordenamiento */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Ordenar por:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-slate-800 focus:outline-none"
            >
              <option value="az">Name (A to Z)</option>
              <option value="za">Name (Z to A)</option>
              <option value="lohi">Price (low to high)</option>
              <option value="hilo">Price (high to low)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Cargando productos...</p>
        ) : sortedProductos.length === 0 ? (
          <p className="text-gray-500">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {sortedProductos.map((prod) => {
              const inCart = cart.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="flex flex-col justify-between rounded bg-gray-100 p-4 shadow-sm border border-gray-300"
                >
                  <div>
                    <div className="h-48 w-full mb-3 flex items-center justify-center overflow-hidden rounded bg-white p-2">
                      {prod.imagen_url ? (
                        <img
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Sin Imagen</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 text-center leading-tight">
                      {prod.nombre}
                    </h3>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-3">
                    <span className="text-sm font-bold text-gray-800">
                      ${Number(prod.precio).toFixed(2)}
                    </span>
                    <button
                      onClick={() => toggleCart(prod.id)}
                      className={`w-full rounded py-2 text-xs font-bold transition uppercase ${
                        inCart
                          ? 'border border-red-600 text-red-600 bg-white hover:bg-red-50'
                          : 'bg-[#0f172a] text-white hover:bg-slate-800'
                      }`}
                    >
                      {inCart ? 'REMOVE' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}