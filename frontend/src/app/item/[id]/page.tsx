'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ItemDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/menu-items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  const handleAdd = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/item/' + id);
      return;
    }
    if (item) {
      addItem({
        id: item.id,
        name: item.name,
        price: Number(item.price),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Item not found</h2>
        <Link href="/" className="text-orange-600 hover:underline mt-4 inline-block">Return to menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to menu
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100">
          <img 
            src={item.image} 
            alt={item.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-2xl tracking-wider">OUT OF STOCK</span>
            </div>
          )}
        </div>
        
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col">
          <div className="text-sm font-semibold text-orange-500 mb-2 uppercase tracking-wide">
            {item.category?.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{item.name}</h1>
          <p className="text-3xl font-bold text-orange-600 mb-6">${Number(item.price).toFixed(2)}</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
          
          <button
            disabled={!item.isAvailable}
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-6 h-6" />
            {item.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
