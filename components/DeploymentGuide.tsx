'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  Cloud, 
  Cpu, 
  ShieldCheck, 
  BookOpen, 
  Zap,
  Code,
  Globe,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelCommands = `# 1. Install Vercel CLI secara global (jika belum ada)
npm i -g vercel

# 2. Login ke akun Vercel
vercel login

# 3. Deploy langsung ke Vercel Production
vercel --prod

# 4. Tambahkan Environment Variable di Vercel Dashboard:
# GEMINI_API_KEY = "your_gemini_api_key"
# NEXT_PUBLIC_SITE_URL = "https://your-app.vercel.app"`;

  const netlifyCommands = `# 1. Install Netlify CLI secara global
npm i -g netlify-cli

# 2. Login ke akun Netlify
netlify login

# 3. Inisialisasi & Build Next.js App Router
npm run build

# 4. Deploy langsung ke Netlify Production
netlify deploy --prod --dir=.next

# Atau hubungkan repositori GitHub Anda ke Netlify Dashboard:
# Build command: npm run build
# Publish directory: .next`;

  const vpsCommands = `# 1. Update paket server Linux (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y
sudo apt install -y git ffmpeg nodejs npm imagemagick libwebp-tools

# 2. Install PM2 Process Manager untuk berjalan 24 Jam di latar belakang
sudo npm install -g pm2

# 3. Clone / Masuk ke direktori bot & install dependensi
cd FLORENCE-AI-HF166-OWNER-HAPUSLIMIT-NOTIFICATION-FINAL
npm install

# 4. Jalankan Bot WhatsApp & Web Portal secara permanen 24 Jam dengan PM2
pm2 start index.js --name "florence-wa-bot" --time --max-memory-restart 500M

# 5. Konfigurasikan agar bot otomatis menyala jika server restart/reboot
pm2 startup
pm2 save

# 6. Pantau logs secara live
pm2 logs florence-wa-bot`;

  const vercelConfig = `// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "regions": ["sin1", "hnd1", "iad1"]
}`;

  const netlifyConfig = `# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"`;

  const ecosystemConfig = `// ecosystem.config.js - PM2 Production Configuration
module.exports = {
  apps: [{
    name: 'florence-wa-bot',
    script: 'index.js',
    watch: false,
    max_memory_restart: '512M',
    restart_delay: 3000,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      AUTO_REBOOT_24H: 'true'
    }
  }]
};`;

  const dockerfileCode = `# Dockerfile for 24/7 WhatsApp Bot & Next.js Web
FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y \\
    ffmpeg \\
    imagemagick \\
    webp \\
    git \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Panduan Deploy & Hosting Website 24 Jam</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Deploy Website Pairing Code & WhatsApp Bot ke Vercel, Netlify, atau VPS
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Website ini dapat dihosting dengan mudah ke platform cloud modern seperti Vercel dan Netlify secara gratis, atau dijalankan 24 jam non-stop di VPS Linux (Ubuntu / Debian).
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* VERCEL DEPLOYMENT */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-black border border-slate-700 flex items-center justify-center text-white text-xs font-black">
                ▲
              </div>
              <span>1. Deploy ke Vercel (Gratis & Cepat)</span>
            </h3>
            <button
              onClick={() => copyText(vercelCommands, 'vercel')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
            >
              {copiedSection === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'vercel' ? 'Tersalin' : 'Salin Perintah'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Vercel adalah platform paling optimal untuk Next.js. File <code className="text-emerald-400 font-mono">vercel.json</code> sudah otomatis tersedia di dalam project ini.
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            {vercelCommands}
          </pre>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-slate-200">Tips Vercel:</span>
            <p>• Hubungkan repository GitHub ke <strong>vercel.com/new</strong> untuk auto-deploy setiap kali push kode.</p>
            <p>• Tambahkan Environment Variable <code className="text-emerald-400">GEMINI_API_KEY</code> di menu Settings &gt; Environment Variables.</p>
          </div>
        </div>

        {/* NETLIFY DEPLOYMENT */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-900/50 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-black">
                ◆
              </div>
              <span>2. Deploy ke Netlify</span>
            </h3>
            <button
              onClick={() => copyText(netlifyCommands, 'netlify')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
            >
              {copiedSection === 'netlify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'netlify' ? 'Tersalin' : 'Salin Perintah'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Netlify mendukung Next.js App Router secara native dengan file konfigurasi <code className="text-cyan-400 font-mono">netlify.toml</code> yang sudah disiapkan.
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            {netlifyCommands}
          </pre>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-slate-200">Tips Netlify:</span>
            <p>• Install plugin <code className="text-cyan-400">@netlify/plugin-nextjs</code> yang sudah terkonfigurasi di <code className="text-cyan-400">netlify.toml</code>.</p>
            <p>• Deploy via Netlify Dashboard dengan memilih Framework: <strong>Next.js</strong>.</p>
          </div>
        </div>

        {/* METHOD 3: VPS Linux with PM2 24/7 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>3. VPS Linux (Ubuntu / Debian + PM2 24 Jam)</span>
            </h3>
            <button
              onClick={() => copyText(vpsCommands, 'vps')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
            >
              {copiedSection === 'vps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'vps' ? 'Tersalin' : 'Salin Perintah'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Jika ingin menjalankan WhatsApp Baileys background daemon secara native bersama web server di VPS.
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto leading-relaxed">
            {vpsCommands}
          </pre>
        </div>

        {/* METHOD 4: Docker & Cloud Containers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-purple-400" />
              <span>4. Docker Container (Railway / Render / Fly.io)</span>
            </h3>
            <button
              onClick={() => copyText(dockerfileCode, 'docker')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
            >
              {copiedSection === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'docker' ? 'Tersalin' : 'Salin Dockerfile'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Deploy satu container lengkap dengan FFmpeg, libwebp, dan Node.js 20 untuk fitur sticker dan media downloader.
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto leading-relaxed">
            {dockerfileCode}
          </pre>
        </div>

      </div>

    </div>
  );
};
