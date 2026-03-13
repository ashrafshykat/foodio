'use client';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  isAvailable: boolean;
  category: { id: number; name: string };
}

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: Number(item.price),
    });
  };

  return (
    <Link href={`/item/${item.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">OUT OF STOCK</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-orange-600 shadow-sm">
          ${Number(item.price).toFixed(2)}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-medium text-orange-500 mb-1 uppercase tracking-wider">{item.category?.name}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
        
        <button 
          disabled={!item.isAvailable}
          onClick={handleAdd}
          className="w-full mt-auto flex items-center justify-center gap-2 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-orange-200"
        >
          <ShoppingCart className="w-4 h-4" />
          {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </Link>
  );
}
