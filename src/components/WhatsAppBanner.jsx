import React from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_BANNER_DATA } from '../data/banners';
import { MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

/**
 * WhatsAppBanner Component
 *
 * Requirements:
 * - Positioned above footer
 * - Banner text: "Order on WhatsApp"
 * - Green action <a> tag with href pointing to https://wa.me/8809638316596?text=...
 * - target="_blank", rel="noopener noreferrer"
 */
export default function WhatsAppBanner() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent("Assalamu alaikum, I want to order from ATOR ALI.");

  return (
    <section
      aria-label="Order on WhatsApp Banner"
      className="w-full my-8 bg-gradient-to-r from-[#0B0B0B] via-[#0E1F16] to-[#0B0B0B] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left info */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
            <MessageCircle className="w-8 h-8 fill-emerald-500/30 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DIRECT ASSISTANCE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              {WHATSAPP_BANNER_DATA.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
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
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>{WHATSAPP_BANNER_DATA.buttonText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
