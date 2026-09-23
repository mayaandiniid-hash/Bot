'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ServerStatusCard } from '@/components/ServerStatusCard';
import { JadiBotHub } from '@/components/JadiBotHub';
import { WhatsAppSimulator } from '@/components/WhatsAppSimulator';
import { FileManager } from '@/components/FileManager';
import { LiveLogTerminal } from '@/components/LiveLogTerminal';
import { StoreQrisSimulator } from '@/components/StoreQrisSimulator';
import { DeploymentGuide } from '@/components/DeploymentGuide';
import { PairingCodeModal } from '@/components/PairingCodeModal';
import { WebPairingPortal } from '@/components/WebPairingPortal';
import { 
  INITIAL_JADIBOTS, 
  INITIAL_LOGS 
} from '@/lib/bot-data';
import { JadiBotSession, LogEntry, ServerMetrics, ServerState } from '@/types/bot';
import { 
  Bot, 
  QrCode, 
  KeyRound, 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  Zap, 
  FolderTree, 
  Terminal, 
  ShoppingBag, 
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe
} from 'lucide-react';

const INITIAL_SERVER_STARTED_AT = new Date(1774200000000).toISOString();

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  
  // Server state & metrics
  const [serverState, setServerState] = useState<ServerState>('running');
  const [metrics, setMetrics] = useState<ServerMetrics>({
    uptimeSeconds: 174820,
    cpuUsage: 18,
    memoryUsedMB: 214,
    memoryTotalMB: 512,
    pingMs: 28,
    totalMessagesProcessed: 28450,
    totalCommandsExecuted: 12930,
    activeJadiBots: 3,
    totalGroups: 42,
    startedAt: INITIAL_SERVER_STARTED_AT
  });

  // Sessions and Logs
  const [sessions, setSessions] = useState<JadiBotSession[]>(INITIAL_JADIBOTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // Poll server state & metrics periodically
  useEffect(() => {
    const fetchServer = async () => {
      try {
        const res = await fetch('/api/bot/server');
        const json = await res.json();
        if (json.status === 'success' && json.metrics) {
          setMetrics((prev) => ({
            ...prev,
            ...json.metrics,
            activeJadiBots: sessions.length
          }));
          setServerState(json.serverState);
        }
      } catch (e) {
        // Fallback local metrics increment
      }
    };

    fetchServer();
    const interval = setInterval(fetchServer, 5000);
    return () => clearInterval(interval);
  }, [sessions.length]);

  // Local ticker for uptime & periodic background logs
  useEffect(() => {
    const tickInterval = setInterval(() => {
      if (serverState === 'running') {
        setMetrics((prev) => ({
          ...prev,
          uptimeSeconds: prev.uptimeSeconds + 1,
          totalMessagesProcessed: prev.totalMessagesProcessed + Math.floor(Math.random() * 2),
          pingMs: Math.floor(22 + Math.random() * 12)
        }));
      }
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [serverState]);

  // Random simulated log generator
  useEffect(() => {
    const logTimer = setInterval(() => {
      if (serverState === 'running') {
        const sampleLogs: Omit<LogEntry, 'id' | 'timestamp'>[] = [
          { level: 'baileys', tag: 'BAILEYS', message: 'Received presence update from group [ID: 120363024@g.us]' },
          { level: 'jadibot', tag: 'JADIBOT', message: 'Heartbeat check: 3 active sub-bot connections verified healthy.' },
          { level: 'command', tag: 'COMMAND', message: 'Incoming query [.ai] handled in 234ms via Gemini Ultra-Speed.' },
          { level: 'info', tag: 'SERVER', message: 'Auto garbage collector freed 14MB buffer memory.' },
          { level: 'success', tag: 'HEALTH', message: '24/7 Daemon heartbeat OK. No socket exceptions detected.' }
        ];

        const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        const newEntry: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          ...randomLog
        };

        setLogs((prev) => [...prev.slice(-150), newEntry]);
      }
    }, 14000);

    return () => clearInterval(logTimer);
  }, [serverState]);

  const handleControlServer = async (action: 'start' | 'stop' | 'restart') => {
    try {
      const res = await fetch('/api/bot/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setServerState(json.serverState);
        addCustomLog('info', 'DAEMON', `Server control action [${action.toUpperCase()}] executed.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addCustomLog = (level: LogEntry['level'], tag: string, message: string) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      level,
      tag,
      message
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleAddSession = (newBot: JadiBotSession) => {
    setSessions((prev) => [newBot, ...prev]);
    addCustomLog('success', 'JADIBOT', `Sesi JadiBot baru [${newBot.phoneNumber}] berhasil terhubung dan aktif 24 jam!`);
  };

  const handleRemoveSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      addCustomLog('warn', 'JADIBOT', `Sesi JadiBot [${target.phoneNumber}] diputuskan / logout.`);
    }
  };

  const handleRestartSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (target) {
      addCustomLog('info', 'JADIBOT', `Menyinkronkan ulang sesi JadiBot [${target.phoneNumber}]... Selesai.`);
    }
  };

  const handleSendTestMessage = (phone: string) => {
    addCustomLog('command', 'TEST_MSG', `Pesan broadcast uji coba terkirim ke nomor [${phone}]`);
    alert(`Pesan uji coba berhasil dikirim ke nomor WhatsApp +${phone}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navbar */}
      <Navbar
        serverState={serverState}
        metrics={metrics}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPairingModal={() => setIsPairingModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: DASHBOARD & SERVER 24H */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Florence AI • WhatsApp Bot Server 24 Jam Non-Stop</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Hosting & Manajemen Server Bot WhatsApp dengan Fitur Open JadiBot
                </h1>
                
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Jalankan script bot WhatsApp Anda di cloud server 24 jam penuh secara otomatis. 
                  Pengguna dapat langsung memasukkan nomor untuk mendapatkan 
                  <span className="text-emerald-400 font-semibold"> Kode Pairing (8-Digit)</span> atau 
                  <span className="text-emerald-400 font-semibold"> Scan Barcode QR</span> untuk terhubung sebagai JadiBot secara instan.
                </p>

                {/* Hero Action CTA Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('portal')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Globe className="w-4 h-4 text-slate-950" />
                    <span>Buka Web Pairing & Scanner Portal</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>

                  <button
                    onClick={() => setActiveTab('jadibot')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
                  >
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Minta Kode 8-Digit</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Chat Simulator WA</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Server Status Monitor Card */}
            <ServerStatusCard
              serverState={serverState}
              metrics={metrics}
              onControlServer={handleControlServer}
              onNavigateToTab={setActiveTab}
            />

            {/* Quick 4-Column Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Box 1: Web Portal */}
              <div 
                onClick={() => setActiveTab('portal')}
                className="group cursor-pointer rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 transition-all shadow-lg flex flex-col justify-between ring-1 ring-emerald-500/20"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    Web Pairing & QR Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Halaman publik untuk meminta 8 digit kode pairing atau scan QR kamera langsung di browser.
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span>Buka Web Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              {/* Box 2: Open JadiBot */}
              <div 
                onClick={() => setActiveTab('jadibot')}
                className="group cursor-pointer rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-5 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    Kelola Sesi JadiBot 24 Jam
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Daftar bot aktif, pantau baterai, kuota token, pesan terkirim, dan auto-reboot.
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  <span>Lihat {sessions.length} Sesi Aktif</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              {/* Box 3: Script & File Manager */}
              <div 
                onClick={() => setActiveTab('files')}
                className="group cursor-pointer rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-5 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Upload & Edit Script Bot
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Jelajahi struktur file bot (commands, lib, database), edit script, dan upload plugin baru.
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-purple-400 flex items-center gap-1">
                  <span>Kelola Script</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              {/* Box 4: Vercel / Netlify / VPS Guide */}
              <div 
                onClick={() => setActiveTab('hosting')}
                className="group cursor-pointer rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-5 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    Deploy Vercel, Netlify & VPS
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Panduan 1-klik deploy website ke Vercel/Netlify dan background server 24 jam dengan PM2.
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <span>Panduan Deploy</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

            </div>

          </div>
        )}

        {/* TAB: WEB PAIRING & QR SCANNER PORTAL */}
        {activeTab === 'portal' && (
          <WebPairingPortal
            onSuccessPaired={handleAddSession}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* TAB 2: JADIBOT HUB */}
        {activeTab === 'jadibot' && (
          <JadiBotHub
            sessions={sessions}
            onAddSession={handleAddSession}
            onRemoveSession={handleRemoveSession}
            onRestartSession={handleRestartSession}
            onSendTestMessage={handleSendTestMessage}
          />
        )}

        {/* TAB 3: WHATSAPP CHAT SIMULATOR */}
        {activeTab === 'simulator' && (
          <WhatsAppSimulator
            onOpenPairingModal={() => setIsPairingModalOpen(true)}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* TAB 4: SCRIPT & FILE MANAGER */}
        {activeTab === 'files' && (
          <FileManager onTriggerLog={addCustomLog} />
        )}

        {/* TAB 5: LIVE LOG TERMINAL */}
        {activeTab === 'terminal' && (
          <LiveLogTerminal
            logs={logs}
            onClearLogs={() => setLogs([])}
            onAddSimulatedLog={() => addCustomLog('command', 'INBOUND', 'Pengguna @6285812349876 meminta [.jadibot] via chat WhatsApp.')}
          />
        )}

        {/* TAB 6: STORE & QRIS */}
        {activeTab === 'store' && (
          <StoreQrisSimulator />
        )}

        {/* TAB 7: 24/7 HOSTING & DEPLOYMENT GUIDE */}
        {activeTab === 'hosting' && (
          <DeploymentGuide />
        )}

      </main>

      {/* Global Quick Pairing Code Modal */}
      <PairingCodeModal
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
        onSuccessPaired={(phone) => {
          const newBot: JadiBotSession = {
            id: `jb-${Date.now()}`,
            phoneNumber: phone,
            pushName: `Bot ${phone}`,
            status: 'connected',
            connectedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
            batteryLevel: 90,
            isCharging: true,
            platform: 'Android',
            messagesSent: 0,
            limitQuota: 1000,
            tokenBalance: 250,
            planType: 'Sewa 30 Hari',
            autoReboot: true,
            lastActive: 'Baru saja'
          };
          handleAddSession(newBot);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">Florence AI WA Bot Server Hub v2.9</span>
            <span>—</span>
            <span>Aktif 24 Jam Non-Stop</span>
          </div>
          <p className="text-slate-400">
            Dukungan Baileys Multi-Device, Pairing Code OTP 8-Digit, Scan Barcode QR, dan Auto-Reconnect Daemon.
          </p>
        </div>
      </footer>

    </div>
  );
}
