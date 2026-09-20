import React from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_BANNER_DATA } from '../data/banners';
import { MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

/**
 * WhatsAppBanner Component - ATOR ALI (Clean Light Theme)
 */
export default function WhatsAppBanner() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent("Assalamu alaikum, I want to order from ATOR ALI.");

  return (
    <section
      aria-label="Order on WhatsApp Banner"
      className="w-full my-6 bg-emerald-50 rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-xs relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        {/* Left info */}
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0 shadow-xs">
            <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>DIRECT ORDER</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {WHATSAPP_BANNER_DATA.title}
            </h3>
            <p className="text-xs text-gray-600 max-w-lg">
              {WHATSAPP_BANNER_DATA.subtext}
            </p>
          </div>
        </div>

        {/* Right Green WhatsApp Link Button */}
        <div className="shrink-0 w-full md:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat and order on WhatsApp"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>{WHATSAPP_BANNER_DATA.buttonText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
