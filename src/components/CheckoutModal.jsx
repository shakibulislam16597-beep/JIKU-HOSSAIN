import React, { useState } from 'react';
import { WHATSAPP_NUMBER, BKASH_NUMBER, NAGAD_NUMBER } from '../config';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { formatBDT } from '../utils/currency';
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
 * CheckoutModal Component - ATOR ALI (Clean Light Theme)
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
  const itemsSubtotalBDT = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isInsideDhaka = district.trim().toLowerCase() === 'dhaka';
  const deliveryChargeBDT = isInsideDhaka ? 80 : 130;
  const grandTotalBDT = itemsSubtotalBDT + deliveryChargeBDT;

  const getMfsDetails = () => {
    if (paymentMethod === 'bkash') {
      return {
        name: 'bKash',
        number: BKASH_NUMBER,
        bgColor: 'bg-pink-50 border-pink-200',
        textColor: 'text-pink-700',
        badgeBg: 'bg-[#E2136E] text-white',
      };
    }
    if (paymentMethod === 'nagad') {
      return {
        name: 'Nagad',
        number: NAGAD_NUMBER,
        bgColor: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-700',
        badgeBg: 'bg-[#F7921E] text-white',
      };
    }
    return null;
  };

  const handleCopyNumber = (numToCopy) => {
    navigator.clipboard.writeText(numToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

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

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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
      const lineBDT = formatBDT(item.price * item.quantity);
      message += `${idx + 1}. ${item.title}${sizeStr} x ${item.quantity} = ${lineBDT}\n`;
    });

    message += `\nPRICING SUMMARY:\n`;
    message += `Items Subtotal: ${formatBDT(itemsSubtotalBDT)}\n`;
    message += `Delivery Charge: ${formatBDT(deliveryChargeBDT)} (${isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})\n`;
    message += `GRAND TOTAL: ${formatBDT(grandTotalBDT)}\n\n`;

    message += `PAYMENT METHOD:\n`;
    if (paymentMethod === 'cod') {
      message += `Method: Cash on Delivery (COD)\n`;
    } else {
      const mfs = getMfsDetails();
      message += `Method: ${mfs.name}\n`;
      message += `Sender Number: ${senderNumber.trim()}\n`;
      message += `Transaction ID (TrxID): ${trxId.trim()}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    onSuccessOrder();
  };

  const mfsDetails = getMfsDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 border border-gray-200 shadow-2xl relative text-gray-900 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black text-white">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black">
                ATOR ALI Checkout
              </h2>
              <p className="text-xs text-gray-500">
                Enter delivery details & select payment method
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* 1. Customer Information */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-black" /> 1. Delivery Information
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-hidden transition-colors ${
                    errors.fullName ? 'border-rose-500' : 'border-gray-200 focus:border-black'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-500 mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number (BD 01XXXXXXXXX) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-hidden transition-colors ${
                    errors.phone ? 'border-rose-500' : 'border-gray-200 focus:border-black'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-rose-500 mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Delivery Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, Road no, Area, Thana"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-hidden transition-colors ${
                    errors.address ? 'border-rose-500' : 'border-gray-200 focus:border-black'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-[11px] text-rose-500 mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.address}
                </p>
              )}
            </div>

            {/* District Dropdown (64 Districts) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-black cursor-pointer"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 'Dhaka' ? '(Inside Dhaka ৳80)' : '(Outside Dhaka ৳130)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Order Summary */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Truck className="w-3.5 h-3.5 text-black" /> 2. Order Summary
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-gray-900">{formatBDT(itemsSubtotalBDT)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Delivery Charge</span>
              <span className="font-bold text-black">
                {formatBDT(deliveryChargeBDT)} ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-bold text-black">Grand Total</span>
              <span className="text-xl font-extrabold text-black">
                {formatBDT(grandTotalBDT)}
              </span>
            </div>
          </div>

          {/* 3. Select Payment Method */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-black" /> 3. Select Payment Method
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'cod'
                    ? 'bg-black border-black text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-[11px] font-bold leading-tight">Cash on Delivery</span>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'bkash'
                    ? 'bg-[#E2136E] border-[#E2136E] text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider">bKash</span>
                <span className="text-[11px] font-bold leading-tight">Send Money</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'nagad'
                    ? 'bg-[#F7921E] border-[#F7921E] text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Nagad</span>
                <span className="text-[11px] font-bold leading-tight">Send Money</span>
              </button>
            </div>

            {/* MFS Payment Instructions Box (bKash or Nagad) */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && mfsDetails && (
              <div className={`p-3.5 rounded-xl border ${mfsDetails.bgColor} space-y-2.5`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${mfsDetails.badgeBg}`}>
                    {mfsDetails.name} Send Money Instructions
                  </span>
                  <span className="text-[11px] text-gray-700 font-semibold">
                    Send Exact: <strong className="text-black">{formatBDT(grandTotalBDT)}</strong>
                  </span>
                </div>

                {/* Number with Copy Button */}
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-bold uppercase">
                      Send Money to this number:
                    </span>
                    <span className="text-lg font-mono font-extrabold text-black tracking-wider">
                      {mfsDetails.number}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyNumber(mfsDetails.number)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
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
                <ol className="text-[11px] text-gray-700 space-y-0.5 list-decimal list-inside font-medium bg-white/60 p-2 rounded-lg border border-gray-200">
                  <li>Open your {mfsDetails.name} app.</li>
                  <li>Choose <strong>Send Money</strong>.</li>
                  <li>Send exact <strong>{formatBDT(grandTotalBDT)}</strong> to <strong>{mfsDetails.number}</strong>.</li>
                  <li>Enter Sender Number & TrxID below.</li>
                </ol>

                {/* Sender Number & TrxID Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-0.5">
                      Sender Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className={`w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs text-gray-900 focus:outline-hidden ${
                        errors.senderNumber ? 'border-rose-500' : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.senderNumber && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{errors.senderNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-0.5">
                      TrxID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J4K2L8M"
                      className={`w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs text-gray-900 uppercase focus:outline-hidden ${
                        errors.trxId ? 'border-rose-500' : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {errors.trxId && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{errors.trxId}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Confirm Order on WhatsApp ({formatBDT(grandTotalBDT)})</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
