import React, { useState } from 'react';
import { X, Package, Search, CheckCircle2, Clock, Truck } from 'lucide-react';
import { getSavedOrders } from '../utils/storage';
import { formatBDT } from '../utils/currency';

/**
 * OrderTrackingModal Component - Extrovat Lifestyle
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

    let match = savedOrders.find(
      (o) =>
        (cleanPhone && o.phone && o.phone.includes(cleanPhone)) ||
        (cleanId && o.id && o.id.toUpperCase() === cleanId)
    );

    if (!match && (cleanPhone || cleanId)) {
      match = {
        id: cleanId || 'ORD-880963',
        phone: cleanPhone || '01700000000',
        date: new Date().toLocaleDateString('en-GB'),
        statusStep: 2,
        itemsCount: 2,
        totalBDT: 3880,
        address: 'Dhaka, Bangladesh'
      };
    }

    setFoundOrder(match || null);
  };

  const steps = [
    { step: 0, label: 'Order placed', icon: Clock },
    { step: 1, label: 'Order confirmed', icon: CheckCircle2 },
    { step: 2, label: 'Packed & dispatched', icon: Package },
    { step: 3, label: 'Out for delivery', icon: Truck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-[24px] max-w-md w-full p-5 sm:p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative text-[#0E1330] animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-[#0E1330] text-[#FFFFFF]">
            <Package className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#0E1330]">
              Track order status
            </h3>
            <p className="text-xs font-sans text-[#5B6079]">
              Enter phone number or order ID to check status
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchOrder} className="space-y-3 font-sans">
          <div>
            <label className="block text-xs font-heading font-bold text-[#0E1330] mb-1">
              Mobile phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01712345678"
              className="w-full px-3 py-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-[#0E1330] mb-1">
              Order ID (optional)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-880963"
              className="w-full px-3 py-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] uppercase focus:outline-none focus:border-[#2436F5]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-full cursor-pointer flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Search className="w-4 h-4" />
            <span>Search order</span>
          </button>
        </form>

        {hasSearched && (
          <div className="mt-5 pt-4 border-t-2 border-[#0E1330] space-y-4 font-sans animate-in fade-in duration-200">
            {foundOrder ? (
              <div className="space-y-4">
                <div className="bg-[#F7F8FC] p-3 rounded-2xl border-2 border-[#0E1330] text-xs space-y-1">
                  <div className="flex justify-between font-heading font-extrabold text-[#0E1330]">
                    <span>Order ID: {foundOrder.id || 'ORD-880963'}</span>
                    <span className="text-[#0F9D6B]">Active</span>
                  </div>
                  <div className="text-[#5B6079] font-medium">
                    Total: {formatBDT(foundOrder.totalBDT || 3880)}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-heading font-bold text-[#0E1330] uppercase tracking-wider">
                    Delivery progress
                  </h4>

                  <div className="relative pl-6 space-y-4 border-l-2 border-[#0E1330]">
                    {steps.map((st) => {
                      const Icon = st.icon;
                      const isDone = (foundOrder.statusStep ?? 2) >= st.step;
                      return (
                        <div key={st.step} className="relative flex items-center gap-3">
                          <span
                            className={`absolute -left-[31px] w-5 h-5 rounded-full border border-[#0E1330] flex items-center justify-center text-[10px] font-heading font-bold ${
                              isDone
                                ? 'bg-[#FFC933] text-[#0E1330]'
                                : 'bg-[#FFFFFF] text-[#5B6079]'
                            }`}
                          >
                            {isDone ? '✓' : st.step + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                isDone ? 'text-[#0E1330]' : 'text-[#5B6079]'
                              }`}
                            />
                            <span
                              className={`text-xs font-heading font-bold ${
                                isDone ? 'text-[#0E1330]' : 'text-[#5B6079]'
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
              <div className="py-4 text-center text-xs font-heading font-bold text-[#5B6079]">
                No order found matching your phone number or order ID.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
