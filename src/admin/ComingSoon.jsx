import React from 'react';
import { Clock } from 'lucide-react';

export default function ComingSoon({ pageTitle = 'Page' }) {
  return (
    <div className="bg-[#FFFFFF] rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] p-8 text-center space-y-4 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-[#FFC933] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] flex items-center justify-center mx-auto text-[#0E1330]">
        <Clock className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-heading font-extrabold text-[#0E1330]">
          {pageTitle}
        </h2>
        <p className="text-xs font-sans text-[#5B6079]">
          This feature module is under active development and coming soon.
        </p>
      </div>
      <div className="pt-2">
        <a
          href="#/admin/dashboard"
          className="inline-block px-4 py-2.5 bg-[#2436F5] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] hover:bg-[#1B29C4] transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
