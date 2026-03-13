'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, UtensilsCrossed, Tags, ShoppingBag } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!isAdmin) return null;

  const links = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/admin/menu-items', icon: UtensilsCrossed, label: 'Menu Items' },
    { href: '/admin/categories', icon: Tags, label: 'Categories' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="md:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sticky top-24">
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
