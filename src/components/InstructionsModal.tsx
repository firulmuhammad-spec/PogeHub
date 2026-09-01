import React from 'react';
import { X, Terminal, Rocket, Layers, CheckCircle2, ShieldCheck, Sparkles, Globe } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-indigo-500/30 bg-slate-900/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
                Panduan Menjalankan & Deploy Project
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Instruksi teknis, instalasi dependensi, dan deployment Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          {/* Step 1: Local Setup */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 font-bold text-indigo-400 text-base font-mono">
              <Terminal className="w-4 h-4" /> 1. Cara Menjalankan di Komputer Lokal
            </h3>
            <p className="text-xs text-slate-400">
              Pastikan Anda telah menginstal <strong>Node.js (v18+)</strong> di sistem Anda:
            </p>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/20 font-mono text-xs text-emerald-400 space-y-1.5 overflow-x-auto">
              <div className="text-slate-500"># 1. Clone atau buka direktori project</div>
              <div>cd pokego-master-hub</div>
              <div className="text-slate-500 pt-1"># 2. Install seluruh dependensi</div>
              <div>npm install</div>
              <div className="text-slate-500 pt-1"># 3. Jalankan development server</div>
              <div>npm run dev</div>
              <div className="text-slate-500 pt-1"># 4. Buka di browser: http://localhost:3000 atau http://localhost:5173</div>
            </div>
          </div>

          {/* Step 2: Dependencies Overview */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-bold text-cyan-400 text-base font-mono">
              <Layers className="w-4 h-4" /> 2. Dependensi Utama yang Digunakan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                <div className="font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> React 19 + TypeScript
                </div>
                <div className="text-slate-400 mt-1">Komponen UI interaktif dengan type safety yang kuat.</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                <div className="font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Tailwind CSS
                </div>
                <div className="text-slate-400 mt-1">Styling modern responsive bertema RPG dark gaming.</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                <div className="font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Lucide React
                </div>
                <div className="text-slate-400 mt-1">Ikon visual elemen tipe, kontrol raid, dan koordinat.</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20">
                <div className="font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> PokéAPI Integration
                </div>
                <div className="text-slate-400 mt-1">Fetch live data statistik, artwork, & tipe raid boss.</div>
              </div>
            </div>
          </div>

          {/* Step 3: Vercel Deployment & Database explanation */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-bold text-emerald-400 text-base font-mono">
              <Rocket className="w-4 h-4" /> 3. Panduan Deploy ke Vercel & Penjelasan Database
            </h3>
            
            {/* Database Note */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/30 text-xs space-y-1">
              <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Apakah Perlu Database / Firebase?
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>Tidak perlu setup database eksternal atau Firebase!</strong> Aplikasi ini dirancang sebagai <em>Privacy-First Static Client App</em>. Data inventaris (Hundo/Shiny), koordinat kustom, dan preferensi tersimpan secara aman & instan di <strong>Browser LocalStorage</strong> masing-masing pengguna. Anda tidak perlu repot konfigurasi API key database apa pun di Vercel.
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Aplikasi ini adalah Single Page Application (SPA) berbasis Vite yang 100% siap langsung dideploy:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-1 font-mono">
              <li>Push kode Anda ke repository <strong>GitHub / GitLab</strong> Anda.</li>
              <li>Buka dashboard <strong>Vercel.com</strong> & klik <em>Add New Project</em>.</li>
              <li>Pilih repository tersebut. Vercel akan otomatis mendeteksi Framework Preset: <strong>Vite</strong>.</li>
              <li>Build Command: <code className="px-1.5 py-0.5 bg-slate-800 text-indigo-300 rounded font-mono">npm run build</code></li>
              <li>Output Directory: <code className="px-1.5 py-0.5 bg-slate-800 text-cyan-300 rounded font-mono">dist</code></li>
              <li>Klik <strong>Deploy</strong>. Aplikasi Anda langsung online dalam hitungan detik tanpa perlu konfigurasi tambahan!</li>
            </ol>
          </div>

          {/* Key Features Overview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/20 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ringkasan Fitur Unggulan
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-1.5">⚡ Multiplier Elemen PoGO (x2.56, x1.6, x0.625, x0.39)</li>
              <li className="flex items-center gap-1.5">💾 Storage Hundo (IV 100%) & Shiny dengan LocalStorage</li>
              <li className="flex items-center gap-1.5">⚔️ Counter Raid Boss + Suggestion Dropdown + Match Inventory</li>
              <li className="flex items-center gap-1.5">🌐 Live World Clocks + Event Converter (WIB) + Cooldown Timer</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-indigo-500/20 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.35)] font-mono uppercase tracking-wider"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
