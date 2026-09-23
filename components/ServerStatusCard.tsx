'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Power, 
  RotateCw, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Terminal, 
  CheckCircle,
  Copy,
  AlertTriangle,
  Server,
  Cloud
} from 'lucide-react';
import { ServerMetrics, ServerState } from '@/types/bot';

interface ServerStatusCardProps {
  serverState: ServerState;
  metrics: ServerMetrics;
  onControlServer: (action: 'start' | 'stop' | 'restart') => void;
  onNavigateToTab: (tab: string) => void;
}

export const ServerStatusCard: React.FC<ServerStatusCardProps> = ({
  serverState,
  metrics,
  onControlServer,
  onNavigateToTab
}) => {
  const [autoReboot, setAutoReboot] = useState(true);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const formatUptimeFull = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d} Hari, ${h} Jam, ${m} Menit, ${s} Detik`;
  };

  const copyWebhookUrl = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/api/bot/server`;
      navigator.clipboard.writeText(url);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Main Grid: Server Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Core Engine State */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                serverState === 'running' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10' :
                serverState === 'restarting' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Master Bot Engine 24 Jam</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    serverState === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    serverState === 'restarting' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {serverState === 'running' ? '● Aktif 24/7' : serverState === 'restarting' ? '○ Restarting' : '■ Offline'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Engine: Baileys v6.7.12 • Node.js v20 • Multi-Device Active
                </p>
              </div>
            </div>

            {/* Server Controls */}
            <div className="flex items-center gap-2">
              {serverState === 'running' ? (
                <>
                  <button
                    onClick={() => onControlServer('restart')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Restart Daemon</span>
                  </button>
                  <button
                    onClick={() => onControlServer('stop')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-all active:scale-95"
                  >
                    <Power className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop Server</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onControlServer('start')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  <Power className="w-3.5 h-3.5 text-slate-950" />
                  <span>Nyalakan Server</span>
                </button>
              )}
            </div>
          </div>

          {/* Metric Stats Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            {/* CPU */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CPU Usage</span>
                </span>
                <span className="text-slate-200 font-bold">{metrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${metrics.cpuUsage > 80 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                  style={{ width: `${Math.min(100, metrics.cpuUsage * 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">4 Virtual Cores</span>
            </div>

            {/* RAM */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RAM Heap</span>
                </span>
                <span className="text-slate-200 font-bold">{metrics.memoryUsedMB} MB</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${(metrics.memoryUsedMB / metrics.memoryTotalMB) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Maks: 512 MB Node.js</span>
            </div>

            {/* PING */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Latency</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">{metrics.pingMs} ms</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Ultra-Fast Response</span>
              </div>
            </div>

            {/* TOTAL MESSAGES */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pesan Diolah</span>
                </span>
                <span className="text-slate-200 font-bold">{metrics.totalMessagesProcessed.toLocaleString('id-ID')}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {metrics.totalCommandsExecuted.toLocaleString('id-ID')} Perintah Sukses
              </span>
            </div>

          </div>

          {/* Uptime Full Bar */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Durasi Server Berjalan:</span>
              <strong className="text-white font-mono">{formatUptimeFull(metrics.uptimeSeconds)}</strong>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Dimulai sejak:</span>
              <span className="text-slate-300 font-mono">{new Date(metrics.startedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Card 2: 24-Hour Keep-Alive & Auto-Reboot Configuration */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Konfigurasi 24 Jam Non-Stop</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Fitur otomatis untuk memastikan bot tidak tidur/mati saat ditinggal.
            </p>

            <div className="mt-4 space-y-3">
              {/* Auto reboot toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Auto-Heal & Auto-Restart</span>
                  <span className="text-[10px] text-slate-400">Otomatis restart jika koneksi drop</span>
                </div>
                <button
                  onClick={() => setAutoReboot(!autoReboot)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    autoReboot ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoReboot ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Keep-alive URL */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-slate-200 block mb-1">
                  Webhook Ping Keep-Alive (UptimeRobot / Cron)
                </span>
                <p className="text-[10px] text-slate-400 mb-2">
                  Dapat dipasang pada UptimeRobot / Cron-job.org untuk ping gratis tiap 5 menit agar server aktif 24 jam.
                </p>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}/api/bot/server` : '/api/bot/server'}
                    className="w-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 px-2 py-1.5 rounded-lg select-all"
                  />
                  <button
                    onClick={copyWebhookUrl}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex-shrink-0"
                    title="Salin Webhook URL"
                  >
                    {copiedWebhook ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('jadibot')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Buka Menu JadiBot (Pairing & Barcode)</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>

    </div>
  );
};
