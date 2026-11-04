import React, { useEffect } from 'react';
import { AlertTriangle, Zap, X } from 'lucide-react';

interface SyncTabAlertModalProps {
  isOpen: boolean;
  onEnableAndExecute: () => void;
  onExecuteWithoutSync?: () => void;
  onClose: () => void;
}

export const SyncTabAlertModal: React.FC<SyncTabAlertModalProps> = ({
  isOpen,
  onEnableAndExecute,
  onExecuteWithoutSync,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#191D24] border-2 border-[#F59E0B] rounded-lg shadow-[0_0_25px_rgba(245,158,11,0.25)] w-full max-w-sm overflow-hidden text-[#F5F7FA]"
      >
        {/* Header Bar */}
        <div className="bg-[#111318] border-b border-[#303744] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#F59E0B]">
            <AlertTriangle size={14} className="text-[#F59E0B]" />
            <span>[Alert] Sync Tab Belum Aktif</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors p-0.5 rounded"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-[#F59E0B]/15 text-[#F59E0B] rounded-full shrink-0">
              <Zap size={22} className="fill-[#F59E0B]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#F5F7FA]">
                Fitur Sync Tab sedang OFF
              </h4>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Tombol <strong className="text-[#A3FF70]">Execute</strong> digunakan untuk menjalankan kueri langsung di browser tab aktif. Saat ini status Sync Tab masih nonaktif (OFF).
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-1.5">
            {/* Primary Action: Enable & Execute */}
            <button
              type="button"
              onClick={onEnableAndExecute}
              className="w-full flex items-center justify-center space-x-1.5 bg-[#A3FF70] hover:bg-[#8ee85c] text-[#111318] font-bold text-xs py-2 px-3 rounded transition-colors shadow-sm"
            >
              <Zap size={13} className="fill-[#111318]" />
              <span>Aktifkan Sync Tab & Jalankan</span>
            </button>

            {/* Secondary Option: Execute Background Fetch Only */}
            {onExecuteWithoutSync && (
              <button
                type="button"
                onClick={onExecuteWithoutSync}
                className="w-full text-center bg-[#202630] hover:bg-[#2A3342] text-[#9CA3AF] hover:text-[#F5F7FA] text-[11px] py-1.5 px-3 rounded border border-[#303744] transition-colors"
              >
                Tetap Jalankan (Silent Background Fetch)
              </button>
            )}

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-[#6B7280] hover:text-[#9CA3AF] text-[11px] py-1 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

