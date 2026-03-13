'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      setName('');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: any) => {
    setName(category.name);
    setEditingId(category.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert('Cannot delete category. It might be used by some menu items.');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-orange-500 animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        
        <div className="p-6 md:w-1/3">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Category' : 'Create Category'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="flex-1 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {editingId ? <><Edit2 className="w-4 h-4"/> Update</> : <><Plus className="w-4 h-4"/> Add</>}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => { setEditingId(null); setName(''); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 md:w-2/3">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories List</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium">#{c.id}</td>
                    <td className="px-6 py-3">{c.name}</td>
                    <td className="px-6 py-3 flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(c)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
