import React, { useState } from 'react';
import { useAppStore, NavigationPage } from '@/stores/appStore';
import {
  Send,
  Link,
  Code2,
  ShieldCheck,
  Bookmark,
  History,
  ShieldAlert,
  Settings,
  Globe,
  Info,
  X,
  Terminal,
  Award,
  ExternalLink
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, loadActiveTabUrl } = useAppStore();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'builder', label: 'Builder', icon: <Send size={14} /> },
    { id: 'parser', label: 'URL', icon: <Link size={14} /> },
    { id: 'encoder', label: 'Encoder', icon: <Code2 size={14} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={14} /> },
    { id: 'payloads', label: 'Payloads', icon: <Bookmark size={14} /> },
    { id: 'history', label: 'History', icon: <History size={14} /> },
    { id: 'scope', label: 'Scope', icon: <ShieldAlert size={14} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={14} /> }
  ];

  return (
    <header className="bg-[#191D24] border-b border-[#303744] flex flex-col shrink-0 select-none relative">
      {/* Top Action Bar: About + Version + Active Tab (No redundant duplicate logo/title) */}
      <div className="flex items-center justify-between gap-1.5 px-2 py-1 border-b border-[#202630] overflow-x-auto scrollbar-none bg-[#111318]">
        {/* Left: About & Zone Xploiter Links */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowAboutModal(true)}
            title="About ZX HACKBAR"
            className="flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#A3FF70] border border-[#A3FF70]/40 hover:border-[#A3FF70] transition-all shadow-sm cursor-pointer"
          >
            <Info size={11} />
            <span>About</span>
          </button>

          <a
            href="https://github.com/Zone-Xploiter"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Zone Xploiter on GitHub (https://github.com/Zone-Xploiter)"
            className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B22] hover:bg-[#202630] text-[#9CA3AF] hover:text-[#A3FF70] border border-[#303744] hover:border-[#A3FF70]/50 transition-colors shrink-0"
          >
            <img
              src="icons/zone-xploiter.png"
              alt="Zone Xploiter"
              className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
            />
            <span className="hidden min-[480px]:inline">v1.1.0 • Zone Xploiter</span>
            <span className="min-[480px]:hidden">v1.1</span>
            <ExternalLink size={9} />
          </a>
        </div>

        {/* Right: Active Tab Action Control */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => loadActiveTabUrl()}
            title="Import URL from current browser tab"
            className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-[#202630] hover:bg-[#303744] text-[#A3FF70] border border-[#303744] hover:border-[#A3FF70]/50 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            <Globe size={11} />
            <span>Active Tab</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Strictly 1 Single Line with Responsive Labels) */}
      <nav className="flex items-center justify-between gap-0.5 px-1.5 py-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={item.label}
              className={`flex items-center justify-center space-x-1 px-1.5 py-1 text-xs rounded font-medium transition-all whitespace-nowrap shrink-0 flex-1 ${
                isActive
                  ? 'bg-[#A3FF70] text-[#111318] shadow-sm font-bold'
                  : 'text-[#9CA3AF] hover:text-[#F5F7FA] hover:bg-[#202630]'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden min-[580px]:inline text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* About Modal */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="w-full max-w-[320px] bg-[#111318] border-2 border-[#A3FF70] rounded-lg shadow-[0_0_30px_rgba(163,255,112,0.25)] overflow-hidden text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#191D24] border-b border-[#303744]">
              <div className="flex items-center space-x-2">
                <img
                  src="icons/zone-xploiter.png"
                  alt="Zone Xploiter Logo"
                  className="w-5 h-5 rounded-full object-cover border border-[#A3FF70]/60"
                />
                <span className="font-bold text-xs tracking-wider text-[#F5F7FA]">
                  ABOUT <span className="text-[#A3FF70]">ZX HACKBAR</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-[#9CA3AF] hover:text-[#EF4444] p-0.5 rounded transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 space-y-3 text-[#F5F7FA]">
              {/* Zone Xploiter Logo Banner */}
              <div className="flex flex-col items-center justify-center bg-[#191D24] p-3 rounded border border-[#303744] space-y-2">
                <a
                  href="https://github.com/Zone-Xploiter"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open https://github.com/Zone-Xploiter"
                  className="group relative"
                >
                  <img
                    src="icons/zone-xploiter.png"
                    alt="Zone Xploiter"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#A3FF70] shadow-[0_0_15px_rgba(163,255,112,0.3)] group-hover:scale-105 transition-transform"
                  />
                </a>
                <div className="text-center">
                  <div className="font-bold text-xs text-[#F5F7FA] tracking-wide">
                    XEOO <span className="text-[#A3FF70]">HACKBAR</span>
                  </div>
                  <a
                    href="https://github.com/Zone-Xploiter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[10px] font-mono text-[#38BDF8] hover:text-[#A3FF70] hover:underline mt-0.5"
                  >
                    <span>https://github.com/Zone-Xploiter</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 bg-[#191D24] p-2.5 rounded border border-[#303744]">
                <Terminal size={16} className="text-[#A3FF70] shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px] leading-relaxed text-[#9CA3AF]">
                  <p className="text-[#F5F7FA] font-semibold">
                    Modern Web Security & HTTP Request Toolkit
                  </p>
                  <p>
                    XEOO HackBar adalah ekstensi Chrome Side Panel untuk pengujian keamanan aplikasi web, inspeksi HTTP request/response, pemisahan parameter URL, serta utilitas encoding/decoding secara terstruktur.
                  </p>
                </div>
              </div>

              {/* Copyright & Author Card */}
              <div className="bg-[#191D24] p-2.5 rounded border border-[#A3FF70]/40 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[#A3FF70] font-bold text-[11px]">
                  <Award size={13} />
                  <span>Author & Copyright</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Developer:</span>
                    <span className="text-[#F5F7FA] font-semibold">NttBell / ZXMarchia</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9CA3AF]">Team:</span>
                    <a
                      href="https://github.com/Zone-Xploiter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[#A3FF70] hover:underline font-semibold"
                    >
                      <span>Zone Xploiter</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Version:</span>
                    <span className="text-[#38BDF8]">v1.1.0</span>
                  </div>
                </div>
                <div className="pt-1.5 mt-1.5 border-t border-[#303744] text-[10px] text-center text-[#9CA3AF]">
                  © {new Date().getFullYear()}{' '}
                  <a
                    href="https://github.com/Zone-Xploiter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F5F7FA] hover:text-[#A3FF70] font-bold hover:underline"
                  >
                    NttBell / ZXMarchia - Zone Xploiter
                  </a>
                  .<br />
                  All Rights Reserved.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-3.5 py-2 bg-[#191D24] border-t border-[#303744] flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-3 py-1 rounded bg-[#A3FF70] hover:bg-[#8ee85c] text-[#111318] font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

