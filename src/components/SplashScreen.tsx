import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
  isManualPreview?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onDismiss,
  isManualPreview = false,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [fading, setFading] = useState<boolean>(false);

  useEffect(() => {
    // If not manual preview, simulate progressive boot loading and auto dismiss
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!isManualPreview) {
            setTimeout(() => {
              setFading(true);
              setTimeout(onDismiss, 400);
            }, 300);
          }
          return 100;
        }
        return prev + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isManualPreview, onDismiss]);

  const handleClose = () => {
    setFading(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-slate-950 text-slate-100 select-none cursor-pointer transition-opacity duration-400 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(79, 70, 229, 0.25) 0%, rgba(2, 6, 23, 0.95) 75%), url('/splash-screen.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top HUD Badge */}
      <div className="w-full flex items-center justify-between pt-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-indigo-500/40 text-[11px] font-mono text-indigo-300 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>POKÉDASH HUD v2.0</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[10px] font-mono text-slate-400 backdrop-blur-md">
          <span>PWA READY</span>
        </div>
      </div>

      {/* Center Hero Emblem & Branding */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm my-auto">
        {/* Glowing Icon Frame */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 animate-pulse transition duration-1000"></div>
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-indigo-400/80 shadow-2xl bg-slate-900 flex items-center justify-center">
            <img
              src="/icon-512.png"
              alt="PokéGO Master Hub App Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
            POKÉGO MASTER HUB
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 font-mono tracking-wider">
            Companion & Battle Engine Pokémon GO
          </p>
        </div>

        {/* Cyber Loading Indicator */}
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Inisialisasi Sistem...</span>
            </span>
            <span className="text-indigo-300 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900/90 rounded-full border border-indigo-500/30 overflow-hidden backdrop-blur">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-200 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Dismiss Prompt */}
      <div className="w-full pb-4 text-center">
        <button
          onClick={handleClose}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900/80 hover:bg-indigo-600 border border-indigo-500/40 text-slate-200 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all backdrop-blur-md shadow-lg group cursor-pointer"
        >
          <span>Masuk ke Aplikasi</span>
          <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
