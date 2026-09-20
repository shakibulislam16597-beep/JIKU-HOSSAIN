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
 * CheckoutModal Component - Extrovat Lifestyle
 * Requirements:
 * - Rebrand header and messages: "I want to order from Extrovat Lifestyle"
 * - 2px ink borders, 4px offset shadows, sentence case typography
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
        bgColor: 'bg-pink-50 border-[#0E1330]',
        textColor: 'text-pink-700',
        badgeBg: 'bg-[#FFC933] text-[#0E1330]',
      };
    }
    if (paymentMethod === 'nagad') {
      return {
        name: 'Nagad',
        number: NAGAD_NUMBER,
        bgColor: 'bg-orange-50 border-[#0E1330]',
        textColor: 'text-orange-700',
        badgeBg: 'bg-[#FFC933] text-[#0E1330]',
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
      newErrors.phone = 'Enter a valid 11-digit BD phone number';
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

    let message = `I want to order from Extrovat Lifestyle\n`;
    message += `===========================\n\n`;
    message += `CUSTOMER DETAILS:\n`;
    message += `Name: ${fullName.trim()}\n`;
    message += `Phone: ${phone.trim()}\n`;
    message += `Address: ${address.trim()}\n`;
    message += `District: ${district}\n\n`;

    message += `ORDERED ITEMS:\n`;
    cartItems.forEach((item, idx) => {
      const sizeStr = item.selectedSize ? ` (${item.selectedSize})` : '';
      const lineBDT = formatBDT(item.price * item.quantity);
      message += `${idx + 1}. ${item.title}${sizeStr} x ${item.quantity} = ${lineBDT}\n`;
    });

    message += `\nPRICING SUMMARY:\n`;
    message += `Items subtotal: ${formatBDT(itemsSubtotalBDT)}\n`;
    message += `Delivery charge: ${formatBDT(deliveryChargeBDT)} (${isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})\n`;
    message += `GRAND TOTAL: ${formatBDT(grandTotalBDT)}\n\n`;

    message += `PAYMENT METHOD:\n`;
    if (paymentMethod === 'cod') {
      message += `Method: Cash on delivery (COD)\n`;
    } else {
      const mfs = getMfsDetails();
      message += `Method: ${mfs.name}\n`;
      message += `Sender number: ${senderNumber.trim()}\n`;
      message += `Transaction ID (TrxID): ${trxId.trim()}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    onSuccessOrder();
  };

  const mfsDetails = getMfsDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-[24px] max-w-xl w-full p-5 sm:p-7 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative text-[#0E1330] my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#0E1330] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E1330] text-[#FFFFFF]">
              <ShieldCheck className="w-5 h-5 text-[#FFFFFF]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#0E1330]">
                Extrovat Lifestyle checkout
              </h2>
              <p className="text-xs font-sans text-[#5B6079]">
                Enter delivery details & select payment method
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* 1. Customer Information */}
          <div className="space-y-3 bg-[#F7F8FC] p-4 rounded-[16px] border-2 border-[#0E1330]">
            <h3 className="text-xs font-heading font-bold text-[#0E1330] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#2436F5]" /> 1. Delivery information
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#0E1330] mb-1">
                Full name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6079]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className={`w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border-2 rounded-xl text-xs text-[#0E1330] font-sans focus:outline-none transition-colors ${
                    errors.fullName ? 'border-rose-500' : 'border-[#0E1330] focus:border-[#2436F5]'
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
              <label className="block text-xs font-sans font-medium text-[#0E1330] mb-1">
                Phone number (BD 01XXXXXXXXX) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6079]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className={`w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border-2 rounded-xl text-xs text-[#0E1330] font-sans focus:outline-none transition-colors ${
                    errors.phone ? 'border-rose-500' : 'border-[#0E1330] focus:border-[#2436F5]'
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
              <label className="block text-xs font-sans font-medium text-[#0E1330] mb-1">
                Full delivery address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#5B6079]" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, Road no, Area, Thana"
                  className={`w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border-2 rounded-xl text-xs text-[#0E1330] font-sans focus:outline-none transition-colors ${
                    errors.address ? 'border-rose-500' : 'border-[#0E1330] focus:border-[#2436F5]'
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
              <label className="block text-xs font-sans font-medium text-[#0E1330] mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6079] pointer-events-none" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-xl text-xs text-[#0E1330] font-sans focus:outline-none focus:border-[#2436F5] cursor-pointer"
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
          <div className="bg-[#F7F8FC] p-4 rounded-[16px] border-2 border-[#0E1330] space-y-1.5 font-sans">
            <h3 className="text-xs font-heading font-bold text-[#0E1330] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Truck className="w-3.5 h-3.5 text-[#2436F5]" /> 2. Order summary
            </h3>
            <div className="flex justify-between items-center text-xs text-[#5B6079]">
              <span>Items subtotal</span>
              <span className="font-extrabold text-[#0E1330]">{formatBDT(itemsSubtotalBDT)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#5B6079]">
              <span>Delivery charge</span>
              <span className="font-bold text-[#0E1330]">
                {formatBDT(deliveryChargeBDT)} ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
              </span>
            </div>
            <div className="border-t border-[#0E1330]/20 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-heading font-extrabold text-[#0E1330]">Grand total</span>
              <span className="text-xl font-extrabold text-[#0E1330]">
                {formatBDT(grandTotalBDT)}
              </span>
            </div>
          </div>

          {/* 3. Select Payment Method */}
          <div className="space-y-3 bg-[#F7F8FC] p-4 rounded-[16px] border-2 border-[#0E1330]">
            <h3 className="text-xs font-heading font-bold text-[#0E1330] uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#2436F5]" /> 3. Select payment method
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'cod'
                    ? 'bg-[#0E1330] border-[#0E1330] text-[#FFFFFF] shadow-[2px_2px_0px_#0E1330]'
                    : 'bg-[#FFFFFF] border-[#0E1330] text-[#0E1330] hover:bg-[#FFC933]'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-[11px] font-heading font-bold leading-tight">Cash on delivery</span>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'bkash'
                    ? 'bg-[#E2136E] border-[#0E1330] text-[#FFFFFF] shadow-[2px_2px_0px_#0E1330]'
                    : 'bg-[#FFFFFF] border-[#0E1330] text-[#0E1330] hover:bg-pink-100'
                }`}
              >
                <span className="text-[10px] font-heading font-extrabold uppercase">bKash</span>
                <span className="text-[11px] font-bold leading-tight">Send money</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'nagad'
                    ? 'bg-[#F7921E] border-[#0E1330] text-[#FFFFFF] shadow-[2px_2px_0px_#0E1330]'
                    : 'bg-[#FFFFFF] border-[#0E1330] text-[#0E1330] hover:bg-orange-100'
                }`}
              >
                <span className="text-[10px] font-heading font-extrabold uppercase">Nagad</span>
                <span className="text-[11px] font-bold leading-tight">Send money</span>
              </button>
            </div>

            {/* MFS Payment Instructions Box */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && mfsDetails && (
              <div className="p-3.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] space-y-2.5 font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded border border-[#0E1330] bg-[#FFC933] text-[#0E1330]">
                    {mfsDetails.name} send money instructions
                  </span>
                  <span className="text-[11px] text-[#0E1330] font-semibold">
                    Send exact: <strong className="text-[#0E1330]">{formatBDT(grandTotalBDT)}</strong>
                  </span>
                </div>

                {/* Number with Copy Button */}
                <div className="bg-[#F7F8FC] p-2.5 rounded-xl border border-[#0E1330] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#5B6079] block font-heading font-bold uppercase">
                      Send money to this number:
                    </span>
                    <span className="text-lg font-mono font-extrabold text-[#0E1330] tracking-wider">
                      {mfsDetails.number}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyNumber(mfsDetails.number)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0E1330] text-[#FFFFFF] rounded-xl border border-[#0E1330] text-xs font-heading font-bold hover:bg-[#2436F5] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FFC933]" />
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

                {/* Sender Number & TrxID Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-[#0E1330] mb-0.5">
                      Sender number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className={`w-full px-2.5 py-1.5 bg-[#FFFFFF] border-2 rounded-xl text-xs text-[#0E1330] focus:outline-none ${
                        errors.senderNumber ? 'border-rose-500' : 'border-[#0E1330] focus:border-[#2436F5]'
                      }`}
                    />
                    {errors.senderNumber && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{errors.senderNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-[#0E1330] mb-0.5">
                      TrxID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J4K2L8M"
                      className={`w-full px-2.5 py-1.5 bg-[#FFFFFF] border-2 rounded-xl text-xs text-[#0E1330] uppercase focus:outline-none ${
                        errors.trxId ? 'border-rose-500' : 'border-[#0E1330] focus:border-[#2436F5]'
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
            className="w-full py-3.5 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Confirm order on WhatsApp ({formatBDT(grandTotalBDT)})</span>
            <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
          </button>
        </form>
      </div>
    </div>
  );
}
