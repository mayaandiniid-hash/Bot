import { BotCommand, FileItem, JadiBotSession, LogEntry } from '@/types/bot';

export const INITIAL_COMMANDS: BotCommand[] = [
  // AI
  { name: '.ai', category: 'ai', description: 'Tanya kecerdasan buatan Gemini / GPT', usage: '.ai <pertanyaan>', limitCost: 1 },
  { name: '.gpt4o', category: 'ai', description: 'Chat dengan model GPT-4o Turbo', usage: '.gpt4o <prompt>', limitCost: 2 },
  { name: '.askme', category: 'ai', description: 'Asisten pintar multi-turn memory', usage: '.askme <pesan>', limitCost: 1 },
  { name: '.aitable', category: 'ai', description: 'Generate format tabel cerdas', usage: '.aitable <topik>', limitCost: 1 },

  // JadiBot & Store
  { name: '.jadibot', category: 'store', description: 'Minta kode pairing / QR untuk jadikan nomor Anda sebagai bot', usage: '.jadibot', limitCost: 0 },
  { name: '.sewabot', category: 'store', description: 'Informasi dan paket sewa bot grup', usage: '.sewabot', limitCost: 0 },
  { name: '.ceksewa', category: 'store', description: 'Cek sisa masa aktif sewa bot di grup', usage: '.ceksewa', limitCost: 0 },
  { name: '.buylimit', category: 'store', description: 'Beli limit bot instan via QRIS Otomatis', usage: '.buylimit <jumlah>', limitCost: 0 },
  { name: '.token', category: 'store', description: 'Beli & tukar token saldo bot', usage: '.token', limitCost: 0 },

  // Maker
  { name: '.sticker', category: 'maker', description: 'Ubah gambar / video pendek menjadi stiker WA', usage: '.sticker (reply gambar)', limitCost: 1 },
  { name: '.brat', category: 'maker', description: 'Buat stiker teks gaya meme Brat', usage: '.brat <teks>', limitCost: 1 },
  { name: '.bratvid', category: 'maker', description: 'Buat stiker animasi video teks Brat', usage: '.bratvid <teks>', limitCost: 2 },
  { name: '.hd', category: 'maker', description: 'Tingkatkan resolusi & kejernihan foto (Remini)', usage: '.hd (reply foto)', limitCost: 2 },
  { name: '.qwa', category: 'maker', description: 'Buat stiker quote chat WhatsApp palsu', usage: '.qwa <teks>', limitCost: 1 },
  { name: '.removebg', category: 'maker', description: 'Hapus latar belakang foto otomatis', usage: '.removebg (reply foto)', limitCost: 2 },

  // Download
  { name: '.tiktok', category: 'download', description: 'Unduh video TikTok tanpa watermark (HD)', usage: '.tiktok <url>', limitCost: 1 },
  { name: '.instagram', category: 'download', description: 'Unduh Reels / Foto / Story IG', usage: '.instagram <url>', limitCost: 1 },
  { name: '.ytmp4', category: 'download', description: 'Unduh video YouTube resolusi tinggi', usage: '.ytmp4 <url>', limitCost: 1 },
  { name: '.ytmp3', category: 'download', description: 'Unduh audio musik YouTube MP3', usage: '.ytmp3 <url>', limitCost: 1 },
  { name: '.play', category: 'download', description: 'Putar & unduh lagu otomatis dari judul', usage: '.play <judul lagu>', limitCost: 1 },
  { name: '.spotify', category: 'download', description: 'Download lagu dari link Spotify', usage: '.spotify <url>', limitCost: 1 },

  // Group
  { name: '.hidetag', category: 'group', description: 'Tag seluruh anggota grup secara tersembunyi', usage: '.hidetag <pesan>', limitCost: 0, isGroupOnly: true },
  { name: '.tagall', category: 'group', description: 'Mention semua member grup dalam daftar', usage: '.tagall <alasan>', limitCost: 0, isGroupOnly: true },
  { name: '.kick', category: 'group', description: 'Keluarkan member dari grup', usage: '.kick @user', limitCost: 0, isGroupOnly: true },
  { name: '.add', category: 'group', description: 'Undang nomor baru ke grup', usage: '.add 628xxx', limitCost: 0, isGroupOnly: true },
  { name: '.promote', category: 'group', description: 'Jadikan member sebagai admin grup', usage: '.promote @user', limitCost: 0, isGroupOnly: true },
  { name: '.demote', category: 'group', description: 'Turunkan admin menjadi member biasa', usage: '.demote @user', limitCost: 0, isGroupOnly: true },
  { name: '.welcome', category: 'group', description: 'Aktifkan/nonaktifkan pesan sambutan member baru', usage: '.welcome on/off', limitCost: 0, isGroupOnly: true },
  { name: '.groupinfo', category: 'group', description: 'Lihat info lengkap grup & setting keamanan', usage: '.groupinfo', limitCost: 0, isGroupOnly: true },

  // Owner
  { name: '.addowner', category: 'owner', description: 'Tambahkan nomor owner bot baru', usage: '.addowner 628xxx', limitCost: 0, isOwnerOnly: true },
  { name: '.restart', category: 'owner', description: 'Restart server bot secara halus', usage: '.restart', limitCost: 0, isOwnerOnly: true },
  { name: '.addlimit', category: 'owner', description: 'Tambah saldo limit ke pengguna', usage: '.addlimit @user <jumlah>', limitCost: 0, isOwnerOnly: true },
  { name: '.hapuslimit', category: 'owner', description: 'Reset / kurangi limit pengguna', usage: '.hapuslimit @user <jumlah>', limitCost: 0, isOwnerOnly: true },
  { name: '.pairingcode', category: 'owner', description: 'Koneksikan bot dengan kode pairing Baileys', usage: '.pairingcode 628xxx', limitCost: 0, isOwnerOnly: true },

  // Utility
  { name: '.ping', category: 'utility', description: 'Cek kecepatan respon bot & server latency', usage: '.ping', limitCost: 0 },
  { name: '.runtime', category: 'utility', description: 'Lihat durasi server bot aktif berjalan 24 jam', usage: '.runtime', limitCost: 0 },
  { name: '.ceklimit', category: 'utility', description: 'Cek sisa limit harian dan status akun', usage: '.ceklimit', limitCost: 0 },
  { name: '.owner', category: 'utility', description: 'Kirim kontak resmi owner bot WhatsApp', usage: '.owner', limitCost: 0 },
  { name: '.menu', category: 'utility', description: 'Tampilkan seluruh menu & fitur bot', usage: '.menu', limitCost: 0 }
];

