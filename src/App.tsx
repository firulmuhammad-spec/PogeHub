import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { TypeCalculator } from './components/TypeEffectiveness/TypeCalculator';
import { StorageManager } from './components/StorageChecklist/StorageManager';
import { RaidBossCounters } from './components/RaidBoss/RaidBossCounters';
import { CoordinateTimeHub } from './components/CoordinateTime/CoordinateTimeHub';
import { InstructionsModal } from './components/InstructionsModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { SplashScreen } from './components/SplashScreen';
import {
  Zap,
  PackageCheck,
  Swords,
  Globe,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Terminal,
  Activity,
  Cpu,
  Smartphone,
} from 'lucide-react';

const STORAGE_KEY = 'pokego_master_storage_v1';
const SPLASH_SEEN_KEY = 'pokego_splash_seen_session';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('types');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  
  // Initial splash screen check
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first load per session
    try {
      const seen = sessionStorage.getItem(SPLASH_SEEN_KEY);
      if (!seen) {
        sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
        return true;
      }
    } catch {
      // fallback
    }
    return false;
  });

  const [isManualSplashPreview, setIsManualSplashPreview] = useState(false);

  // Storage Stats for quick Navbar display
  const [storageStats, setStorageStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hundos = parsed.filter((i: any) => i.isHundo).length;
          const shinies = parsed.filter((i: any) => i.isShiny).length;
          const shundos = parsed.filter((i: any) => i.isHundo && i.isShiny).length;
          return { total: parsed.length, hundos, shinies, shundos };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { total: 6, hundos: 5, shinies: 4, shundos: 3 };
  });

  const handleUpdateStats = useCallback(
    (stats: { total: number; hundos: number; shinies: number; shundos: number }) => {
      setStorageStats((prev) => {
        if (
          prev.total === stats.total &&
          prev.hundos === stats.hundos &&
          prev.shinies === stats.shinies &&
          prev.shundos === stats.shundos
        ) {
          return prev;
        }
        return stats;
      });
    },
    []
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden transition-colors">
      {/* High Quality Splash Screen Component */}
      {(showSplash || isManualSplashPreview) && (
        <SplashScreen
          onDismiss={() => {
            setShowSplash(false);
            setIsManualSplashPreview(false);
          }}
          isManualPreview={isManualSplashPreview}
        />
      )}

      {/* Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/5 dark:bg-teal-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-sky-500/5 dark:bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      {/* Top Navigation Bar with Pokémon GO Theme */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storageStats={storageStats}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstallPwa={() => setIsPwaModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'types' && <TypeCalculator />}
        {activeTab === 'storage' && (
          <StorageManager onUpdateStats={handleUpdateStats} />
        )}
        {activeTab === 'raids' && <RaidBossCounters />}
        {activeTab === 'coordinates' && <CoordinateTimeHub />}
      </main>

      {/* Clean Bottom Status Bar */}
      <footer className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3.5 text-xs text-slate-600 dark:text-slate-400 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-800 dark:text-slate-200 font-bold tracking-tight">STATUS: ONLINE</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>PokéAPI: <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Terkoneksi</span></span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Storage: <span className="text-slate-800 dark:text-slate-200 font-semibold">Tersimpan Lokal</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-400 transition cursor-pointer flex items-center gap-1.5 font-semibold hover:underline"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Install PWA
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-400 transition cursor-pointer flex items-center gap-1.5 font-semibold hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Panduan
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400">PokéGO Master Hub</span>
          </div>
        </div>
      </footer>

      {/* PWA Install Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        onPreviewSplash={() => setIsManualSplashPreview(true)}
      />

      {/* Panduan & Deployment Modal */}
      <InstructionsModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
