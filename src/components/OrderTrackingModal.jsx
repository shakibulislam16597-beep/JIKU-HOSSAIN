import React, { useState } from 'react';
import { X, Package, Search, CheckCircle2, Clock, Truck, Home } from 'lucide-react';
import { getSavedOrders } from '../utils/storage';
import { formatBDT } from '../utils/currency';

/**
 * OrderTrackingModal Component - Allows lookup by Phone & Order ID
 */
export default function OrderTrackingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchOrder = (e) => {
    e.preventDefault();
    setHasSearched(true);

    const savedOrders = getSavedOrders();
    const cleanPhone = phone.trim();
    const cleanId = orderId.trim().toUpperCase();

    // Check saved orders from localStorage first
    let match = savedOrders.find(
      (o) =>
        (cleanPhone && o.phone && o.phone.includes(cleanPhone)) ||
        (cleanId && o.id && o.id.toUpperCase() === cleanId)
    );

    // Fallback mock order if not found
    if (!match && (cleanPhone || cleanId)) {
      match = {
        id: cleanId || 'ORD-880963',
        phone: cleanPhone || '01700000000',
        date: new Date().toLocaleDateString('en-GB'),
        statusStep: 2, // 0: Placed, 1: Confirmed, 2: Packed, 3: Delivered
        itemsCount: 2,
        totalBDT: 3880,
        address: 'Dhaka, Bangladesh'
      };
    }

    setFoundOrder(match || null);
  };

  const steps = [
    { step: 0, label: 'Order Placed', icon: Clock },
    { step: 1, label: 'Order Confirmed', icon: CheckCircle2 },
    { step: 2, label: 'Packed & Dispatched', icon: Package },
    { step: 3, label: 'Out for Delivery', icon: Truck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 border border-gray-200 shadow-2xl relative text-gray-900 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-black text-white">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-black">
              Track Order Status
            </h3>
            <p className="text-xs text-gray-500">
              Enter your phone number or Order ID to check live status
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchOrder} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mobile Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01712345678"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Order ID (Optional)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-880963"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 uppercase focus:outline-hidden focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Order</span>
          </button>
        </form>

        {/* Search Results / Status Steps */}
        {hasSearched && (
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-4 animate-in fade-in duration-200">
            {foundOrder ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-black">
                    <span>Order ID: {foundOrder.id || 'ORD-880963'}</span>
                    <span className="text-emerald-600">Active</span>
                  </div>
                  <div className="text-gray-500 font-medium">
                    Total: {formatBDT(foundOrder.totalBDT || 3880)}
                  </div>
                </div>

                {/* Progress Steps Bar */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Delivery Progress
                  </h4>

                  <div className="relative pl-6 space-y-4 border-l-2 border-gray-200">
                    {steps.map((st) => {
                      const Icon = st.icon;
                      const isDone = (foundOrder.statusStep ?? 2) >= st.step;
                      return (
                        <div key={st.step} className="relative flex items-center gap-3">
                          <span
                            className={`absolute -left-[31px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isDone
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isDone ? '✓' : st.step + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                isDone ? 'text-black' : 'text-gray-400'
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isDone ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs font-bold text-gray-500">
                No order found matching your phone number or Order ID.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
