'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import MenuItemCard from '@/components/MenuItemCard';
import { Search, Loader2 } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory, availability]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        api.get('/menu-items', {
          params: {
            search: search || undefined,
            categoryId: selectedCategory || undefined,
            isAvailable: availability || undefined,
          }
        }),
        api.get('/categories')
      ]);
      setItems(itemsRes.data);
      if (categories.length === 0) {
        setCategories(catRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Craving something <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">delicious?</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Discover the best food from our kitchen delivered hot and fresh to you.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for food..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select 
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none min-w-[140px]"
          >
            <option value="">All Items</option>
            <option value="true">Available Only</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => {setSearch(''); setSelectedCategory(''); setAvailability('')}}
            className="mt-6 text-orange-600 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
