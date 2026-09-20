import React, { useState } from 'react';
import { WHATSAPP_NUMBER, BKASH_NUMBER, NAGAD_NUMBER } from '../config';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { formatBDT, formatUSD } from '../utils/currency';
import {
  X,
  User,
  Phone,
  MapPin,
  Building,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

/**
 * CheckoutModal Component
 *
 * Requirements:
 * - Validate Full Name, Phone (BD format 01XXXXXXXXX), Address, District dropdown.
 * - Delivery charge: ৳80 inside Dhaka, ৳130 outside Dhaka.
 * - Payment options: Cash on Delivery, bKash (pink accent), Nagad (orange accent).
 * - bKash/Nagad payment box: Large gold number, Copy button with "Copied!", exact total amount, 4-step instructions, and required Sender Number & TrxID fields.
 * - On submit, triggers WhatsApp wa.me URL with pre-filled order details & calls onSuccess.
 */
export default function CheckoutModal({ isOpen, onClose, cartItems, onSuccessOrder }) {
  if (!isOpen) return null;

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'bkash' | 'nagad'

  // Payment box required fields
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  // UI state
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  // Pricing calculations
  const itemsSubtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isInsideDhaka = district.trim().toLowerCase() === 'dhaka';
  const deliveryChargeBDT = isInsideDhaka ? 80 : 130;
  const itemsSubtotalBDT = Math.round(itemsSubtotalUSD * 122);
  const grandTotalBDT = itemsSubtotalBDT + deliveryChargeBDT;

  // Selected payment MFS details
  const getMfsDetails = () => {
    if (paymentMethod === 'bkash') {
      return {
        name: 'bKash',
        number: BKASH_NUMBER,
        bgColor: 'bg-pink-950/40 border-pink-500/40',
        textColor: 'text-pink-400',
        badgeBg: 'bg-pink-600',
        brandAccent: '#E2136E'
      };
    }
    if (paymentMethod === 'nagad') {
      return {
        name: 'Nagad',
        number: NAGAD_NUMBER,
        bgColor: 'bg-orange-950/40 border-orange-500/40',
        textColor: 'text-orange-400',
        badgeBg: 'bg-orange-600',
        brandAccent: '#F7921E'
      };
    }
    return null;
  };

  const handleCopyNumber = (numToCopy) => {
    navigator.clipboard.writeText(numToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // BD Phone format: 01 followed by 9 digits (total 11 digits)
    const phoneRegex = /^01[3-9]\d{8}$/;
    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid 11-digit BD phone number (e.g. 01700000000)';
    }

    if (!address.trim()) {
      newErrors.address = 'Full delivery address is required';
    }

    if (!district) {
      newErrors.district = 'Please select a district';
    }

    // Validation for bKash / Nagad payment box
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      const mfsName = paymentMethod === 'bkash' ? 'bKash' : 'Nagad';
      const cleanSender = senderNumber.trim().replace(/[\s-]/g, '');
      if (!cleanSender) {
        newErrors.senderNumber = `${mfsName} sender account number is required`;
      } else if (!phoneRegex.test(cleanSender)) {
        newErrors.senderNumber = 'Enter a valid 11-digit BD phone number';
      }

      if (!trxId.trim()) {
        newErrors.trxId = `${mfsName} Transaction ID (TrxID) is required`;
      } else if (trxId.trim().length < 6) {
        newErrors.trxId = 'Transaction ID must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build Itemized WhatsApp Text
    let message = `NEW ORDER - ATOR ALI STORE\n`;
    message += `===========================\n\n`;
    message += `CUSTOMER DETAILS:\n`;
    message += `Name: ${fullName.trim()}\n`;
    message += `Phone: ${phone.trim()}\n`;
    message += `Address: ${address.trim()}\n`;
    message += `District: ${district}\n\n`;

    message += `ORDERED ITEMS:\n`;
    cartItems.forEach((item, idx) => {
      const sizeStr = item.size ? ` (${item.size})` : '';
      const lineBDT = `৳${Math.round(item.price * item.quantity * 122).toLocaleString('en-US')}`;
      message += `${idx + 1}. ${item.title}${sizeStr} x ${item.quantity} = ${lineBDT}\n`;
    });

    message += `\nPRICING SUMMARY:\n`;
    message += `Items Subtotal: ৳${itemsSubtotalBDT.toLocaleString('en-US')}\n`;
    message += `Delivery Charge: ৳${deliveryChargeBDT} (${isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})\n`;
    message += `GRAND TOTAL: ৳${grandTotalBDT.toLocaleString('en-US')}\n\n`;

    message += `PAYMENT METHOD:\n`;
    if (paymentMethod === 'cod') {
      message += `Method: Cash on Delivery (COD)\n`;
    } else {
      const mfs = getMfsDetails();
      message += `Method: ${mfs.name}\n`;
      message += `Sender Number: ${senderNumber.trim()}\n`;
      message += `Transaction ID (TrxID): ${trxId.trim()}\n`;
    }

    // Open WhatsApp URL in new tab
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Trigger success callback to show Thank You screen and clear cart
    onSuccessOrder();
  };

  const mfsDetails = getMfsDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#0B0B0B] rounded-3xl max-w-xl w-full p-5 sm:p-7 border border-[#D4AF37]/40 shadow-2xl relative text-white my-auto max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                ATOR ALI Checkout
              </h2>
              <p className="text-[11px] text-[#D4AF37] font-medium">
                Enter delivery details & select payment method
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-full text-slate-400 hover:text-white bg-[#1A1812] border border-[#D4AF37]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-5">
          {/* 1. Customer Information */}
          <div className="space-y-3.5 bg-[#14120C] p-4 rounded-2xl border border-[#D4AF37]/20">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> 1. Delivery Information
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#0B0B0B] border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.fullName ? 'border-rose-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone Number (BD 01XXXXXXXXX) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#0B0B0B] border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.phone ? 'border-rose-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Delivery Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, Road no, Area, Thana"
                  className={`w-full pl-9 pr-3 py-2 bg-[#0B0B0B] border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.address ? 'border-rose-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.address}
                </p>
              )}
            </div>

            {/* District Dropdown (64 Districts) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`w-full pl-9 pr-8 py-2.5 bg-[#0B0B0B] border rounded-xl text-xs text-white focus:outline-none cursor-pointer transition-colors ${
                    errors.district ? 'border-rose-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-[#0B0B0B] text-white">
                      {d} {d === 'Dhaka' ? '(Inside Dhaka)' : '(Outside Dhaka)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Delivery Charge & Total Summary */}
          <div className="bg-[#14120C] p-4 rounded-2xl border border-[#D4AF37]/20 space-y-2">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Truck className="w-3.5 h-3.5" /> 2. Order Summary
            </h3>
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Items Subtotal</span>
              <span className="font-semibold text-white">
                ৳{itemsSubtotalBDT.toLocaleString('en-US')} ({formatUSD(itemsSubtotalUSD)})
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Delivery Charge</span>
              <span className="font-semibold text-[#D4AF37]">
                ৳{deliveryChargeBDT} ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
              </span>
            </div>
            <div className="border-t border-[#D4AF37]/20 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-bold font-serif text-white">Grand Total</span>
              <span className="text-xl font-extrabold text-[#D4AF37]">
                ৳{grandTotalBDT.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          {/* 3. Selectable Payment Methods */}
          <div className="space-y-3 bg-[#14120C] p-4 rounded-2xl border border-[#D4AF37]/20">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> 3. Select Payment Method
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'bg-[#2B230F] border-[#D4AF37] text-[#D4AF37] shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#0B0B0B] border-[#D4AF37]/20 text-slate-300 hover:border-[#D4AF37]/50'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[11px] font-extrabold leading-tight">Cash on Delivery</span>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'bkash'
                    ? 'bg-pink-950/60 border-pink-500 text-pink-400 shadow-md shadow-pink-900/30'
                    : 'bg-[#0B0B0B] border-[#D4AF37]/20 text-slate-300 hover:border-pink-500/50'
                }`}
              >
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#E2136E] text-white">
                  bKash
                </span>
                <span className="text-[11px] font-bold leading-tight">Send Money</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'nagad'
                    ? 'bg-orange-950/60 border-orange-500 text-orange-400 shadow-md shadow-orange-900/30'
                    : 'bg-[#0B0B0B] border-[#D4AF37]/20 text-slate-300 hover:border-orange-500/50'
                }`}
              >
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#F7921E] text-white">
                  Nagad
                </span>
                <span className="text-[11px] font-bold leading-tight">Send Money</span>
              </button>
            </div>

            {/* MFS Payment Instructions Box (bKash or Nagad) */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && mfsDetails && (
              <div className={`mt-3 p-4 rounded-2xl border ${mfsDetails.bgColor} space-y-3 animate-in fade-in duration-200`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded text-white ${mfsDetails.badgeBg}`}>
                    {mfsDetails.name} Send Money Instructions
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    Send Exact: <strong className="text-[#D4AF37]">৳{grandTotalBDT.toLocaleString('en-US')}</strong>
                  </span>
                </div>

                {/* Number with Copy Button */}
                <div className="bg-[#0B0B0B] p-3 rounded-xl border border-[#D4AF37]/30 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Send Money to this number:
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#D4AF37] tracking-wider">
                      {mfsDetails.number}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyNumber(mfsDetails.number)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#1A1812] hover:bg-[#252014] text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Steps */}
                <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside font-medium bg-[#0B0B0B]/60 p-3 rounded-xl border border-white/5">
                  <li>Open your {mfsDetails.name} app.</li>
                  <li>Choose <strong>Send Money</strong>.</li>
                  <li>Send exact amount <strong>৳{grandTotalBDT.toLocaleString('en-US')}</strong> to <strong>{mfsDetails.number}</strong>.</li>
                  <li>Enter your Sender Number and Transaction ID (TrxID) below.</li>
                </ol>

                {/* Sender Number & TrxID Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-200 mb-1">
                      {mfsDetails.name} Sender Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className={`w-full px-3 py-2 bg-[#0B0B0B] border rounded-xl text-xs text-white focus:outline-none ${
                        errors.senderNumber ? 'border-rose-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                      }`}
                    />
                    {errors.senderNumber && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{errors.senderNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-200 mb-1">
                      Transaction ID (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J4K2L8M"
                      className={`w-full px-3 py-2 bg-[#0B0B0B] border rounded-xl text-xs text-white uppercase focus:outline-none ${
                        errors.trxId ? 'border-rose-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                      }`}
                    />
                    {errors.trxId && (
                      <p className="text-[10px] text-rose-400 mt-0.5">{errors.trxId}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-[#D4AF37]/25 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Confirm Order on WhatsApp (৳{grandTotalBDT.toLocaleString('en-US')})</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}
