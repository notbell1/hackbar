import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Header } from './components/Header';
import { TargetBar } from './components/TargetBar';
import { RequestBuilder } from './pages/RequestBuilder';
import { UrlParserPage } from './pages/UrlParserPage';
import { EncoderPage } from './pages/EncoderPage';
import { SecurityHeadersPage } from './pages/SecurityHeadersPage';
import { PayloadLibraryPage } from './pages/PayloadLibraryPage';
import { HistoryPage } from './pages/HistoryPage';
import { ScopeManagerPage } from './pages/ScopeManagerPage';
import { SettingsPage } from './pages/SettingsPage';
import { PayloadRepository } from '@/storage/repositories/PayloadRepository';
import { ScopeRepository } from '@/storage/repositories/ScopeRepository';

export const App: React.FC = () => {
  const { currentPage, setUrl } = useAppStore();

  useEffect(() => {
    // Initialize default payloads and default allowlist on first start
    const initApp = async () => {
      await PayloadRepository.seedDefaults();

      // Seed httpbin & example scopes by default so users can immediately test
      const existingScopes = await ScopeRepository.getAll();
      if (existingScopes.length === 0) {
        await ScopeRepository.add({
          origin: 'https://httpbin.org',
          hostPattern: 'httpbin.org',
          enabled: true,
          allowLocalhost: false,
          notes: 'Default public testing endpoint',
          createdAt: Date.now()
        });
      }

      // Check if background service worker stored a pending URL from context menu
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('pendingTargetUrl', (res) => {
          if (res.pendingTargetUrl) {
            setUrl(res.pendingTargetUrl);
            chrome.storage.local.remove('pendingTargetUrl');
          }
        });
      }
    };

    initApp();
  }, [setUrl]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#111318] text-[#F5F7FA]">
      <Header />
      <TargetBar />

      <main className="flex-1 flex flex-col min-h-0">
        {currentPage === 'builder' && <RequestBuilder />}
        {currentPage === 'parser' && <UrlParserPage />}
        {currentPage === 'encoder' && <EncoderPage />}
        {currentPage === 'security' && <SecurityHeadersPage />}
        {currentPage === 'payloads' && <PayloadLibraryPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'scope' && <ScopeManagerPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

