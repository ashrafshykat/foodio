'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Package } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PREPARING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'READY': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-orange-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 mt-4">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500">When you place an order, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Order #{order.id}</p>
                  <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-2xl font-black text-gray-900">${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
              
              <ul className="space-y-4">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        {item.quantity}x
                      </div>
                      <span className="font-semibold text-gray-900">{item.menuItem.name}</span>
                    </div>
                    <span className="font-medium text-gray-600">${Number(item.priceAtTime).toFixed(2)} each</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
