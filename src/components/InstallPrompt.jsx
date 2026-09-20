import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

/**
 * InstallPrompt Component - PWA install banner
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
      console.log('User accepted ATOR ALI PWA install');
    }
    setDeferredPrompt(null);
  };

  if (isDismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 z-40 bg-black text-white p-3 rounded-2xl shadow-2xl border border-gray-800 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-black font-extrabold flex items-center justify-center text-xs shrink-0">
          AA
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Add ATOR ALI App</h4>
          <p className="text-[10px] text-gray-300">Fast access from your home screen</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-[11px] uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
