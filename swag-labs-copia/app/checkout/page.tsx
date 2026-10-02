'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: Formulario, 2: Finalizado
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && postalCode) {
      localStorage.removeItem('swag_cart'); // Vaciar carrito
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="flex items-center justify-between bg-slate-800 px-8 py-4 text-white shadow">
        <h1 className="text-2xl font-bold tracking-wide">Swag Labs</h1>
      </header>

      <main className="p-8 max-w-lg mx-auto">
        {step === 1 ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
              Checkout: Your Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 p-2.5 text-sm text-gray-800 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 p-2.5 text-sm text-gray-800 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Zip / Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 p-2.5 text-sm text-gray-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/cart')}
                  className="rounded border border-gray-400 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-slate-800 px-6 py-2 text-xs font-bold text-white hover:bg-slate-700 uppercase"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow border border-gray-300 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">THANK YOU FOR YOUR ORDER</h2>
            <p className="text-sm text-gray-600">
              Your order has been dispatched, and will arrive as fast as the pony can get
              there!
            </p>
            <button
              onClick={() => router.push('/inventory')}
              className="rounded bg-slate-800 px-6 py-2 text-xs font-bold text-white hover:bg-slate-700 uppercase"
            >
              Back Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}