export const INITIAL_JADIBOTS: JadiBotSession[] = [
  {
    id: 'jb-master-01',
    phoneNumber: '6285812349876',
    pushName: 'Florence AI Master Bot #1',
    status: 'connected',
    connectedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    expiresAt: '2099-12-31T23:59:59Z',
    batteryLevel: 94,
    isCharging: true,
    platform: 'Android',
    messagesSent: 14820,
    limitQuota: 99999,
    tokenBalance: 50000,
    planType: 'VIP Permanent',
    autoReboot: true,
    lastActive: 'Baru saja'
  },
  {
    id: 'jb-sub-02',
    phoneNumber: '6281298765432',
    pushName: 'Naufal - Bot Store Group',
    status: 'connected',
    connectedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 24 * 3600 * 1000).toISOString(),
    batteryLevel: 78,
    isCharging: false,
    platform: 'Web',
    messagesSent: 3410,
    limitQuota: 500,
    tokenBalance: 120,
    planType: 'Sewa 30 Hari',
    autoReboot: true,
    lastActive: '2 menit lalu'
  },
  {
    id: 'jb-sub-03',
    phoneNumber: '6287765432109',
    pushName: 'Maya Gaming Community Bot',
    status: 'connected',
    connectedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    batteryLevel: 62,
    isCharging: true,
    platform: 'iOS',
    messagesSent: 1240,
    limitQuota: 250,
    tokenBalance: 45,
    planType: 'Sewa 7 Hari',
    autoReboot: true,
    lastActive: '5 menit lalu'
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString('id-ID'),
    level: 'info',
    tag: 'SERVER',
    message: 'Daemon WhatsApp Multi-Device 24/7 Engine initialized successfully on port 3000.'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 95000).toLocaleTimeString('id-ID'),
    level: 'baileys',
    tag: 'BAILEYS',
    message: 'Master socket connected: wa-version=2.3000.1015, protocol=MultiDevice'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 70000).toLocaleTimeString('id-ID'),
    level: 'jadibot',
    tag: 'JADIBOT',
    message: 'Sub-bot session [6281298765432] state synched. Auto-reconnect worker active.'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 45000).toLocaleTimeString('id-ID'),
    level: 'command',
    tag: 'COMMAND',
    message: 'User @6281298765432 executed command [.menu] in group [Komunitas Gamer ID]'
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 15000).toLocaleTimeString('id-ID'),
    level: 'success',
    tag: 'HEALTH',
    message: 'Auto keep-alive ping heartbeat OK. 0 memory leaks detected. Uptime: 99.98%.'
  }
];

