import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

/**
 * InstallPrompt Component - PWA install banner for Extrovat Lifestyle
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted Extrovat Lifestyle PWA install');
    }
    setDeferredPrompt(null);
  };

  if (isDismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 z-40 bg-[#FFFFFF] text-[#0E1330] p-3.5 rounded-[20px] shadow-[4px_4px_0px_#0E1330] border-2 border-[#0E1330] flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#0E1330] text-[#FFFFFF] font-heading font-extrabold flex items-center justify-center text-xs shrink-0">
          EL
        </div>
        <div>
          <h4 className="text-xs font-heading font-bold text-[#0E1330]">Add Extrovat Lifestyle App</h4>
          <p className="text-[10px] font-sans text-[#5B6079]">Fast access from your home screen</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#FFC933] text-[#0E1330] font-heading font-extrabold text-[11px] border border-[#0E1330] uppercase rounded-full transition-colors cursor-pointer flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 text-[#5B6079] hover:text-[#0E1330]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
