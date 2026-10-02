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

export default function CartPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cartIds, setCartIds] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('swag_cart');
    const ids = storedCart ? JSON.parse(storedCart) : [];
    setCartIds(ids);

    if (ids.length > 0) {
      fetchCartProductos(ids);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartProductos = async (ids: (string | number)[]) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .in('id', ids);

      if (error) console.error(error);
      else setProductos(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id: string | number) => {
    const updatedIds = cartIds.filter((itemId) => itemId !== id);
    setCartIds(updatedIds);
    setProductos(productos.filter((p) => p.id !== id));
    localStorage.setItem('swag_cart', JSON.stringify(updatedIds));
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="flex items-center justify-between bg-slate-800 px-8 py-4 text-white shadow">
        <h1 className="text-2xl font-bold tracking-wide">Swag Labs</h1>
        <button
          onClick={() => router.push('/inventory')}
          className="text-sm text-gray-300 hover:text-white underline"
        >
          Volver a la tienda
        </button>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-4">
          Your Cart
        </h2>

        {loading ? (
          <p className="text-gray-600">Cargando carrito...</p>
        ) : productos.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-600 mb-4">El carrito está vacío.</p>
            <button
              onClick={() => router.push('/inventory')}
              className="rounded bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 uppercase"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {productos.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow-sm border border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded p-1 flex items-center justify-center">
                    <img
                      src={item.imagen_url || ''}
                      alt={item.nombre}
                      className="h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.nombre}</h3>
                    <p className="text-sm font-bold text-gray-600">
                      ${Number(item.precio).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded border border-red-600 px-4 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 uppercase"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => router.push('/inventory')}
                className="rounded border border-slate-800 px-6 py-2 text-xs font-bold text-slate-800 hover:bg-gray-100 uppercase"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push('/checkout')}
                className="rounded bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 uppercase"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}