export const FLORENCE_FILE_TREE: FileItem = {
  name: 'FLORENCE-AI-HF166-OWNER-HAPUSLIMIT-NOTIFICATION',
  path: '/',
  type: 'folder',
  children: [
    {
      name: 'commands',
      path: '/commands',
      type: 'folder',
      children: [
        {
          name: 'ai',
          path: '/commands/ai',
          type: 'folder',
          children: [
            { name: 'askme.js', path: '/commands/ai/askme.js', type: 'file', size: 2450, updatedAt: '2026-09-22' },
            { name: 'gpt4o.js', path: '/commands/ai/gpt4o.js', type: 'file', size: 1890, updatedAt: '2026-09-22' },
            { name: 'aitable.js', path: '/commands/ai/aitable.js', type: 'file', size: 2100, updatedAt: '2026-09-22' },
            { name: 'askmeclear.js', path: '/commands/ai/askmeclear.js', type: 'file', size: 1200, updatedAt: '2026-09-22' }
          ]
        },
        {
          name: 'download',
          path: '/commands/download',
          type: 'folder',
          children: [
            { name: 'tiktok.js', path: '/commands/download/tiktok.js', type: 'file', size: 3100, updatedAt: '2026-09-22' },
            { name: 'instagram.js', path: '/commands/download/instagram.js', type: 'file', size: 2800, updatedAt: '2026-09-22' },
            { name: 'ytmp3.js', path: '/commands/download/ytmp3.js', type: 'file', size: 2600, updatedAt: '2026-09-22' },
            { name: 'ytmp4.js', path: '/commands/download/ytmp4.js', type: 'file', size: 2700, updatedAt: '2026-09-22' },
            { name: 'play.js', path: '/commands/download/play.js', type: 'file', size: 2200, updatedAt: '2026-09-22' },
            { name: 'spotify.js', path: '/commands/download/spotify.js', type: 'file', size: 2900, updatedAt: '2026-09-22' }
          ]
        },
        {
          name: 'group',
          path: '/commands/group',
          type: 'folder',
          children: [
            { name: 'hidetag.js', path: '/commands/group/hidetag.js', type: 'file', size: 1950, updatedAt: '2026-09-22' },
            { name: 'tagall.js', path: '/commands/group/tagall.js', type: 'file', size: 1800, updatedAt: '2026-09-22' },
            { name: 'kick.js', path: '/commands/group/kick.js', type: 'file', size: 1400, updatedAt: '2026-09-22' },
            { name: 'add.js', path: '/commands/group/add.js', type: 'file', size: 1500, updatedAt: '2026-09-22' },
            { name: 'welcome.js', path: '/commands/group/welcome.js', type: 'file', size: 2300, updatedAt: '2026-09-22' },
            { name: 'setrules.js', path: '/commands/group/setrules.js', type: 'file', size: 1650, updatedAt: '2026-09-22' },
            { name: 'warn.js', path: '/commands/group/warn.js', type: 'file', size: 2100, updatedAt: '2026-09-22' }
          ]
        },
        {
          name: 'maker',
          path: '/commands/maker',
          type: 'folder',
          children: [
            { name: 'sticker.js', path: '/commands/maker/sticker.js', type: 'file', size: 3400, updatedAt: '2026-09-22' },
            { name: 'brat.js', path: '/commands/maker/brat.js', type: 'file', size: 2800, updatedAt: '2026-09-22' },
            { name: 'bratvid.js', path: '/commands/maker/bratvid.js', type: 'file', size: 3900, updatedAt: '2026-09-22' },
            { name: 'hd.js', path: '/commands/maker/hd.js', type: 'file', size: 2500, updatedAt: '2026-09-22' },
            { name: 'qwa.js', path: '/commands/maker/qwa.js', type: 'file', size: 2200, updatedAt: '2026-09-22' }
          ]
        },
        {
          name: 'owner',
          path: '/commands/owner',
          type: 'folder',
          children: [
            { name: 'pairingcode.js', path: '/commands/owner/pairingcode.js', type: 'file', size: 3200, updatedAt: '2026-09-22' },
            { name: 'addlimit.js', path: '/commands/owner/addlimit.js', type: 'file', size: 1800, updatedAt: '2026-09-22' },
            { name: 'hapuslimit.js', path: '/commands/owner/hapuslimit.js', type: 'file', size: 1900, updatedAt: '2026-09-22' },
            { name: 'restart.js', path: '/commands/owner/restart.js', type: 'file', size: 1200, updatedAt: '2026-09-22' },
            { name: 'addowner.js', path: '/commands/owner/addowner.js', type: 'file', size: 1400, updatedAt: '2026-09-22' },
            { name: 'backup.js', path: '/commands/owner/backup.js', type: 'file', size: 2100, updatedAt: '2026-09-22' }
          ]
        },
        {
          name: 'store',
          path: '/commands/store',
          type: 'folder',
          children: [
            { name: 'jadibot.js', path: '/commands/store/jadibot.js', type: 'file', size: 4100, updatedAt: '2026-09-22' },
            { name: 'sewabot.js', path: '/commands/store/sewabot.js', type: 'file', size: 3300, updatedAt: '2026-09-22' },
            { name: 'paymentFlow.js', path: '/commands/store/paymentFlow.js', type: 'file', size: 4800, updatedAt: '2026-09-22' },
            { name: 'store.js', path: '/commands/store/store.js', type: 'file', size: 3600, updatedAt: '2026-09-22' }
          ]
        },
        { name: 'menu.js', path: '/commands/menu.js', type: 'file', size: 5600, updatedAt: '2026-09-22' }
      ]
    },
    {
      name: 'lib',
      path: '/lib',
      type: 'folder',
      children: [
        { name: 'jadibotManager.js', path: '/lib/jadibotManager.js', type: 'file', size: 7200, updatedAt: '2026-09-22' },
        { name: 'pairingRecovery.js', path: '/lib/pairingRecovery.js', type: 'file', size: 4500, updatedAt: '2026-09-22' },
        { name: 'buatQrisGateway.js', path: '/lib/buatQrisGateway.js', type: 'file', size: 5100, updatedAt: '2026-09-22' },
        { name: 'buttons-singlebubble.js', path: '/lib/buttons-singlebubble.js', type: 'file', size: 3800, updatedAt: '2026-09-22' },
        { name: 'serialize.js', path: '/lib/serialize.js', type: 'file', size: 6200, updatedAt: '2026-09-22' },
        { name: 'connectionSupervisor.js', path: '/lib/connectionSupervisor.js', type: 'file', size: 4900, updatedAt: '2026-09-22' }
      ]
    },
    {
      name: 'database',
      path: '/database',
      type: 'folder',
      children: [
        { name: 'users.json', path: '/database/users.json', type: 'file', size: 12400, updatedAt: '2026-09-22' },
        { name: 'jadibot.json', path: '/database/jadibot.json', type: 'file', size: 8900, updatedAt: '2026-09-22' },
        { name: 'groups.json', path: '/database/groups.json', type: 'file', size: 15400, updatedAt: '2026-09-22' },
        { name: 'settings.json', path: '/database/settings.json', type: 'file', size: 3200, updatedAt: '2026-09-22' },
        { name: 'tokens.json', path: '/database/tokens.json', type: 'file', size: 4100, updatedAt: '2026-09-22' }
      ]
    },
    { name: 'config.js', path: '/config.js', type: 'file', size: 4200, updatedAt: '2026-09-22' },
    { name: 'index.js', path: '/index.js', type: 'file', size: 6800, updatedAt: '2026-09-22' },
    { name: 'package.json', path: '/package.json', type: 'file', size: 1850, updatedAt: '2026-09-22' },
    { name: '.env', path: '/.env', type: 'file', size: 950, updatedAt: '2026-09-22' }
  ]
};

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.startsWith('62') && cleaned.length >= 10) {
    const p1 = cleaned.slice(0, 2);
    const p2 = cleaned.slice(2, 5);
    const p3 = cleaned.slice(5, 9);
    const p4 = cleaned.slice(9);
    return `+${p1} ${p2}-${p3}-${p4}`;
  }
  return `+${cleaned}`;
}

export function generatePairingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${part1}-${part2}`;
}
