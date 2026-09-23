'use client';

import React from 'react';
import { 
  Bot, 
  Wifi, 
  Cpu, 
  Terminal, 
  FolderTree, 
  Smartphone, 
  QrCode, 
  ShoppingBag, 
  BookOpen, 
  Sparkles, 
  Zap, 
  Activity,
  Globe
} from 'lucide-react';
import { ServerMetrics, ServerState } from '@/types/bot';

interface NavbarProps {
  serverState: ServerState;
  metrics: ServerMetrics;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPairingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverState,
  metrics,
  activeTab,
  setActiveTab,
  onOpenPairingModal
}) => {
  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}h ${h}j ${m}m`;
    if (h > 0) return `${h}j ${m}m`;
    return `${m}m`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Server & Status', icon: Activity },
    { id: 'portal', label: 'Web Pairing & QR Scanner', icon: Globe, badge: 'Vercel/Netlify' },
    { id: 'jadibot', label: 'JadiBot Hub', icon: QrCode, badge: 'Hot' },
    { id: 'simulator', label: 'Chat Simulator', icon: Smartphone },
    { id: 'files', label: 'Script & Files', icon: FolderTree },
    { id: 'terminal', label: 'Live Logs', icon: Terminal },
    { id: 'store', label: 'Sewa & QRIS', icon: ShoppingBag },
    { id: 'hosting', label: 'Panduan Deploy', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  Florence WA Bot
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  HF166 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Server Multi-Device & JadiBot Hub
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${
                serverState === 'running' ? 'bg-emerald-500 animate-pulse' : 
                serverState === 'restarting' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'
              }`} />
              <span className="text-slate-300 font-medium">
                {serverState === 'running' ? 'Online 24 Jam' : serverState === 'restarting' ? 'Restarting...' : 'Stopped'}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-mono font-semibold">{metrics.pingMs}ms</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Uptime:</span>
              <span className="text-slate-100 font-mono font-semibold">{formatUptime(metrics.uptimeSeconds)}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>JadiBot:</span>
              <span className="text-cyan-400 font-semibold">{metrics.activeJadiBots} Aktif</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenPairingModal}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-300 shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <QrCode className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Buka JadiBot</span>
              <span className="hidden sm:inline text-[11px] px-1.5 py-0.5 rounded bg-emerald-950/20 text-emerald-950 font-bold uppercase tracking-wider">
                Pairing
              </span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
