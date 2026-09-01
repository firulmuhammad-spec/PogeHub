import React from 'react';
import {
  Zap,
  PackageCheck,
  Swords,
  Globe,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Flame,
  Activity,
  Terminal,
  Smartphone,
  Download,
} from 'lucide-react';

export type ActiveTab = 'types' | 'storage' | 'raids' | 'coordinates';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  storageStats: {
    total: number;
    hundos: number;
    shinies: number;
    shundos: number;
  };
  onOpenHelp: () => void;
  onOpenInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  storageStats,
  onOpenHelp,
  onOpenInstallPwa,
}) => {
  const navTabs = [
    {
      id: 'types' as ActiveTab,
      label: 'Type Calculator',
      sublabel: 'Element Matrix',
      shortName: 'Type Chart',
      icon: Zap,
    },
    {
      id: 'storage' as ActiveTab,
      label: 'Storage Checklist',
      sublabel: 'Hundo & Shiny',
      shortName: 'Storage',
      icon: PackageCheck,
    },
    {
      id: 'raids' as ActiveTab,
      label: 'Raid Boss Counter',
      sublabel: 'PokéAPI Live',
      shortName: 'Raid Hub',
      icon: Swords,
    },
    {
      id: 'coordinates' as ActiveTab,
      label: 'World Coordinates',
      sublabel: 'Global WIB Clocks',
      shortName: 'World Time',
      icon: Globe,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 border-b border-indigo-500/30 backdrop-blur-md shadow-2xl shadow-indigo-950/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding with glowing Indigo orb */}
          <div className="flex items-center gap-3">
            <div
              className="relative group cursor-pointer"
              onClick={() => setActiveTab('types')}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(79,70,229,0.55)] border border-indigo-400/40 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tighter text-indigo-400 font-mono flex items-center gap-1.5">
                  <span>POKÉDASH</span>
                  <span className="text-slate-400 font-normal text-xs sm:text-sm">v2.0</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 tracking-wider">
                  HUD SYSTEM
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block truncate font-mono">
                Real-Time Battle Engine & Storage Hub
              </p>
            </div>
          </div>

          {/* Trainer HUD Pill & Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Trainer Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700/80 shadow-inner">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]"></div>
              <span className="text-xs font-mono uppercase tracking-tighter text-slate-300 font-semibold">Trainer_Red</span>
            </div>

            {/* Quick Storage Stats */}
            <button
              onClick={() => setActiveTab('storage')}
              className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 transition cursor-pointer text-xs"
              title="Open Storage Checklist"
            >
              <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                <span className="text-[11px] px-1 bg-amber-500 text-slate-950 rounded font-black">IV 100</span>
                <span>{storageStats.hundos}</span>
              </div>
              <div className="w-px h-3.5 bg-slate-800"></div>
              <div className="flex items-center gap-1 text-cyan-300 font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{storageStats.shinies} ✨</span>
              </div>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={onOpenInstallPwa}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(79,70,229,0.5)] transition cursor-pointer font-mono uppercase tracking-wider"
              title="Install aplikasi ke HP / Komputer (PWA)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">INSTALL APP</span>
              <span className="sm:hidden text-[10px]">PWA</span>
            </button>

            {/* Help / Guide Trigger */}
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-indigo-300 transition cursor-pointer font-mono"
              title="Panduan menjalankan & deploy"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">GUIDE</span>
            </button>
          </div>
        </div>

        {/* Cyber Tab Navigation Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1.5 -mb-px border-t border-indigo-500/20">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] sm:min-w-[160px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer relative group ${
                  isActive
                    ? 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-950/50'
                    : 'hover:bg-slate-900/60 border border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.2} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs sm:text-sm font-bold tracking-tight uppercase truncate ${
                        isActive ? 'text-indigo-300 font-mono' : 'text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="truncate">{tab.sublabel}</span>
                  </div>
                </div>

                {/* Active cyber glowing bottom indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
