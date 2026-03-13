'use client';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/cart');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));
      await api.post('/orders', { items: orderItems });
      clearCart();
      router.push('/orders');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-10">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-8 rounded-full hover:from-orange-600 hover:to-red-700 transition-colors inline-block shadow-md">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <ul className="divide-y divide-gray-100 p-6">
          {items.map((item) => (
            <li key={item.id} className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-orange-600 font-semibold">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-200">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right w-20 font-bold text-gray-900 hidden sm:block">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 p-6 sm:px-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={clearCart}
            className="text-gray-500 font-medium hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
          <div className="flex items-center gap-6">
            <div className="text-gray-600 font-medium">
              Total: <span className="text-2xl font-black text-gray-900 ml-2">${getTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Processing...' : 'Place Order'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
