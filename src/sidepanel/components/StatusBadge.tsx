import React from 'react';
import { Clock, HardDrive, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: number;
  statusText: string;
  durationMs: number;
  sizeBytes: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusText,
  durationMs,
  sizeBytes
}) => {
  const getStatusColor = (s: number) => {
    if (s >= 200 && s < 300) return 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30';
    if (s >= 300 && s < 400) return 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30';
    if (s >= 400 && s < 500) return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30';
    if (s >= 500) return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
    return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
  };

  const getStatusIcon = (s: number) => {
    if (s >= 200 && s < 300) return <CheckCircle2 size={13} />;
    if (s >= 300 && s < 400) return <AlertTriangle size={13} />;
    return <AlertCircle size={13} />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div
        className={`flex items-center space-x-1 px-2 py-0.5 rounded border font-mono font-bold ${getStatusColor(
          status
        )}`}
      >
        {getStatusIcon(status)}
        <span>
          {status} {statusText}
        </span>
      </div>

      <div className="flex items-center space-x-1 text-[#9CA3AF] bg-[#202630] px-2 py-0.5 rounded border border-[#303744]">
        <Clock size={12} />
        <span>{durationMs}ms</span>
      </div>

      <div className="flex items-center space-x-1 text-[#9CA3AF] bg-[#202630] px-2 py-0.5 rounded border border-[#303744]">
        <HardDrive size={12} />
        <span>{formatSize(sizeBytes)}</span>
      </div>
    </div>
  );
};

