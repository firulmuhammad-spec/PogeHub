import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { TypeCalculator } from './components/TypeEffectiveness/TypeCalculator';
import { StorageManager } from './components/StorageChecklist/StorageManager';
import { RaidBossCounters } from './components/RaidBoss/RaidBossCounters';
import { CoordinateTimeHub } from './components/CoordinateTime/CoordinateTimeHub';
import { InstructionsModal } from './components/InstructionsModal';
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
} from 'lucide-react';

const STORAGE_KEY = 'pokego_master_storage_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('types');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden" style={{ backgroundColor: '#020617' }}>
      {/* Immersive HUD Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      {/* Top Navigation Bar with Immersive UI Styling */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storageStats={storageStats}
        onOpenHelp={() => setIsHelpOpen(true)}
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

      {/* Immersive HUD Bottom Status Bar */}
      <footer className="w-full bg-slate-950/90 backdrop-blur-md border-t border-indigo-500/20 py-3 text-[10px] text-slate-500 font-mono z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-slate-300 font-bold tracking-tight uppercase">STATUS: ONLINE</span>
            </div>
            <span className="text-slate-800">|</span>
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>POKEAPI: <span className="text-emerald-400 font-bold">CONNECTED</span></span>
            </div>
            <span className="text-slate-800">|</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>STORAGE: <span className="text-indigo-300 font-bold">LOCAL_SYNCED</span></span>
            </div>
            <span className="text-slate-800">|</span>
            <div className="flex items-center gap-1">
              <span>LATENCY: <span className="text-emerald-400 font-bold">24MS</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-indigo-400 text-slate-400 transition cursor-pointer flex items-center gap-1.5 uppercase font-bold tracking-wider hover:underline"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Guide & Vercel Deploy
            </button>
            <span className="text-slate-800">|</span>
            <span className="text-slate-500 uppercase tracking-widest">EST. 2024 POKÉDASH HUD</span>
          </div>
        </div>
      </footer>

      {/* Panduan & Deployment Modal */}
      <InstructionsModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
