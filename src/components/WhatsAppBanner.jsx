import React from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_BANNER_DATA } from '../data/banners';
import { MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

/**
 * WhatsAppBanner Component - Extrovat Lifestyle
 */
export default function WhatsAppBanner() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent("I want to order from Extrovat Lifestyle");

  return (
    <section
      aria-label="Order on WhatsApp banner"
      className="w-full my-6 bg-[#FFFFFF] rounded-[24px] p-5 sm:p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        {/* Left info */}
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-[#0F9D6B] text-[#FFFFFF] border-2 border-[#0E1330] shrink-0 shadow-[2px_2px_0px_#0E1330]">
            <MessageCircle className="w-6 h-6 fill-[#FFFFFF] text-[#0F9D6B]" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC933] text-[10px] font-heading font-extrabold text-[#0E1330] border border-[#0E1330] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0E1330]" />
              <span>Direct order</span>
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-extrabold text-[#0E1330] tracking-tight">
              {WHATSAPP_BANNER_DATA.title}
            </h3>
            <p className="text-xs font-sans text-[#5B6079] max-w-lg">
              {WHATSAPP_BANNER_DATA.subtext}
            </p>
          </div>
        </div>

        {/* Right WhatsApp Link Button */}
        <div className="shrink-0 w-full md:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat and order on WhatsApp"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F9D6B] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-[#FFFFFF] text-[#0F9D6B]" />
            <span>{WHATSAPP_BANNER_DATA.buttonText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
