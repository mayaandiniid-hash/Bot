'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  QrCode, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  RefreshCw, 
  Smartphone, 
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

interface StoreItem {
  id: string;
  name: string;
  category: 'sewa' | 'jadibot' | 'limit';
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

const STORE_CATALOG: StoreItem[] = [
  {
    id: 'plan-sewa-7d',
    name: 'Paket Hemat Sewa Bot',
    category: 'sewa',
    price: 5000,
    duration: '7 Hari',
    features: [
      'Semua Fitur Admin & Group Guard',
      'Downloader TikTok, IG, YouTube HD',
      'Game Hub & Stiker Maker',
      'Aktif 24 Jam Non-stop'
    ]
  },
  {
    id: 'plan-sewa-30d',
    name: 'Paket Reguler Sewa Bot',
    category: 'sewa',
    price: 15000,
    duration: '30 Hari',
    features: [
      'Semua Fitur Paket Hemat',
      '1x Gratis Slot JadiBot Pribadi',
      'Prioritas Kecepatan Respon',
      'Fitur AI Cerdas Gemini Multi-Turn'
    ],
    isPopular: true
  },
  {
    id: 'plan-jadibot-slot',
    name: 'Slot Tambahan JadiBot 24 Jam',
    category: 'jadibot',
    price: 10000,
    duration: '30 Hari',
    features: [
      'Nomor Sendiri Aktif Sebagai Bot',
      'Dukungan Pairing Code & Scan QR',
      'Auto-Reconnect jika putus',
      'Limit 2.000 Perintah per hari'
    ]
  },
  {
    id: 'plan-vip-perm',
    name: 'VIP Permanent Bot Access',
    category: 'sewa',
    price: 50000,
    duration: 'Selamanya (VIP)',
    features: [
      'Akses Unlimited Selamanya',
      'Slot JadiBot Tanpa Batas Masa Aktif',
      'Akses Semua Command Owner & Addons',
      'Dukungan Garansi Update Fitur'
    ]
  }
];

export const StoreQrisSimulator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<StoreItem | null>(null);
  const [qrisDataUrl, setQrisDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'waiting_qr' | 'success'>('idle');
  const [userPhone, setUserPhone] = useState('6281234567890');
  const [trxId, setTrxId] = useState('');

  const trxCounter = React.useRef(100);

  const handleCheckout = async (plan: StoreItem) => {
    setSelectedPlan(plan);
    setIsProcessing(true);
    setPaymentStatus('waiting_qr');
    trxCounter.current += 1;
    const newTrxId = `FLR-QRIS-${trxCounter.current}-${plan.price}`;
    setTrxId(newTrxId);

    try {
      // Generate QRIS string
      const qrisRaw = `00020101021226600016ID.CO.QRIS.WWW01189360099900000000000215${newTrxId}520458125303360540${plan.price}5802ID5913FLORENCE_AI6007JAKARTA6304`;
      const url = await QRCode.toDataURL(qrisRaw, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 8,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrisDataUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePaymentSuccess = () => {
    setPaymentStatus('success');
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store & Pembayaran Otomatis</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Sewa Bot WhatsApp & Slot JadiBot 24 Jam
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pembayaran didukung otomatis via QRIS (BCA, Mandiri, BRI, Dana, GoPay, OVO, ShopeePay).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verifikasi Pembayaran Instan 3-5 Detik</span>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STORE_CATALOG.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              plan.isPopular
                ? 'bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-2.5 right-4 bg-emerald-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                Paling Diminati
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                {plan.duration}
              </span>
              <h3 className="font-extrabold text-base text-white">{plan.name}</h3>

              <div className="my-4">
                <span className="text-2xl font-black text-white">
                  Rp {plan.price.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400"> / paket</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 my-4 border-t border-slate-800 pt-3">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout(plan)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                plan.isPopular
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Beli via QRIS Instan</span>
            </button>
          </div>
        ))}
      </div>

      {/* QRIS Modal & Payment Simulation */}
      {selectedPlan && paymentStatus !== 'idle' && (
        <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Invoice QRIS Pembayaran Otomatis</h3>
            </div>
            <button
              onClick={() => { setSelectedPlan(null); setPaymentStatus('idle'); }}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕ Tutup
            </button>
          </div>

          {paymentStatus === 'waiting_qr' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* QR Code Canvas */}
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-slate-800">
                  {qrisDataUrl ? (
                    <img src={qrisDataUrl} alt="QRIS Barcode" className="w-56 h-56 object-contain" />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                      Membuat QRIS...
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Trx ID: {trxId}
                </span>
              </div>

              {/* Order Info & Action */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Item Pesanan:</span>
                    <strong className="text-white">{selectedPlan.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masa Aktif:</span>
                    <strong className="text-emerald-400">{selectedPlan.duration}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Nominal:</span>
                    <strong className="text-xl font-extrabold text-white">
                      Rp {selectedPlan.price.toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Sistem memindai pembayaran secara otomatis. Limit/sewa aktif seketika setelah transfer.</span>
                </div>

                {/* Simulate Success Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSimulatePaymentSuccess}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Simulasikan Pembayaran Sukses (Tes Callback)
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* SUCCESS STATE */
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Pembayaran Sukses Diverifikasi!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Paket <strong>{selectedPlan.name}</strong> telah berhasil diaktifkan. Masa aktif dan slot JadiBot Anda sudah otomatis terisi.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                Invoice FLR-QRIS: PAID • Instant Auto-Renewal OK
              </div>

              <button
                onClick={() => { setSelectedPlan(null); setPaymentStatus('idle'); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all shadow-md"
              >
                Selesai & Kembali ke Menu
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
