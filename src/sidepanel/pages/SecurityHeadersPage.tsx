import React from 'react';
import { useAppStore } from '@/stores/appStore';
import { analyzeSecurityHeaders } from '@/core/security/headers';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const SecurityHeadersPage: React.FC = () => {
  const { response } = useAppStore();

  if (!response) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-2 bg-[#111318]">
        <ShieldAlert size={32} className="text-[#9CA3AF]" />
        <h3 className="text-sm font-bold text-[#F5F7FA]">No Active Response Headers</h3>
        <p className="text-xs text-[#9CA3AF] max-w-xs">
          Send a request using the Request Builder to automatically inspect defensive security headers and server disclosures.
        </p>
      </div>
    );
  }

  const analysis = analyzeSecurityHeaders(response.headers);

  const getScoreBadge = (score: 'strong' | 'moderate' | 'weak') => {
    switch (score) {
      case 'strong':
        return (
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-2 py-0.5 rounded text-xs font-bold flex items-center space-x-1">
            <CheckCircle2 size={13} />
            <span>Strong Posture</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded text-xs font-bold flex items-center space-x-1">
            <AlertTriangle size={13} />
            <span>Moderate Posture</span>
          </span>
        );
      case 'weak':
        return (
          <span className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 px-2 py-0.5 rounded text-xs font-bold flex items-center space-x-1">
            <ShieldAlert size={13} />
            <span>Weak Posture</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#111318]">
      <div className="flex items-center justify-between pb-2 border-b border-[#303744]">
        <div>
          <h2 className="text-sm font-bold text-[#F5F7FA]">Security Headers Assessment</h2>
          <p className="text-xs text-[#9CA3AF]">Defensive posture check for {response.url}</p>
        </div>
        {getScoreBadge(analysis.overallScore)}
      </div>

      {/* Disclosures section */}
      {analysis.serverDisclosures.length > 0 && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded p-2.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B]">
            <AlertTriangle size={13} />
            <span>Information Leakage Detected</span>
          </div>
          <p className="text-[11px] text-[#9CA3AF]">
            Target reveals server software or backend frameworks:
          </p>
          <div className="space-y-0.5 pt-1">
            {analysis.serverDisclosures.map((d) => (
              <div key={d.name} className="text-xs font-mono">
                <span className="text-[#F59E0B]">{d.name}:</span>{' '}
                <span className="text-[#F5F7FA]">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Headers List */}
      <div className="space-y-2">
        {analysis.headers.map((h) => {
          const isGood = h.status === 'good';
          const isWarning = h.status === 'warning';

          return (
            <div
              key={h.headerName}
              className="bg-[#191D24] border border-[#303744] rounded p-2.5 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#F5F7FA]">{h.headerName}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                    isGood
                      ? 'bg-[#22C55E]/15 text-[#22C55E]'
                      : isWarning
                      ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                      : 'bg-[#EF4444]/15 text-[#EF4444]'
                  }`}
                >
                  {isGood ? 'Present' : isWarning ? 'Attention' : 'Missing'}
                </span>
              </div>

              {h.value ? (
                <div className="bg-[#111318] p-1.5 rounded font-mono text-[11px] text-[#A3FF70] break-all border border-[#202630]">
                  {h.value}
                </div>
              ) : (
                <div className="text-[11px] text-[#9CA3AF] italic">Header not configured in response</div>
              )}

              <p className="text-[11px] text-[#9CA3AF] pt-0.5 flex items-start space-x-1">
                <Info size={12} className="shrink-0 mt-0.5 text-[#38BDF8]" />
                <span>{h.recommendation}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
