'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smartphone, 
  Bot, 
  Sparkles, 
  Check, 
  CheckCheck, 
  Image as ImageIcon, 
  Smile, 
  Paperclip, 
  Mic, 
  RefreshCw, 
  QrCode, 
  ShieldCheck, 
  Zap,
  Phone,
  Video,
  MoreVertical,
  Volume2
} from 'lucide-react';
import { ChatMessage } from '@/types/bot';

interface WhatsAppSimulatorProps {
  onOpenPairingModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  onOpenPairingModal,
  onNavigateToTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'system',
      senderName: 'System',
      text: '🔒 Pesan dan panggilan dienkripsi secara end-to-end. Tidak seorang pun di luar chat ini yang dapat membaca atau mendengarkannya.',
      timestamp: '09:00',
      type: 'text'
    },
    {
      id: 'm-2',
      sender: 'user',
      senderName: 'You',
      text: '.menu',
      timestamp: '09:01',
      type: 'text'
    },
    {
      id: 'm-3',
      sender: 'bot',
      senderName: 'Florence AI Assistant',
      text: `╭─「 🌟 *FLORENCE AI - WA BOT MULTI-DEVICE* 」
│ 🤖 *Status*: ONLINE 24 JAM 🟢
│ 👤 *Owner*: Maya Andini (Verified)
│ 📊 *Mode*: Multi-Session JadiBot Active
│ 🛡️ *Protection*: Anti-Spam & Anti-Ban v2.9
╰───────────────────────────────

╭─「 🚀 *MENU JADIBOT & SEWA* 」
│ ✦ *.jadibot* - Tautkan nomor Anda jadi Bot
│ ✦ *.sewabot* - Daftar harga sewa bot untuk grup
│ ✦ *.buylimit* - Topup kuota limit bot via QRIS
╰───────────────────────────────

╭─「 🧠 *MENU AI & CERDAS* 」
│ ✦ *.ai <tanya>* - Tanya Gemini AI cerdas
│ ✦ *.gpt4o <tanya>* - AI model GPT-4o turbo
│ ✦ *.brat <teks>* - Buat stiker teks tren Brat
│ ✦ *.sticker* - Buat stiker WA dari media
│ ✦ *.ping* - Cek respon & status server
╰───────────────────────────────
_💡 Klik tombol di bawah untuk mencoba fitur cepat:_`,
      timestamp: '09:01',
      type: 'text',
      buttons: [
        { id: 'btn_jadibot', text: '🔗 Buka JadiBot Pairing', action: '.jadibot' },
        { id: 'btn_sewa', text: '🛒 Sewa Bot Grup', action: '.sewabot' },
        { id: 'btn_ping', text: '⚡ Cek Ping Server', action: '.ping' }
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickCommands = [
    { label: '.menu', cmd: '.menu' },
    { label: '.jadibot', cmd: '.jadibot' },
    { label: '.ai Jelaskan apa itu JadiBot', cmd: '.ai Jelaskan apa itu JadiBot dan bagaimana cara menghubungkannya' },
    { label: '.brat Florence Bot 24 Jam', cmd: '.brat Florence Bot 24 Jam' },
    { label: '.ping', cmd: '.ping' },
    { label: '.sewabot', cmd: '.sewabot' },
    { label: '.ceklimit', cmd: '.ceklimit' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const messageCounter = useRef(100);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim()) return;

    messageCounter.current += 1;
    const currentId = `user-${messageCounter.current}`;

    const userMsg: ChatMessage = {
      id: currentId,
      sender: 'user',
      senderName: 'You',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'read'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputVal('');
    setIsTyping(true);

    try {
      const parts = textToSend.trim().split(' ');
      const command = parts[0];
      const args = parts.slice(1).join(' ');

      const res = await fetch('/api/bot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          args,
          senderName: 'Maya User',
          senderPhone: '6281234567890'
        })
      });

      const json = await res.json();
      if (json.status === 'success' && json.reply) {
        setMessages((prev) => [...prev, json.reply]);
      }
    } catch (err) {
      messageCounter.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${messageCounter.current}`,
          sender: 'bot',
          senderName: 'Florence AI',
          text: '⚠️ Terjadi kendala saat memproses perintah pada simulasi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleButtonClick = (action: string) => {
    if (action === 'OPEN_PAIRING_MODAL') {
      onOpenPairingModal();
    } else if (action === 'OPEN_QR_MODAL') {
      onNavigateToTab('jadibot');
    } else if (action.startsWith('.')) {
      handleSend(action);
    } else {
      handleSend(`.jadibot`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* WhatsApp Device Mockup */}
      <div className="lg:col-span-8 flex justify-center">
        <div className="w-full max-w-xl bg-slate-950 border-4 border-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[640px] relative">
          
          {/* Phone Top Notch / Header */}
          <div className="bg-[#0b141a] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b141a] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white leading-tight">Florence AI Multi-Device</h3>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px]">
                    ✓
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>online 24 jam • bot resmi</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Video className="w-4 h-4 cursor-pointer hover:text-slate-200" />
              <Phone className="w-4 h-4 cursor-pointer hover:text-slate-200" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-slate-200" />
            </div>
          </div>

          {/* Chat Body (WhatsApp dark wallpaper pattern) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'system' ? 'items-center my-2' :
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.sender === 'system' ? (
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 text-center max-w-sm shadow-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-[#005c4b] text-emerald-50 rounded-tr-none'
                        : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/40'
                    }`}
                  >
                    {/* Bot Sender Badge */}
                    {msg.sender === 'bot' && (
                      <span className="text-[10px] font-bold text-emerald-400 block mb-1">
                        ~ Florence AI Bot
                      </span>
                    )}

                    {/* Sticker Display */}
                    {msg.type === 'sticker' ? (
                      <div className="p-3 bg-[#0f172a] rounded-xl border border-emerald-500/40 my-1 text-center flex flex-col items-center">
                        <div className="w-32 h-32 bg-[#89eb5b] text-black font-mono font-black text-sm flex items-center justify-center rounded-xl p-3 shadow-inner transform rotate-1">
                          {msg.text.replace(/[*_~`]/g, '')}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-2">✨ WebP Animated Sticker</span>
                      </div>
                    ) : (
                      /* Formatted Text */
                      <div className="text-xs sm:text-[13px] whitespace-pre-wrap font-sans leading-relaxed break-words">
                        {msg.text}
                      </div>
                    )}

                    {/* Interactive Buttons Card */}
                    {msg.buttons && msg.buttons.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-700/60 space-y-1.5">
                        {msg.buttons.map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => handleButtonClick(btn.action)}
                            className="w-full py-1.5 px-3 rounded-lg bg-[#111b21] hover:bg-[#222e35] text-emerald-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700/60 active:scale-[0.98]"
                          >
                            <span>{btn.text}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Timestamp & Status */}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'user' && (
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Florence AI sedang mengetik balasan...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="bg-[#202c33] p-2.5 flex items-center gap-2 border-t border-slate-800">
            <button className="text-slate-400 hover:text-slate-200 p-1">
              <Smile className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-200 p-1">
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik perintah WhatsApp (contoh: .menu, .jadibot, .ai)..."
              className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            {inputVal.trim() ? (
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button className="w-9 h-9 rounded-full bg-[#2a3942] text-slate-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Side Info & Quick Command Palette */}
      <div className="lg:col-span-4 space-y-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Pintasan Coba Perintah Bot</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Klik tombol di bawah untuk langsung mencoba respon bot di simulator:
          </p>

          <div className="flex flex-wrap gap-2">
            {quickCommands.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.cmd)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-emerald-500/15 border border-slate-800 hover:border-emerald-500/30 text-xs font-mono text-emerald-300 transition-all text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Explainer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs text-slate-300">
          <h4 className="font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Fitur yang Diuji di Simulator:</span>
          </h4>
          <ul className="space-y-2 list-disc list-inside text-slate-400">
            <li><strong className="text-slate-200">.jadibot</strong> - Menu open pairing & barcode QR.</li>
            <li><strong className="text-slate-200">.ai / .gpt4o</strong> - Kecerdasan buatan Gemini API.</li>
            <li><strong className="text-slate-200">.brat & .sticker</strong> - Pembuat stiker WhatsApp live.</li>
            <li><strong className="text-slate-200">.sewabot & .buylimit</strong> - Sistem pembayaran QRIS otomatis.</li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onOpenPairingModal}
              className="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20"
            >
              Minta Kode Pairing Nomor Saya
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
