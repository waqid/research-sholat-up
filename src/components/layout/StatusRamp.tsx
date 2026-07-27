import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function StatusRamp({ gpsStatus, errorMsg, onRetryGps }: { gpsStatus: string; errorMsg?: string | null; onRetryGps: () => void }): React.JSX.Element | null {
  if (gpsStatus !== 'error' && !errorMsg) return null;

  return (
    <div className="bg-[#F59E0B]/15 border border-[#F59E0B] text-[#18181B] dark:text-[#F8FAFC] px-4 py-2.5 rounded-[var(--radius-btn)] mb-4 flex items-center justify-between text-xs font-medium">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <span>{errorMsg || 'Gagal mendeteksi GPS. Menggunakan lokasi default Kota Malang.'}</span>
      </div>
      <button
        onClick={onRetryGps}
        className="flex items-center gap-1 text-[#209CAF] font-bold hover:underline ml-2"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
      </button>
    </div>
  );
}
