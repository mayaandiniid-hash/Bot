'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  FileJson, 
  FileText, 
  Search, 
  Upload, 
  Download, 
  Save, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  FolderPlus, 
  FilePlus, 
  Play, 
  ShieldAlert,
  Code
} from 'lucide-react';
import { FileItem } from '@/types/bot';
import { FLORENCE_FILE_TREE } from '@/lib/bot-data';

interface FileManagerProps {
  onTriggerLog: (level: 'info' | 'success', tag: string, msg: string) => void;
}

const SAMPLE_CODE_SNIPPETS: Record<string, string> = {
  '/config.js': `// Florence AI HF166 - Master Configuration
module.exports = {
  ownerNumber: ['6285812349876@s.whatsapp.net'],
  botName: 'Florence AI Master',
  ownerName: 'Maya Andini',
  pairingMode: true, // Enables Baileys Pairing Code without QR
  autoRead: false,
  autoTyping: true,
  autoRestart24h: true,
  sessionDir: './session',
  databasePath: './database',
  prefix: '.',
  limitPerDay: 50,
  starlightBenefits: true
};`,
  '/commands/store/jadibot.js': `// Florence AI - JadiBot Module with Baileys Pairing Code & Barcode
const { generatePairingCode, createJadiBotSocket } = require('../../lib/jadibotManager');

module.exports = {
  name: 'jadibot',
  category: 'store',
  desc: 'Buka sesi sub-bot WhatsApp via Pairing Code atau QR Scan 24 Jam',
  async execute(m, { sock, args, text, prefix, command }) {
    await sock.sendMessage(m.chat, {
      text: \`🤖 *LAYANAN OPEN JADIBOT 24 JAM*\\n\\nSilakan kunjungi dashboard server web atau ketik nomor Anda dengan format:\\n*\${prefix}pairing 628xxxxxxxxxx* untuk mendapatkan 8-digit kode pairing!\`,
      footer: 'Florence AI Multi-Device v6.7',
      buttons: [
        { buttonId: 'btn_pairing', buttonText: { displayText: '🔢 Minta Kode Pairing' }, type: 1 },
        { buttonId: 'btn_qr', buttonText: { displayText: '📷 Scan Barcode' }, type: 1 }
      ]
    }, { quoted: m });
  }
};`,
  '/commands/ai/askme.js': `// Florence AI - AskMe Gemini Intelligence
const { GoogleGenAI } = require('@google/genai');

module.exports = {
  name: 'askme',
  category: 'ai',
  desc: 'Asisten AI cerdas multi-turn memory',
  async execute(m, { text }) {
    if (!text) return m.reply('Silakan ketik pertanyaan Anda.');
    m.reply('🤖 Florence AI sedang memikirkan jawaban...');
    // Calls AI server proxy
  }
};`,
  '/.env': `PORT=3000
NODE_ENV=production
BOT_PHONE=6285812349876
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
DATABASE_SYNC_INTERVAL=30000
JADIBOT_MAX_SLOTS=20
AUTO_REBOOT_24H=true`
};

export const FileManager: React.FC<FileManagerProps> = ({ onTriggerLog }) => {
  const [selectedPath, setSelectedPath] = useState('/commands/store/jadibot.js');
  const [fileContent, setFileContent] = useState(SAMPLE_CODE_SNIPPETS['/commands/store/jadibot.js']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '/': true,
    '/commands': true,
    '/commands/store': true,
    '/commands/ai': true,
    '/commands/maker': false,
    '/commands/download': false,
    '/lib': false,
    '/database': false
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleSelectFile = (file: FileItem) => {
    if (file.type === 'folder') {
      toggleFolder(file.path);
      return;
    }

    setSelectedPath(file.path);
    if (SAMPLE_CODE_SNIPPETS[file.path]) {
      setFileContent(SAMPLE_CODE_SNIPPETS[file.path]);
    } else {
      setFileContent(`// Script file: ${file.name}
// Location: ${file.path}
// Florence AI HF166 System Module

module.exports = {
  name: '${file.name.replace('.js', '')}',
  category: '${file.path.split('/')[2] || 'utility'}',
  async execute(m, { sock, args }) {
    // Module handler executed 24/7 on server
    m.reply('Perintah [${file.name.replace('.js', '')}] aktif!');
  }
};`);
    }
  };

  const handleSaveFile = () => {
    setIsSaved(true);
    onTriggerLog('success', 'FILE_MANAGER', `File [${selectedPath}] berhasil diperbarui dan dimuat ulang ke memory.`);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleUploadSimulate = () => {
    const fileName = `custom_command_${Date.now().toString().slice(-4)}.js`;
    onTriggerLog('info', 'UPLOAD', `Script baru [${fileName}] berhasil diunggah ke /commands/addons/`);
    alert(`File script ${fileName} berhasil diunggah ke direktori bot!`);
  };

  const renderTree = (node: FileItem, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedPath === node.path;

    // Filter search
    if (searchQuery.trim() && !node.name.toLowerCase().includes(searchQuery.toLowerCase()) && !isFolder) {
      return null;
    }

    return (
      <div key={node.path} className="select-none">
        <div
          onClick={() => handleSelectFile(node)}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer text-xs transition-all ${
            isSelected
              ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {isFolder ? (
              <>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
              </>
            ) : node.name.endsWith('.json') ? (
              <FileJson className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : node.name.endsWith('.env') ? (
              <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <FileCode className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </div>

          {node.size && (
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              {(node.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <span>Manajer Script & File Bot (Florence AI HF166)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kelola, edit konfigurasi, serta unggah plugin / fitur baru langsung ke server.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Script (.js / .zip)</span>
            <input type="file" className="hidden" onChange={handleUploadSimulate} />
          </label>

          <button
            onClick={handleSaveFile}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Explorer Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Tree Explorer */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 h-[580px] flex flex-col">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari file / command..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 border border-slate-800/80 rounded-xl p-2 bg-slate-950/60">
            {renderTree(FLORENCE_FILE_TREE)}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total: 86 Modul</span>
            <span className="text-emerald-400 font-semibold">Hot-Reload: Active</span>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[580px]">
          
          {/* Tab Header */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-slate-200 font-semibold">{selectedPath}</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">JavaScript • UTF-8</span>
          </div>

          {/* Text Area Code Editor */}
          <div className="flex-1 relative bg-slate-950 flex">
            {/* Fake Line Numbers */}
            <div className="w-10 bg-slate-900/40 border-r border-slate-800/60 py-3 text-right pr-2 select-none text-[11px] font-mono text-slate-400 font-medium">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="leading-5">{i + 1}</div>
              ))}
            </div>

            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full h-full bg-transparent text-slate-100 font-mono text-xs leading-5 p-3 resize-none focus:outline-none selection:bg-emerald-500/30"
            />
          </div>

          {/* Editor Footer */}
          <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Perubahan akan langsung diterapkan ke bot tanpa memutus sesi WhatsApp.</span>
            <span className="text-emerald-400">Auto-Syntax Validator OK</span>
          </div>
        </div>

      </div>

    </div>
  );
};
