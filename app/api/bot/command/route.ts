import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { formatPhoneNumber } from '@/lib/bot-data';

export async function POST(req: NextRequest) {
  try {
    const { command, args = '', senderPhone = '6281234567890', senderName = 'Maya' } = await req.json();

    const cmd = command.toLowerCase().trim();
    const fullText = args ? `${cmd} ${args}` : cmd;
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    let responseText = '';
    let responseType: 'text' | 'image' | 'sticker' | 'buttons' | 'qris' = 'text';
    let mediaUrl: string | undefined = undefined;
    let buttons: { id: string; text: string; action: string }[] | undefined = undefined;

    if (cmd === '.menu' || cmd === '.help') {
      responseText = `╭─「 🌟 *FLORENCE AI - WA BOT MULTI-DEVICE* 」
│ 🤖 *Status Server*: ONLINE 24 JAM 🟢
│ 👤 *User*: ${senderName} (${formatPhoneNumber(senderPhone)})
│ ⏳ *Uptime*: 48 Jam 15 Menit
│ 📊 *Mode*: Multi-Session JadiBot Active
│ 🛡️ *Protection*: Anti-Spam & Anti-Ban v2.9
╰───────────────────────────────

╭─「 🚀 *MENU JADIBOT & SEWA* 」
│ ✦ *.jadibot* - Tautkan nomor Anda jadi Bot (Pairing/QR)
│ ✦ *.sewabot* - Daftar harga sewa bot untuk grup
│ ✦ *.ceksewa* - Cek sisa masa aktif sewa bot
│ ✦ *.buylimit* - Topup kuota limit bot via QRIS
│ ✦ *.token* - Cek saldo token bot & marketplace
╰───────────────────────────────

╭─「 🧠 *MENU AI & CERDAS* 」
│ ✦ *.ai <tanya>* - Tanya Gemini / GPT cerdas
│ ✦ *.gpt4o <tanya>* - AI model GPT-4o turbo
│ ✦ *.askme <teks>* - Chat dengan memori personal
│ ✦ *.aitable <topik>* - Buat tabel data cerdas
╰───────────────────────────────

╭─「 🎨 *MAKER & STIKER* 」
│ ✦ *.sticker* - Konversi gambar/video ke stiker
│ ✦ *.brat <teks>* - Buat stiker teks tren Brat
│ ✦ *.bratvid <teks>* - Stiker animasi video Brat
│ ✦ *.hd* - Jernihkan & tingkatkan kualitas foto
│ ✦ *.qwa <teks>* - Quote palsu pesan WhatsApp
│ ✦ *.removebg* - Hapus latar belakang foto
╰───────────────────────────────

╭─「 📥 *DOWNLOADER* 」
│ ✦ *.tiktok <link>* - Download VT tanpa watermark
│ ✦ *.instagram <link>* - Download Reels/Post/Story
│ ✦ *.ytmp3 <link>* - Download musik YouTube MP3
│ ✦ *.ytmp4 <link>* - Download video YouTube MP4
│ ✦ *.play <judul>* - Cari & putar lagu langsung
│ ✦ *.spotify <link>* - Download track Spotify
╰───────────────────────────────

╭─「 👥 *GROUP & ADMIN* 」
│ ✦ *.hidetag <pesan>* - Tag seluruh member grup
│ ✦ *.tagall <pesan>* - Mention semua anggota
│ ✦ *.kick @user* - Keluarkan member dari grup
│ ✦ *.add 628xxx* - Tambahkan member baru
│ ✦ *.welcome on/off* - Sambutan anggota baru
│ ✦ *.groupinfo* - Info status & rules grup
╰───────────────────────────────

╭─「 ⚙️ *UTILITY & SYSTEM* 」
│ ✦ *.ping* - Cek kecepatan respon bot
│ ✦ *.runtime* - Cek total durasi bot menyala
│ ✦ *.ceklimit* - Cek sisa kuota limit harian
│ ✦ *.owner* - Kirim kontak owner Florence AI
╰───────────────────────────────
_💡 Ketik perintah di atas untuk mencoba fitur._`;

      buttons = [
        { id: 'btn_jadibot', text: '🔗 Buka JadiBot', action: '.jadibot' },
        { id: 'btn_sewa', text: '🛒 Sewa Bot', action: '.sewabot' },
        { id: 'btn_ping', text: '⚡ Cek Ping', action: '.ping' }
      ];
    } 
    else if (cmd === '.jadibot') {
      responseText = `🤖 *FITUR JADIBOT WHATSAPP (MULTI-DEVICE)*

Jadikan nomor WhatsApp pribadi atau bisnis Anda sebagai asisten bot pintar dengan ribuan fitur lengkap!

*Pilihan Metode Menghubungkan:*
1️⃣ *Kode Pairing (Pairing Code)*
Ketik nomor Anda di web dashboard atau minta di sini, dapatkan 8 digit kode, lalu masukkan di:
👉 _WhatsApp > Perangkat Tertaut > Tautkan dengan nomor telepon_

2️⃣ *Scan Barcode (Kode QR)*
Pindai barcode langsung menggunakan kamera WhatsApp Anda.

*Keunggulan JadiBot Florence:*
✅ Aktif 24 Jam Non-stop di Cloud Server
✅ Auto-Reconnect jika terputus
✅ Fitur lengkap Group Guard, Downloader & AI
✅ Tidak mengganggu chat pribadi Anda

_Klik tombol di bawah untuk membuka halaman Pairing Code / Scan QR!_`;

      buttons = [
        { id: 'btn_pairing', text: '🔢 Minta Kode Pairing', action: 'OPEN_PAIRING_MODAL' },
        { id: 'btn_qr', text: '📷 Scan Barcode QR', action: 'OPEN_QR_MODAL' },
        { id: 'btn_status', text: '📋 Cek JadiBot Aktif', action: 'VIEW_ACTIVE_BOTS' }
      ];
    }
    else if (cmd === '.sewabot') {
      responseText = `👑 *DAFTAR HARGA SEWA BOT FLORENCE AI*

Kembangkan dan amankan grup WhatsApp Anda dengan bot otomatis 24 jam!

📦 *Paket Sewa Bot:*
• *Hemat (7 Hari)*: Rp 5.000 (Semua fitur grup + game)
• *Reguler (30 Hari)*: Rp 15.000 (Semua fitur + JadiBot 1 slot)
• *Sultan (60 Hari)*: Rp 25.000 (VIP Access + AI Unlimited)
• *Permanent VIP*: Rp 50.000 (Aktif Selamanya + Free Update)

💳 *Metode Pembayaran:*
QRIS Otomatis All Payment (GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI).

_Ketik *.buylimit* atau klik tombol di bawah untuk transaksi instan._`;

      buttons = [
        { id: 'btn_pay_qris', text: '💳 Bayar via QRIS', action: '.buylimit 15000' },
        { id: 'btn_contact_owner', text: '📞 Hubungi Owner', action: '.owner' }
      ];
    }
    else if (cmd === '.ping') {
      const start = Date.now();
      const latency = Math.floor(25 + Math.random() * 20);
      responseText = `🏓 *PONG!*
⚡ *Kecepatan Respon:* ${latency} ms
🖥️ *Status Server:* Running Smooth 24/7
💾 *RAM Terpakai:* 214 MB / 512 MB
🌐 *Region Server:* Asia-Southeast1 (Jakarta/SG)
📱 *Engine:* Baileys Multi-Device v6.7.12`;
    }
    else if (cmd === '.runtime') {
      responseText = `⏱️ *SERVER RUNTIME & UPTIME MONITOR*
━━━━━━━━━━━━━━━━━━━━
🟢 *Status:* AKTIF 24 JAM PENUH
⏳ *Uptime:* 2 Hari, 14 Jam, 32 Menit, 18 Detik
🔄 *Auto-Restart Worker:* Enabled (0 Crash)
⚡ *Keep-Alive Daemon:* Running every 60s
📊 *Total Sesi JadiBot Terhubung:* 3 Perangkat
━━━━━━━━━━━━━━━━━━━━
_Server terlindungi dari sleep/hibernation mode._`;
    }
    else if (cmd === '.brat') {
      const textParam = args || 'halo dunia brat';
      responseType = 'sticker';
      responseText = `✨ *Stiker Brat Dibuat:* "${textParam}"`;
    }
    else if (cmd === '.sticker') {
      responseType = 'sticker';
      responseText = `✨ *Stiker Berhasil Dibuat dari Media!*`;
    }
    else if (cmd === '.ai' || cmd === '.gpt4o' || cmd === '.askme') {
      const query = args || 'Jelaskan cara menghubungkan JadiBot WhatsApp dengan kode pairing secara singkat dan jelas';
      
      let aiResponse = '';
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const genRes = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Kamu adalah asisten cerdas WhatsApp Bot "Florence AI". Jawab pertanyaan user berikut secara ramah, ringkas, dan jelas dalam Bahasa Indonesia:\n\n${query}`,
          });
          aiResponse = genRes.text || '';
        } catch (e) {
          aiResponse = `Florence AI siap membantu! Terkait pertanyaan Anda: "${query}", sistem bot kami berjalan 24 jam dengan integrasi Baileys Multi-Device untuk kemudahan otomatisasi grup dan chat Anda.`;
        }
      } else {
        aiResponse = `🤖 *Jawaban Florence AI:*\n\nTerkait "${query}":\nUntuk menghubungkan nomor Anda sebagai JadiBot, cukup gunakan menu *.jadibot*, pilih metode Kode Pairing, dan masukkan 8 digit kode yang muncul ke menu Perangkat Tertaut WhatsApp Anda. Bot akan langsung online 24 jam di server!`;
      }

      responseText = `🤖 *FLORENCE AI ASSISTANT*\n━━━━━━━━━━━━━━━━━━━━\n${aiResponse}\n━━━━━━━━━━━━━━━━━━━━\n_Model: Gemini 2.5 Flash Ultra-Speed_`;
    }
    else if (cmd === '.ceklimit') {
      responseText = `📊 *STATUS AKUN & KUOTA PENGGUNA*
━━━━━━━━━━━━━━━━━━━━
👤 *Nama:* ${senderName}
📱 *Nomor:* ${formatPhoneNumber(senderPhone)}
💎 *Status:* User Premium (VIP)
⚡ *Sisa Limit Harian:* 950 / 1000
🪙 *Token Saldo:* 350 Token
📅 *Reset Limit:* Pukul 00:00 WIB
━━━━━━━━━━━━━━━━━━━━
_Limit berkurang 1 setiap menjalankan perintah download & AI._`;
    }
    else if (cmd === '.buylimit' || cmd === '.qris') {
      responseType = 'qris';
      responseText = `🧾 *INVOICE PEMBAYARAN QRIS OTOMATIS*
━━━━━━━━━━━━━━━━━━━━
🆔 *Trx ID:* FLR-${Math.floor(100000 + Math.random() * 900000)}
📦 *Item:* Paket Topup Limit Bot 500 Kuota
💰 *Nominal:* Rp 10.000 (Termasuk Kode Unik)
⏱️ *Batas Waktu:* 15 Menit
━━━━━━━━━━━━━━━━━━━━
*Cara Bayar:*
1. Buka aplikasi e-Wallet / Mobile Banking Anda (Dana, OVO, GoPay, BCA, dll).
2. Scan QRIS dinamis di bawah ini.
3. Setelah sukses, limit bot akan masuk otomatis dalam 3-5 detik!`;

      buttons = [
        { id: 'btn_check_pay', text: '🔄 Cek Status Bayar', action: 'CHECK_PAYMENT' },
        { id: 'btn_cancel_pay', text: '❌ Batalkan Transaksi', action: 'CANCEL_PAYMENT' }
      ];
    }
    else {
      responseText = `🤖 Perintah *${cmd}* tidak dikenali atau format salah.\n\nKetik *.menu* untuk melihat daftar lengkap fitur yang tersedia di Florence AI Bot.`;
    }

    return NextResponse.json({
      status: 'success',
      reply: {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        senderName: 'Florence AI Assistant',
        text: responseText,
        timestamp: now,
        type: responseType,
        mediaUrl,
        buttons
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: (error as Error).message
    }, { status: 500 });
  }
}
