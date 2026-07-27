import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export function PWAInstallPrompt(): React.JSX.Element | null {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  return (
    <div className="bg-[#209CAF]/15 border border-[#209CAF] px-4 py-3 rounded-[var(--radius-btn)] mb-6 flex items-center justify-between text-xs">
      <span className="font-semibold text-ink dark:text-white">Pasang aplikasi Sholat UP untuk akses offline cepat tanpa internet.</span>
      <button
        onClick={handleInstall}
        className="bg-[#209CAF] hover:bg-[#177C8C] text-white px-3 py-1.5 rounded-[6px] font-bold flex items-center gap-1.5 transition"
      >
        <Download className="w-3.5 h-3.5" /> Pasang
      </button>
    </div>
  );
}
