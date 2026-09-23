'use client';

import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  Smartphone, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cleanPhoneNumber, generatePairingCode, formatPhoneNumber } from '@/lib/bot-data';

interface PairingCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPaired?: (phoneNumber: string) => void;
}

export const PairingCodeModal: React.FC<PairingCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccessPaired
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mode, setMode] = useState<'code' | 'qr'>('code');
  const [isLoading, setIsLoading] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'input' | 'waiting' | 'success'>('input');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'waiting' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Simulate auto connect after 10 seconds
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (step === 'waiting') {
      t = setTimeout(() => {
        setStep('success');
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}
        if (onSuccessPaired && phoneNumber) {
          onSuccessPaired(cleanPhoneNumber(phoneNumber));
        }
      }, 10000);
    }
    return () => clearTimeout(t);
  }, [step, phoneNumber, onSuccessPaired]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!phoneNumber.trim() && mode === 'code') {
      alert('Masukkan nomor WhatsApp Anda');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/bot/pairing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: cleanPhoneNumber(phoneNumber || '6285812349876'),
          mode: mode === 'code' ? 'pairing_code' : 'qr_code'
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setPairingCode(json.data.pairingCode);
        setQrUrl(json.data.qrCodeUrl);
        setTimeLeft(60);
        setStep('waiting');
      }
    } catch (e) {
      alert('Gagal membuat pairing code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (!pairingCode) return;
    navigator.clipboard.writeText(pairingCode.replace('-', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPairingCode(null);
    setQrUrl(null);
    setStep('input');
    setTimeLeft(60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Hubungkan JadiBot WhatsApp 24 Jam</h3>
              <p className="text-[11px] text-slate-400">Dapatkan kode pairing atau pindai barcode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4">
          
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => { setMode('code'); handleReset(); }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'code' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Kode Pairing (8 Digit)</span>
            </button>
            <button
              onClick={() => { setMode('qr'); handleReset(); }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'qr' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Barcode QR</span>
            </button>
          </div>

          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nomor WhatsApp yang akan dijadikan Bot:
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contoh: 081234567890 / 62858..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">Cara Pakai:</span>
                <p>1. Klik &quot;Minta Kode Pairing Sekarang&quot;.</p>
                <p>2. Buka WA &gt; Perangkat Tertaut &gt; Tautkan dengan nomor telepon &gt; Masukkan kode.</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <KeyRound className="w-4 h-4 text-slate-950" />
                )}
                <span>Minta Kode Pairing Sekarang</span>
              </button>
            </div>
          )}

          {step === 'waiting' && (
            <div className="space-y-4 text-center">
              {mode === 'code' && pairingCode ? (
                <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 shadow-inner">
                  <span className="text-[11px] text-slate-400 block mb-2 uppercase tracking-widest font-semibold">
                    KODE PAIRING WHATSAPP:
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-black text-emerald-400 tracking-widest select-all my-2">
                    {pairingCode}
                  </div>
                  <button
                    onClick={copyCode}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
                  </button>
                </div>
              ) : qrUrl ? (
                <div className="flex flex-col items-center p-4 bg-white rounded-2xl">
                  <img src={qrUrl} alt="WA Barcode" className="w-48 h-48 object-contain" />
                  <span className="text-[10px] text-slate-700 font-bold mt-1">Scan dengan WhatsApp Anda</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Berlaku: <strong className="text-amber-400 font-mono">{timeLeft}s</strong></span>
                <span className="animate-pulse text-emerald-400">Menunggu input di WhatsApp...</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-white">Bot Berhasil Terhubung!</h4>
              <p className="text-xs text-slate-300">
                Nomor Anda kini aktif berjalan di cloud server 24 jam penuh.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300"
              >
                Selesai
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
