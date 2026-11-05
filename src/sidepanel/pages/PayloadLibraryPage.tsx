/**
 * ZX HACKBAR — Security Testing & HTTP Inspection Chrome Extension
 * 
 * @module PayloadLibraryPage
 * @author Zone Xploiter / ZXMarchia
 * @license MIT
 * @description Interactive test vector repository page with category filters, JSON import/export, and direct insertion controls.
 */

import React, { useEffect, useState, useRef } from 'react';
import { PayloadRepository } from '@/storage/repositories/PayloadRepository';
import { PayloadItem } from '@/storage/db';
import { useAppStore } from '@/stores/appStore';
import {
  Search,
  Plus,
  Copy,
  Check,
  Tag,
  Trash2,
  Star,
  Download,
  Upload,
  RotateCcw,
  Edit2,
  Layers,
  Sparkles,
  X,
  Code2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const PayloadLibraryPage: React.FC = () => {
  const [payloads, setPayloads] = useState<PayloadItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PayloadItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryWheel = (e: React.WheelEvent) => {
    if (categoryScrollRef.current && e.deltaY !== 0) {
      categoryScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('SQL Injection');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formFavorite, setFormFavorite] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUrl, url, setCurrentPage, setBodyContent, bodyType, setBodyType } = useAppStore();

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const loadData = async () => {
    await PayloadRepository.seedDefaults();
    const items = await PayloadRepository.getAll();
    setPayloads(items);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Category counts and distinct list
  const categories = [
    'All',
    'SQL Injection',
    'Cross-Site Scripting (XSS)',
    'Path Traversal & LFI',
    'Command Injection (RCE)',
    'SSRF & Cloud Metadata',
    'Template Injection (SSTI)',
    'XML & External Entity (XXE)',
    'Open Redirect & CRLF'
  ];

  // Dynamic category list from items
  const allKnownCategories = Array.from(
    new Set([...categories, ...payloads.map((p) => p.category)])
  );

  const filteredPayloads = payloads.filter((p) => {
    if (showOnlyFavorites && !p.isFavorite) return false;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const favoritesCount = payloads.filter((p) => p.isFavorite).length;

  const handleCopy = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    showToast('Payload copied to clipboard!');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleInsertIntoUrl = (content: string) => {
    setUrl(url + content);
    showToast('Appended to Target URL!');
    setCurrentPage('builder');
  };

  const handleReplaceUrl = (content: string) => {
    setUrl(content);
    showToast('Replaced Target URL!');
    setCurrentPage('builder');
  };

  const handleInsertIntoBody = (content: string) => {
    if (bodyType === 'none') setBodyType('raw');
    setBodyContent(content);
    showToast('Set as Request Body!');
    setCurrentPage('builder');
  };

  const handleToggleFavorite = async (id: number, currentFavorite: boolean) => {
    await PayloadRepository.toggleFavorite(id, currentFavorite);
    setPayloads((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !currentFavorite } : p))
    );
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this test payload?')) {
      await PayloadRepository.delete(id);
      loadData();
      showToast('Payload removed');
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset to standard built-in payload library? Custom additions may be overwritten.')) {
      await PayloadRepository.resetToDefaults();
      loadData();
      showToast('Reset to 31 standard payloads!');
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payloads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `zx_hackbar_payloads_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Payloads exported as JSON!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          const validItems = json.map((item: any) => ({
            title: String(item.title || 'Imported Payload'),
            category: String(item.category || 'Custom'),
            subcategory: item.subcategory ? String(item.subcategory) : undefined,
            content: String(item.content || ''),
            description: item.description ? String(item.description) : '',
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
            isFavorite: Boolean(item.isFavorite),
            createdAt: item.createdAt || Date.now()
          }));
          await PayloadRepository.bulkAdd(validItems);
          loadData();
          showToast(`Successfully imported ${validItems.length} payloads!`);
        } else {
          alert('Invalid JSON format: expected an array of payload items.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenEdit = (item: PayloadItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormSubcategory(item.subcategory || '');
    setFormContent(item.content);
    setFormDescription(item.description || '');
    setFormTags(item.tags.join(', '));
    setFormFavorite(Boolean(item.isFavorite));
    setShowAddForm(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const payloadData = {
      title: formTitle.trim(),
      category: formCategory.trim() || 'Custom',
      subcategory: formSubcategory.trim() || undefined,
      content: formContent,
      description: formDescription.trim(),
      tags: formTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isFavorite: formFavorite
    };

    if (editingItem && editingItem.id) {
      await PayloadRepository.update(editingItem.id, payloadData);
      showToast('Payload updated!');
    } else {
      await PayloadRepository.add({
        ...payloadData,
        createdAt: Date.now()
      });
      showToast('New payload added to library!');
    }

    setEditingItem(null);
    setFormTitle('');
    setFormSubcategory('');
    setFormContent('');
    setFormDescription('');
    setFormTags('');
    setFormFavorite(false);
    setShowAddForm(false);
    loadData();
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'SQL Injection':
        return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
      case 'Cross-Site Scripting (XSS)':
        return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30';
      case 'Path Traversal & LFI':
        return 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30';
      case 'Command Injection (RCE)':
        return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30';
      case 'SSRF & Cloud Metadata':
        return 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/30';
      case 'Template Injection (SSTI)':
        return 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30';
      case 'XML & External Entity (XXE)':
        return 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/30';
      default:
        return 'text-[#A3FF70] bg-[#A3FF70]/10 border-[#A3FF70]/30';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0D1017] text-[#F5F7FA]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-3 right-4 z-50 bg-[#162B1E] border border-[#A3FF70] text-[#A3FF70] text-xs px-3 py-1.5 rounded shadow-2xl flex items-center space-x-2 animate-fadeIn font-mono">
          <Sparkles size={13} />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#12161F] border border-[#252B37] rounded-lg p-3 shadow-md flex flex-col min-[580px]:flex-row items-start min-[580px]:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-[#1A2332] text-[#A3FF70] border border-[#A3FF70]/30">
              <Code2 size={16} />
            </span>
            <h1 className="text-sm font-bold text-[#F5F7FA] tracking-wide">
              Payload & Test Vector Library
            </h1>
          </div>
          <p className="text-[11px] text-[#9CA3AF] mt-1">
            Koleksi vektor pengujian kerentanan web terstruktur dengan injeksi 1-klik ke Builder URL & Body.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setFormTitle('');
              setFormSubcategory('');
              setFormContent('');
              setFormDescription('');
              setFormTags('');
              setFormFavorite(false);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 bg-[#A3FF70] hover:bg-[#B6FF8F] text-[#0A0D13] font-bold rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={13} className="stroke-[3]" />
            <span>Add Payload</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            title="Export all payloads to JSON file"
            className="flex items-center space-x-1 px-2 py-1 bg-[#191F2B] hover:bg-[#252E3E] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#2E384A] rounded text-xs transition-colors cursor-pointer"
          >
            <Download size={12} />
            <span className="hidden min-[480px]:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import payloads from JSON file"
            className="flex items-center space-x-1 px-2 py-1 bg-[#191F2B] hover:bg-[#252E3E] text-[#9CA3AF] hover:text-[#F5F7FA] border border-[#2E384A] rounded text-xs transition-colors cursor-pointer"
          >
            <Upload size={12} />
            <span className="hidden min-[480px]:inline">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reload standard built-in pentest library"
            className="p-1 bg-[#191F2B] hover:bg-[#252E3E] text-[#9CA3AF] hover:text-[#EF4444] border border-[#2E384A] rounded text-xs transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-2 text-xs">
        <div className="bg-[#12161F] border border-[#252B37] rounded p-2 flex items-center justify-between">
          <span className="text-[#9CA3AF] text-[11px]">Total Payloads</span>
          <span className="font-mono font-bold text-[#A3FF70] text-sm">{payloads.length}</span>
        </div>
        <div
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`border rounded p-2 flex items-center justify-between cursor-pointer transition-colors ${
            showOnlyFavorites
              ? 'bg-[#2A2312] border-[#F59E0B] text-[#F59E0B]'
              : 'bg-[#12161F] border-[#252B37] text-[#9CA3AF] hover:border-[#F59E0B]/50'
          }`}
        >
          <span className="text-[11px] flex items-center space-x-1">
            <Star size={11} className={showOnlyFavorites ? 'fill-[#F59E0B]' : ''} />
            <span>Favorites</span>
          </span>
          <span className="font-mono font-bold text-[#F59E0B] text-sm">{favoritesCount}</span>
        </div>
        <div className="bg-[#12161F] border border-[#252B37] rounded p-2 flex items-center justify-between">
          <span className="text-[#9CA3AF] text-[11px]">Categories</span>
          <span className="font-mono font-bold text-[#38BDF8] text-sm">
            {allKnownCategories.length - 1}
          </span>
        </div>
        <div className="bg-[#12161F] border border-[#252B37] rounded p-2 flex items-center justify-between">
          <span className="text-[#9CA3AF] text-[11px]">Filtered</span>
          <span className="font-mono font-bold text-[#F5F7FA] text-sm">{filteredPayloads.length}</span>
        </div>
      </div>

      {/* Add / Edit Form Modal / Card */}
      {showAddForm && (
        <form
          onSubmit={handleSaveForm}
          className="bg-[#161B26] p-3.5 rounded-lg border-2 border-[#A3FF70] space-y-2.5 text-xs shadow-2xl animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#252B37] pb-1.5">
            <span className="font-bold text-[#A3FF70] text-xs flex items-center space-x-1.5">
              <Sparkles size={13} />
              <span>{editingItem ? 'Edit Test Payload' : 'Create Custom Test Payload'}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[#9CA3AF] hover:text-[#EF4444]"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Title & Identifier</label>
            <input
              type="text"
              placeholder="e.g. Classic SQLi Auth Bypass or Stored XSS Probe"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-[#0D1017] border border-[#2E384A] rounded px-2.5 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
              required
            />
          </div>

          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Category</label>
              <input
                type="text"
                placeholder="Category (e.g. SQL Injection, XSS, RCE)"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-[#0D1017] border border-[#2E384A] rounded px-2.5 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Subcategory / Dialect</label>
              <input
                type="text"
                placeholder="Subcategory (e.g. Auth Bypass, Time Based)"
                value={formSubcategory}
                onChange={(e) => setFormSubcategory(e.target.value)}
                className="w-full bg-[#0D1017] border border-[#2E384A] rounded px-2.5 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Payload String</label>
            <textarea
              placeholder="Payload content / injection string..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={3}
              className="w-full bg-[#0D1017] border border-[#2E384A] rounded px-2.5 py-1.5 text-xs font-mono text-[#A3FF70] focus:outline-none focus:border-[#A3FF70]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#9CA3AF]">Description / Purpose</label>
            <input
              type="text"
              placeholder="Detailed explanation of how this vector works..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-[#0D1017] border border-[#2E384A] rounded px-2.5 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Tags (comma-separated, e.g. sqli, rce)"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="bg-[#0D1017] border border-[#2E384A] rounded px-2 py-1 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70] w-48"
              />
              <label className="flex items-center space-x-1 text-xs text-[#9CA3AF] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFavorite}
                  onChange={(e) => setFormFavorite(e.target.checked)}
                  className="rounded border-[#303744] text-[#A3FF70] focus:ring-0"
                />
                <span>Favorite</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-[#9CA3AF] hover:text-[#F5F7FA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#A3FF70] hover:bg-[#B6FF8F] text-[#0A0D13] font-bold rounded shadow-md cursor-pointer transition-colors"
              >
                {editingItem ? 'Save Changes' : 'Create Payload'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Toolbar */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search by title, payload content, tags, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12161F] border border-[#252B37] rounded-md pl-9 pr-8 py-1.5 text-xs text-[#F5F7FA] focus:outline-none focus:border-[#A3FF70] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-[#9CA3AF] hover:text-[#F5F7FA]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Pills Strip with Left/Right Scroll Controls & Wheel Support */}
        <div className="flex items-center space-x-1 w-full min-w-0">
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            title="Scroll categories left"
            className="p-1.5 rounded bg-[#161B26] hover:bg-[#222A3A] text-[#9CA3AF] hover:text-[#A3FF70] border border-[#252B37] hover:border-[#A3FF70]/40 shrink-0 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          >
            <ChevronLeft size={13} className="stroke-[2.5]" />
          </button>

          <div
            ref={categoryScrollRef}
            onWheel={handleCategoryWheel}
            className="flex-1 flex items-center space-x-1.5 overflow-x-auto py-1 px-1 scroll-smooth select-none border border-[#252B37] rounded-lg bg-[#0E121A] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-[#12161F] [&::-webkit-scrollbar-thumb]:bg-[#2E384D] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#A3FF70]/50"
          >
            {allKnownCategories.map((c) => {
              const isSelected = selectedCategory === c && !showOnlyFavorites;
              const count =
                c === 'All'
                  ? payloads.length
                  : payloads.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(c);
                    setShowOnlyFavorites(false);
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#A3FF70] text-[#0A0D13] border-[#A3FF70] shadow-[0_0_8px_rgba(163,255,112,0.3)]'
                      : 'bg-[#161B26] text-[#9CA3AF] hover:text-[#F5F7FA] border-[#252B37] hover:border-[#3E4759]'
                  }`}
                >
                  <span>{c}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-[#0A0D13]/20 text-[#0A0D13]' : 'bg-[#1E2533] text-[#A3FF70]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollCategories('right')}
            title="Scroll categories right"
            className="p-1.5 rounded bg-[#161B26] hover:bg-[#222A3A] text-[#9CA3AF] hover:text-[#A3FF70] border border-[#252B37] hover:border-[#A3FF70]/40 shrink-0 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          >
            <ChevronRight size={13} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Payloads List */}
      <div className="space-y-2">
        {filteredPayloads.length === 0 ? (
          <div className="text-center py-10 bg-[#12161F] border border-[#252B37] rounded-lg p-6 space-y-2">
            <Layers size={28} className="mx-auto text-[#4B5563]" />
            <div className="font-bold text-sm text-[#9CA3AF]">No test payloads found</div>
            <p className="text-xs text-[#6B7280]">
              No payloads matched "{searchTerm}". Try a different search keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setShowOnlyFavorites(false);
              }}
              className="mt-2 px-3 py-1 text-xs bg-[#1A2332] text-[#A3FF70] rounded border border-[#A3FF70]/30 hover:border-[#A3FF70]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredPayloads.map((item) => (
            <div
              key={item.id}
              className="bg-[#12161F] hover:bg-[#151B26] border border-[#252B37] hover:border-[#38455B] rounded-lg p-3 space-y-2 text-xs transition-all shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <button
                    type="button"
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => item.id && handleToggleFavorite(item.id, Boolean(item.isFavorite))}
                    className="cursor-pointer shrink-0"
                  >
                    <Star
                      size={14}
                      className={
                        item.isFavorite
                          ? 'text-[#F59E0B] fill-[#F59E0B]'
                          : 'text-[#4B5563] hover:text-[#F59E0B]'
                      }
                    />
                  </button>
                  <span className="font-bold text-[#F5F7FA] truncate text-xs">{item.title}</span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  {item.subcategory && (
                    <span className="text-[10px] bg-[#1E2533] text-[#38BDF8] px-1.5 py-0.5 rounded border border-[#2E384A] hidden min-[520px]:inline">
                      {item.subcategory}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit payload"
                    className="p-1 text-[#9CA3AF] hover:text-[#38BDF8] transition-colors cursor-pointer"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => item.id && handleDelete(item.id)}
                    title="Delete payload"
                    className="p-1 text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="relative group">
                <div className="bg-[#0A0D13] p-2 rounded border border-[#202633] font-mono text-[11px] text-[#A3FF70] break-all select-all selection:bg-[#A3FF70] selection:text-[#0A0D13] leading-relaxed">
                  {item.content}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-[11px] text-[#9CA3AF] leading-snug">{item.description}</p>
              )}

              {/* Card Footer: Tags & One-Click Inject Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1E2533]">
                {/* Tags */}
                <div className="flex items-center flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSearchTerm(t)}
                      title={`Filter by tag #${t}`}
                      className="text-[10px] text-[#6B7280] hover:text-[#A3FF70] bg-[#161B24] hover:bg-[#1E2533] px-1.5 py-0.5 rounded border border-[#252E3E] flex items-center space-x-0.5 cursor-pointer transition-colors"
                    >
                      <Tag size={9} />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>

                {/* Inject Buttons */}
                <div className="flex items-center space-x-1 shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={() => item.id && handleCopy(item.content, item.id)}
                    title="Copy payload to clipboard"
                    className="px-2 py-0.5 bg-[#19202C] hover:bg-[#252F42] text-[#A3FF70] rounded border border-[#2E3A50] text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                  >
                    {copiedId === item.id ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertIntoUrl(item.content)}
                    title="Append payload to Target URL and switch to Builder"
                    className="px-2 py-0.5 bg-[#19202C] hover:bg-[#252F42] text-[#38BDF8] rounded border border-[#2E3A50] text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                  >
                    <span>+URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReplaceUrl(item.content)}
                    title="Replace entire Target URL with this payload"
                    className="px-2 py-0.5 bg-[#19202C] hover:bg-[#252F42] text-[#F5F7FA] rounded border border-[#2E3A50] text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Set URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertIntoBody(item.content)}
                    title="Set payload as Request Body (POST/PUT data)"
                    className="px-2 py-0.5 bg-[#19202C] hover:bg-[#252F42] text-[#F59E0B] rounded border border-[#2E3A50] text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                  >
                    <span>+Body</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
