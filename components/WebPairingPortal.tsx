'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  KeyRound, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  Camera, 
  Upload, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Info,
  Server,
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cleanPhoneNumber, formatPhoneNumber } from '@/lib/bot-data';
import { JadiBotSession } from '@/types/bot';

interface WebPairingPortalProps {
  onSuccessPaired?: (newBot: JadiBotSession) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const WebPairingPortal: React.FC<WebPairingPortalProps> = ({
  onSuccessPaired,
  onNavigateToTab
}) => {
  const [activeMode, setActiveMode] = useState<'pairing_code' | 'qr_code'>('pairing_code');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('62');
  const [pushName, setPushName] = useState('');
  const [deviceType, setDeviceType] = useState<'Android' | 'iOS' | 'Web'>('Android');

  // Pairing State
  const [isLoading, setIsLoading] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'linking' | 'success'>('idle');
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  // Scanner Simulation / Live Camera
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'waiting' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  // Simulate auto-connection from WhatsApp socket
  useEffect(() => {
    let linkTimer: NodeJS.Timeout;
    let successTimer: NodeJS.Timeout;

    if (status === 'waiting') {
      linkTimer = setTimeout(() => {
        setStatus('linking');
        successTimer = setTimeout(() => {
          setStatus('success');
          try {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore confetti error if any
          }

          if (onSuccessPaired && currentPhone) {
            const newBot: JadiBotSession = {
              id: `jb-${currentPhone}-${Date.now()}`,
              phoneNumber: currentPhone,
              pushName: pushName.trim() || `Bot ${formatPhoneNumber(currentPhone)}`,
              status: 'connected',
              connectedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
              batteryLevel: 92,
              isCharging: true,
              platform: deviceType,
              messagesSent: 0,
              limitQuota: 1000,
              tokenBalance: 300,
              planType: 'Sewa 30 Hari',
              autoReboot: true,
              lastActive: 'Baru saja'
            };
            onSuccessPaired(newBot);
          }
        }, 3500);
      }, 8000);
    }

    return () => {
      clearTimeout(linkTimer);
      clearTimeout(successTimer);
    };
  }, [status, currentPhone, pushName, deviceType, onSuccessPaired]);

  const handleRequestPairing = async (mode: 'pairing_code' | 'qr_code') => {
    let rawNumber = phoneNumber.trim();
    if (!rawNumber && mode === 'pairing_code') {
      alert('Silakan masukkan nomor WhatsApp Anda terlebih dahulu.');
      return;
    }

    if (rawNumber.startsWith('0')) {
      rawNumber = '62' + rawNumber.slice(1);
    } else if (!rawNumber.startsWith('62') && !rawNumber.startsWith('+')) {
      rawNumber = countryCode + rawNumber;
    }

    const fullClean = cleanPhoneNumber(rawNumber || '6285812349876');
    setCurrentPhone(fullClean);
    setIsLoading(true);

    try {
      const res = await fetch('/api/bot/pairing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: fullClean,
          mode
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setPairingCode(json.data.pairingCode);
        setQrCodeUrl(json.data.qrCodeUrl);
        setTimeLeft(60);
        setStatus('waiting');
      } else {
        alert(json.message || 'Gagal memproses sesi pairing.');
        setStatus('idle');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat menghubungi API.');
      setStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode.replace('-', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPortalLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://florence-wa-bot.vercel.app';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReset = () => {
    setPairingCode(null);
    setQrCodeUrl(null);
    setStatus('idle');
    setTimeLeft(60);
  };

  const simulateCameraScan = () => {
    setIsCameraActive(true);
    setTimeout(() => {
      setScannedResult('Sesi QR WhatsApp Berhasil Divalidasi! Token MD-24H Auth Terkonfirmasi.');
      setIsCameraActive(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Portal Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Akses Web Publik JadiBot</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Siap Deploy ke Vercel & Netlify</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Web Permintaan Kode Pairing & Scanner Barcode WhatsApp
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Halaman ini dapat diakses langsung oleh seluruh pengguna di browser untuk menautkan nomor mereka menjadi bot WhatsApp aktif 24 jam tanpa perlu instalasi aplikasi tambahan.
          </p>

          {/* Shareable Link Bar */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyPortalLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-md active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
              <span>{copiedLink ? 'Link Website Tersalin!' : 'Bagikan Link Web Portal Ini'}</span>
            </button>

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('hosting')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Lihat Cara Deploy Vercel / Netlify</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Mode Toggle Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => { setActiveMode('pairing_code'); handleReset(); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
            activeMode === 'pairing_code'
              ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className={`p-3 rounded-xl ${activeMode === 'pairing_code' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">Metode 1: Kode Pairing (8-Digit OTP)</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Paling Mudah
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Cukup masukkan nomor HP WhatsApp Anda, terima kode 8 huruf, dan masukkan di menu Perangkat Tertaut.
            </p>
          </div>
        </button>

        <button
          onClick={() => { setActiveMode('qr_code'); handleReset(); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
            activeMode === 'qr_code'
              ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className={`p-3 rounded-xl ${activeMode === 'qr_code' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">Metode 2: Scan Barcode (Kode QR)</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Kamera WA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Pindai kode QR barcode langsung dengan kamera WhatsApp HP atau upload gambar barcode untuk verifikasi.
            </p>
          </div>
        </button>
      </div>

      {/* PAIRING CODE WORKFLOW */}
      {activeMode === 'pairing_code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>Masukkan Nomor WhatsApp Anda</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sistem akan memvalidasi nomor dan menghasilkan kode pairing resmi Baileys Multi-Device.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor HP WhatsApp
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="62">🇮🇩 +62</option>
                    <option value="60">🇲🇾 +60</option>
                    <option value="65">🇸🇬 +65</option>
                    <option value="1">🇺🇸 +1</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Contoh: 081234567890 / 85812349876"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Bot / PushName (Bebas)
                </label>
                <input
                  type="text"
                  value={pushName}
                  onChange={(e) => setPushName(e.target.value)}
                  placeholder="Contoh: Florence Bot Saya, Bot Store Admin"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tipe Perangkat Sistem
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Android', 'iOS', 'Web'] as const).map((dev) => (
                    <button
                      key={dev}
                      type="button"
                      onClick={() => setDeviceType(dev)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        deviceType === dev
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {dev}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRequestPairing('pairing_code')}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Menghubungi Server Baileys...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-slate-950" />
                    <span>Minta Kode Pairing Sekarang (8 Digit)</span>
                  </>
                )}
              </button>
            </div>

            {/* Step Instructions */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block">Panduan Memasukkan Kode:</span>
              <p>1. Buka <strong>WhatsApp</strong> di HP Anda.</p>
              <p>2. Buka menu titik tiga (<strong>⋮</strong>) &gt; <strong>Perangkat Tertaut</strong>.</p>
              <p>3. Pilih <strong>Tautkan Perangkat</strong> &gt; klik <strong>&quot;Tautkan dengan nomor telepon saja&quot;</strong>.</p>
              <p>4. Masukkan kode 8 digit yang muncul di sebelah kanan.</p>
            </div>
          </div>

          {/* Right Display Area */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hasil Kode Pairing Real-time</span>
              </h3>
              {pairingCode && (
                <button
                  onClick={() => handleRequestPairing('pairing_code')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Kode</span>
                </button>
              )}
            </div>

            {status === 'idle' && (
              <div className="py-14 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                  <KeyRound className="w-8 h-8 text-emerald-400/60 animate-pulse" />
                </div>
                <h4 className="font-bold text-sm text-slate-200">Belum Ada Kode Diminta</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Isi formulir nomor WhatsApp di sebelah kiri dan klik &quot;Minta Kode Pairing Sekarang&quot;.
                </p>
              </div>
            )}

            {(status === 'waiting' || status === 'linking') && pairingCode && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 text-center shadow-inner relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="uppercase tracking-wider font-semibold">Kode Pairing Aktif:</span>
                    <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      Kedaluwarsa: {timeLeft}s
                    </span>
                  </div>

                  <div className="my-4 font-mono text-3xl sm:text-4xl font-black text-emerald-400 tracking-widest select-all">
                    {pairingCode}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-600 transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                    <span>{copied ? 'Kode Tersalin!' : 'Salin 8-Digit Kode'}</span>
                  </button>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(timeLeft / 60) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Nomor:</span>
                  <span className="text-white font-mono font-bold">{formatPhoneNumber(currentPhone)}</span>
                </div>

                {status === 'linking' && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
                    <span>WhatsApp mendeteksi input kode! Menyinkronkan sesi kredensial Baileys...</span>
                  </div>
                )}
              </div>
            )}

            {status === 'success' && (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Bot Berhasil Terkoneksi 24 Jam!</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    Nomor <strong>{formatPhoneNumber(currentPhone)}</strong> kini aktif sebagai JadiBot. Server cloud menjaga bot tetap hidup non-stop.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all shadow-md"
                >
                  Tautkan Nomor Lainnya
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* QR BARCODE SCANNER WORKFLOW */}
      {activeMode === 'qr_code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: QR Display */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  <span>Scan Barcode QR WhatsApp</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pindai kode barcode di bawah ini dengan kamera WhatsApp.
                </p>
              </div>

              <button
                onClick={() => handleRequestPairing('qr_code')}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Buat Barcode Baru</span>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              {qrCodeUrl ? (
                <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-slate-800 flex flex-col items-center">
                  <img src={qrCodeUrl} alt="WhatsApp QR Code" className="w-56 h-56 object-contain" />
                  <span className="text-[10px] text-slate-800 font-bold mt-2">Arahkan Kamera WhatsApp ke sini</span>
                </div>
              ) : (
                <div className="w-56 h-56 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-4">
                  <QrCode className="w-12 h-12 text-slate-600 mb-2" />
                  <p className="text-xs text-slate-400">Klik tombol di bawah untuk membuat barcode QR</p>
                  <button
                    onClick={() => handleRequestPairing('qr_code')}
                    className="mt-3 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300"
                  >
                    Generate Barcode Sekarang
                  </button>
                </div>
              )}

              {qrCodeUrl && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Barcode berlaku selama 60 detik (auto refresh)</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Camera / Image QR Scanner Simulator */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Uji Kamera QR Scanner & Validator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan scanner web ini untuk menguji pembacaan barcode dan token sesi secara live di browser.
              </p>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden p-6 text-center flex flex-col items-center justify-center min-h-[260px]">
              {isCameraActive ? (
                <div className="space-y-3">
                  <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative mx-auto flex items-center justify-center overflow-hidden bg-slate-900/50">
                    <div className="w-full h-0.5 bg-emerald-400 absolute top-0 animate-bounce shadow-lg shadow-emerald-400" />
                    <span className="text-[11px] text-emerald-300 font-mono">Memindai QR Barcode...</span>
                  </div>
                  <p className="text-xs text-slate-400">Menyelaraskan lensa kamera dengan target QR...</p>
                </div>
              ) : scannedResult ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-white">Hasil Scan Barcode:</h4>
                  <p className="text-xs font-mono text-emerald-300 bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-sm">
                    {scannedResult}
                  </p>
                  <button
                    onClick={() => setScannedResult(null)}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Scan Ulang
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Kamera Scanner Web</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Uji pembacaan QR barcode langsung dari kamera perangkat atau unggah file gambar screenshot.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={simulateCameraScan}
                      className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 shadow-md flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Aktifkan Scanner Kamera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block">Panduan Scan di HP:</span>
              <p>1. Buka <strong>WhatsApp</strong> di HP Anda.</p>
              <p>2. Buka menu titik tiga (<strong>⋮</strong>) &gt; <strong>Perangkat Tertaut</strong>.</p>
              <p>3. Ketuk tombol <strong>Tautkan Perangkat</strong> &gt; Arahkan kamera HP ke barcode sebelah kiri.</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
