import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewSplash: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onPreviewSplash,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already installed (standalone mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Untuk menginstall di browser ini, silakan gunakan menu browser (titik tiga atau tombol Share) lalu pilih "Install App" atau "Add to Home Screen".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/60 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-indigo-500/30 bg-slate-900/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight font-mono">
                Install Progressive Web App (PWA)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Jadikan aplikasi native di Layar Utama HP / PC Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* App Icon & Branding Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-950 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/icon-192.png"
                alt="PokéGO Master Hub App Icon"
                className="w-16 h-16 rounded-2xl border-2 border-indigo-400/60 shadow-lg shadow-indigo-500/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white font-mono tracking-tight">
                    PokéGO Master Hub
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    PWA v2.0
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pokémon GO Companion • Offline Ready • Fast Launch
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onPreviewSplash();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer shrink-0"
              title="Lihat Tampilan Splash Screen Mobile"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Splash</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <div>
            {isInstalled ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Aplikasi ini telah terpasang di perangkat Anda sebagai PWA!</span>
              </div>
            ) : deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(79,70,229,0.45)] transition cursor-pointer flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>Klik Untuk Install ke Layar Utama</span>
              </button>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>Install Aplikasi (Add to Home Screen)</span>
              </button>
            )}
          </div>

          {/* Guides by Platform */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Panduan Cara Install per Perangkat:
            </h4>

            {/* Android / Chrome Guide */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-200 font-mono">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android (Google Chrome / Samsung Internet / Brave):</span>
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 font-mono pl-1">
                <li>Buka situs di Chrome, ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas.</li>
                <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install App"</strong>.</li>
                <li>Konfirmasi pemasangan. Aplikasi akan langsung muncul di menu & home screen HP Anda!</li>
              </ol>
            </div>

            {/* iPhone / iPad Guide */}
            <div className={`p-4 rounded-xl bg-slate-950/80 border ${isIOS ? 'border-cyan-500/50 bg-indigo-950/20' : 'border-slate-800'} space-y-2`}>
              <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 font-mono">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>iPhone / iPad (Apple Safari):</span>
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 font-mono pl-1">
                <li>Buka website ini menggunakan browser <strong>Safari</strong>.</li>
                <li>Ketuk tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah ke atas <Share2 className="w-3 h-3 inline text-cyan-400" />) di bagian bawah.</li>
                <li>Gulir ke bawah dan pilih <strong>"Add to Home Screen" (Tambahkan ke Layar Utama)</strong> <PlusSquare className="w-3 h-3 inline text-cyan-400" />.</li>
                <li>Ketuk <strong>Add</strong> di pojok kanan atas. Aplikasi akan tampil layaknya aplikasi App Store!</li>
              </ol>
            </div>
          </div>

          {/* Benefits of PWA */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 space-y-2">
            <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Keunggulan Menggunakan Mode PWA:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Layar Penuh (Tanpa address bar)
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Akses Cepat dari Home Screen
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Ikon & Splash Screen HD
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Ringan & Sangat Hemat Kuota
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-indigo-500/20 bg-slate-950">
          <button
            onClick={() => {
              onClose();
              onPreviewSplash();
            }}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition cursor-pointer flex items-center gap-1 sm:hidden"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Splash Screen</span>
          </button>
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition cursor-pointer font-mono uppercase tracking-wider shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
