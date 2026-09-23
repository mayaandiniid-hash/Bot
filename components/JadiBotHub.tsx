'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  KeyRound, 
  Smartphone, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  BatteryCharging, 
  Battery, 
  Activity, 
  Plus, 
  Power, 
  Trash2, 
  Send, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JadiBotSession, PairingRequest } from '@/types/bot';
import { cleanPhoneNumber, formatPhoneNumber } from '@/lib/bot-data';

interface JadiBotHubProps {
  sessions: JadiBotSession[];
  onAddSession: (newSession: JadiBotSession) => void;
  onRemoveSession: (id: string) => void;
  onRestartSession: (id: string) => void;
  onSendTestMessage: (phone: string) => void;
  activeModeTab?: 'pairing' | 'qr' | 'list';
}

export const JadiBotHub: React.FC<JadiBotHubProps> = ({
  sessions,
  onAddSession,
  onRemoveSession,
  onRestartSession,
  onSendTestMessage,
  activeModeTab = 'pairing'
}) => {
  const [activeTab, setActiveTab] = useState<'pairing' | 'qr' | 'list'>(activeModeTab || 'pairing');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pushName, setPushName] = useState('');
  const [countryCode, setCountryCode] = useState('62');
  const [isLoading, setIsLoading] = useState(false);
  const [pairingData, setPairingData] = useState<PairingRequest | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [authStep, setAuthStep] = useState<'idle' | 'generating' | 'waiting' | 'authenticating' | 'connected'>('idle');
  const [simulatedDevice, setSimulatedDevice] = useState<'Android' | 'iOS' | 'Web'>('Android');

  // Timer countdown for pairing / QR code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pairingData && timeLeft > 0 && authStep === 'waiting') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pairingData, timeLeft, authStep]);

  // Simulated authentication flow when code is shown
  useEffect(() => {
    let timeoutAuth: NodeJS.Timeout;
    let timeoutSuccess: NodeJS.Timeout;

    if (pairingData && authStep === 'waiting') {
      // After 10s of user seeing the code, simulate WA phone connecting
      timeoutAuth = setTimeout(() => {
        setAuthStep('authenticating');
        
        timeoutSuccess = setTimeout(() => {
          setAuthStep('connected');
          
          // Trigger confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if canvas confetti not available
          }

          // Add to active sessions
          const newBot: JadiBotSession = {
            id: `jb-${Date.now()}`,
            phoneNumber: pairingData.phoneNumber,
            pushName: pushName.trim() || `Bot ${formatPhoneNumber(pairingData.phoneNumber)}`,
            status: 'connected',
            connectedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
            batteryLevel: Math.floor(75 + Math.random() * 25),
            isCharging: true,
            platform: simulatedDevice,
            messagesSent: 0,
            limitQuota: 1000,
            tokenBalance: 250,
            planType: 'Sewa 30 Hari',
            autoReboot: true,
            lastActive: 'Baru saja'
          };
          onAddSession(newBot);
        }, 3500);
      }, 12000);
    }

    return () => {
      clearTimeout(timeoutAuth);
      clearTimeout(timeoutSuccess);
    };
  }, [pairingData, authStep, pushName, simulatedDevice, onAddSession]);

  const handleRequestPairing = async (mode: 'pairing_code' | 'qr_code') => {
    if (mode === 'pairing_code' && !phoneNumber.trim()) {
      alert('Silakan masukkan nomor WhatsApp Anda terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setAuthStep('generating');

    try {
      let rawNumber = phoneNumber.trim();
      if (rawNumber.startsWith('0')) {
        rawNumber = countryCode + rawNumber.slice(1);
      } else if (!rawNumber.startsWith(countryCode) && !rawNumber.startsWith('+')) {
        rawNumber = countryCode + rawNumber;
      }
      const fullPhone = cleanPhoneNumber(rawNumber);

      const res = await fetch('/api/bot/pairing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone, mode })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setPairingData({
          phoneNumber: json.data.phoneNumber,
          pairingCode: json.data.pairingCode,
          qrCodeUrl: json.data.qrCodeUrl,
          expiresAt: json.data.expiresAt,
          status: 'pending',
          requestedAt: Date.now(),
          mode
        });
        setTimeLeft(60);
        setAuthStep('waiting');
      } else {
        alert(json.message || 'Gagal meminta kode pairing.');
        setAuthStep('idle');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memproses pairing.');
      setAuthStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!pairingData) return;
    navigator.clipboard.writeText(pairingData.pairingCode.replace('-', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetPairingState = () => {
    setPairingData(null);
    setAuthStep('idle');
    setTimeLeft(60);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitur Utama: Open JadiBot WhatsApp 24 Jam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Tautkan Nomor WhatsApp Anda Jadi Bot Cerdas 24 Jam
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Tidak perlu sewa RDP atau menyalakan HP terus-menerus. Cukup masukkan nomor HP Anda, dapatkan 
            <strong className="text-emerald-400"> 8-Digit Kode Pairing</strong> atau 
            <strong className="text-emerald-400"> Scan Barcode</strong>, dan bot Anda langsung aktif di cloud server!
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Device Protocol</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Auto-Reconnect 24 Jam</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Enkripsi End-to-End Aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('pairing'); resetPairingState(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'pairing'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>1. Minta Kode Pairing</span>
          </button>

          <button
            onClick={() => { setActiveTab('qr'); resetPairingState(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'qr'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>2. Scan Barcode (QR)</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>3. Sesi JadiBot Aktif ({sessions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PAIRING CODE */}
      {activeTab === 'pairing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Input Box */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <span>Formulir Permintaan Kode Pairing</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan nomor WhatsApp yang akan dijadikan nomor bot aktif.
              </p>

              <div className="mt-5 space-y-4">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nomor WhatsApp (Aktif di HP Anda)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500"
                    >
                      <option value="62">🇮🇩 +62 (ID)</option>
                      <option value="60">🇲🇾 +60 (MY)</option>
                      <option value="65">🇸🇬 +65 (SG)</option>
                      <option value="1">🇺🇸 +1 (US)</option>
                    </select>

                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Contoh: 81234567890 / 085812349876"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Info className="w-3 h-3 text-slate-500" />
                    <span>Dapat ditulis dengan awalan 08 atau langsung 812...</span>
                  </p>
                </div>

                {/* Bot Pushname / Nickname */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Bot / PushName (Opsional)
                  </label>
                  <input
                    type="text"
                    value={pushName}
                    onChange={(e) => setPushName(e.target.value)}
                    placeholder="Contoh: Florence Sub-Bot #1, Bot Toko Saya"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Device OS Simulation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tipe Perangkat WA
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Android', 'iOS', 'Web'] as const).map((dev) => (
                      <button
                        key={dev}
                        type="button"
                        onClick={() => setSimulatedDevice(dev)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          simulatedDevice === dev
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => handleRequestPairing('pairing_code')}
                  disabled={isLoading || !phoneNumber.trim()}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Menghubungkan ke Server Baileys...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-slate-950" />
                      <span>Dapatkan Kode Pairing (8 Digit)</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Step-by-step instructions card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Langkah Menghubungkan di WhatsApp:</span>
              </h3>
              <ol className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    1
                  </span>
                  <span>Buka aplikasi WhatsApp di HP yang ingin dijadikan Bot.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    2
                  </span>
                  <span>Ketuk ikon menu titik tiga (<strong>⋮</strong>) di pojok kanan atas &gt; pilih <strong>Perangkat Tertaut</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    3
                  </span>
                  <span>Pilih tombol <strong>Tautkan Perangkat</strong>, lalu klik tautan <strong>&quot;Tautkan dengan nomor telepon saja&quot;</strong> di bagian bawah.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    4
                  </span>
                  <span>Masukkan <strong>8 digit kode pairing</strong> yang muncul di kotak sebelah kanan. Selesai! Bot langsung aktif 24 jam.</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Pairing Code Result Display */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Status Koneksi JadiBot</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      authStep === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      authStep === 'authenticating' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse' :
                      authStep === 'waiting' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {authStep === 'connected' ? '🟢 Terhubung 24 Jam' :
                       authStep === 'authenticating' ? '🔄 Menukarkan Kunci Sesi...' :
                       authStep === 'waiting' ? '🟡 Menunggu Input di WA' :
                       '⚪ Belum Diminta'}
                    </span>
                  </div>

                  {pairingData && (
                    <button
                      onClick={() => handleRequestPairing('pairing_code')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Kode</span>
                    </button>
                  )}
                </div>

                {/* State: IDLE */}
                {authStep === 'idle' && (
                  <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
                      <KeyRound className="w-8 h-8 text-slate-600 animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-slate-200">Kode Pairing Siap Diminta</h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Ketik nomor telepon WhatsApp Anda pada formulir di sebelah kiri lalu klik &quot;Dapatkan Kode Pairing&quot;.
                    </p>
                  </div>
                )}

                {/* State: GENERATING */}
                {authStep === 'generating' && (
                  <div className="py-14 text-center flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                    <p className="text-sm font-semibold text-slate-200">
                      Menghubungi Baileys Multi-Device Socket...
                    </p>
                    <p className="text-xs text-slate-400">
                      Mendaftarkan sesi baru untuk nomor {formatPhoneNumber(phoneNumber || '628xxxx')}
                    </p>
                  </div>
                )}

                {/* State: WAITING (SHOW CODE) */}
                {pairingData && (authStep === 'waiting' || authStep === 'authenticating') && (
                  <div className="space-y-6">
                    {/* Big Pairing Code Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-emerald-500/40 p-6 text-center shadow-2xl">
                      <div className="absolute top-2 right-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Expires: {timeLeft}s
                        </span>
                      </div>

                      <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">
                        KODE PAIRING WHATSAPP ANDA:
                      </span>

                      <div className="my-3 flex items-center justify-center">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/10 select-all">
                          {pairingData.pairingCode}
                        </span>
                      </div>

                      {/* Copy Button */}
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all active:scale-95"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-slate-300" />
                              <span>Salin Kode Pairing</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-5 overflow-hidden">
                        <div 
                          className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                          style={{ width: `${(timeLeft / 60) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Target phone detail */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block">Nomor Terdaftar:</span>
                        <span className="text-white font-mono font-bold text-sm">
                          {formatPhoneNumber(pairingData.phoneNumber)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block">Sesi ID:</span>
                        <span className="text-emerald-400 font-mono text-[11px]">
                          {pairingData.phoneNumber.slice(-4)}-MD-24H
                        </span>
                      </div>
                    </div>

                    {authStep === 'authenticating' && (
                      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300 animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
                        <span>Kunci sesi diterima dari WhatsApp! Menyinkronkan kontak dan grup...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* State: CONNECTED */}
                {authStep === 'connected' && (
                  <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Selamat! Bot Berhasil Terhubung</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-sm">
                        Nomor <strong className="text-emerald-400">{formatPhoneNumber(phoneNumber || '628xxx')}</strong> kini aktif sebagai JadiBot 24 Jam penuh!
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('list')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all"
                      >
                        Lihat di Daftar JadiBot
                      </button>
                      <button
                        onClick={resetPairingState}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                      >
                        Tambah Nomor Lain
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Security guarantee footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Baileys Socket v6.7.12 Encrypted</span>
                </span>
                <span>Auto-Reboot: Enabled</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: QR CODE SCAN */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Scan Barcode / Kode QR WhatsApp</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan kamera WhatsApp Anda untuk langsung menautkan perangkat secara instan tanpa mengetik nomor.
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-slate-200">Petunjuk Pemindaian:</h4>
              <ol className="space-y-2 list-decimal list-inside text-slate-300">
                <li>Buka WhatsApp di ponsel Anda.</li>
                <li>Ketuk menu <strong>Titik Tiga (⋮)</strong> atau <strong>Pengaturan</strong>.</li>
                <li>Pilih <strong>Perangkat Tertaut</strong> &gt; <strong>Tautkan Perangkat</strong>.</li>
                <li>Arahkan kamera ponsel Anda ke Barcode di sebelah kanan.</li>
              </ol>
            </div>

            <button
              onClick={() => handleRequestPairing('qr_code')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
            >
              <RefreshCw className={`w-4 h-4 text-slate-950 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Generate / Refresh Barcode QR Baru</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
            {pairingData?.qrCodeUrl ? (
              <div className="space-y-4 flex flex-col items-center">
                <div className="relative p-3 bg-white rounded-2xl shadow-2xl border-4 border-emerald-500">
                  <img
                    src={pairingData.qrCodeUrl}
                    alt="WhatsApp QR Barcode"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-slate-950 p-1.5 shadow-md">
                      <QrCode className="w-full h-full text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Barcode kedaluwarsa dalam: <strong className="text-amber-400 font-mono">{timeLeft} detik</strong></span>
                </div>

                <button
                  onClick={() => handleRequestPairing('qr_code')}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                >
                  Muat Ulang Barcode
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                  <QrCode className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Barcode Belum Dibuat</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Klik tombol &quot;Generate / Refresh Barcode QR Baru&quot; untuk membuat kode QR autentikasi live.
                </p>
                <button
                  onClick={() => handleRequestPairing('qr_code')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all"
                >
                  Buat Barcode Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE JADIBOT SESSIONS LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>Daftar Sesi JadiBot Terhubung ({sessions.length} Bot Aktif)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Kelola semua sub-bot WhatsApp yang berjalan di server 24 jam.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('pairing')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah JadiBot Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((bot) => (
              <div
                key={bot.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-950 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm shadow-md">
                        {bot.pushName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{bot.pushName}</h4>
                        <span className="font-mono text-xs text-emerald-400">{formatPhoneNumber(bot.phoneNumber)}</span>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Aktif 24 Jam
                    </span>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="p-2 rounded-lg bg-slate-950/60">
                      <span className="text-slate-400 text-[10px] block">Paket Sewa:</span>
                      <span className="font-bold text-amber-400">{bot.planType}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/60">
                      <span className="text-slate-400 text-[10px] block">Baterai HP:</span>
                      <span className="font-semibold text-slate-200 flex items-center gap-1">
                        {bot.isCharging ? <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> : <Battery className="w-3.5 h-3.5 text-slate-400" />}
                        {bot.batteryLevel}% ({bot.platform})
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/60">
                      <span className="text-slate-400 text-[10px] block">Pesan Terkirim:</span>
                      <span className="font-semibold text-slate-200">{bot.messagesSent.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/60">
                      <span className="text-slate-400 text-[10px] block">Sisa Limit Kuota:</span>
                      <span className="font-semibold text-cyan-400">{bot.limitQuota} Limit</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSendTestMessage(bot.phoneNumber)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Tes Pesan</span>
                  </button>

                  <button
                    onClick={() => onRestartSession(bot.id)}
                    title="Restart Sesi JadiBot"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveSession(bot.id)}
                    title="Putuskan Koneksi / Logout"
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-all"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
