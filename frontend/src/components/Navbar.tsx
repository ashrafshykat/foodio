'use client';
import Link from 'next/link';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { items } = useCartStore();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">Foodio</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {mounted && user ? (
              <div className="flex items-center space-x-4">
                <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/orders'} className="text-gray-600 flex items-center gap-1 hover:text-orange-600 font-medium transition-colors">
                  <User className="w-5 h-5"/> <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-3 hidden sm:flex">
                <Link href="/login" className="text-gray-600 hover:text-orange-600 font-medium px-3 py-2">Login</Link>
                <Link href="/register" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2 rounded-full font-medium hover:from-orange-600 hover:to-red-700 shadow-md transition-all">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
