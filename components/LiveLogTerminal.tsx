'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Search, 
  Pause, 
  Play, 
  Filter, 
  Copy, 
  Check,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { LogEntry } from '@/types/bot';

interface LiveLogTerminalProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onAddSimulatedLog: () => void;
}

export const LiveLogTerminal: React.FC<LiveLogTerminalProps> = ({
  logs,
  onClearLogs,
  onAddSimulatedLog
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = !searchQuery.trim() || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'baileys': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'jadibot': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'command': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'warn': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'error': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'success': return 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30';
      default: return 'bg-slate-700/40 text-slate-300 border-slate-700';
    }
  };

  const handleCopyLogs = () => {
    const logText = filteredLogs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.tag}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const logText = filteredLogs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.tag}] ${l.message}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `florence-bot-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-slate-200">
            root@florence-server:~/logs# (Live Stream)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold font-mono">
            {filteredLogs.length} Lines
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter teks log..."
              className="pl-8 pr-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono w-36 sm:w-44"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Level</option>
            <option value="baileys">Baileys WA</option>
            <option value="jadibot">JadiBot Session</option>
            <option value="command">Command Inbound</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              isPaused ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isPaused ? 'Lanjutkan Auto Scroll' : 'Jeda Auto Scroll'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onAddSimulatedLog}
            className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs transition-all"
            title="Simulasikan Pesan Masuk"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-all"
            title="Salin Log"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-all"
            title="Unduh File Log .txt"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs transition-all"
            title="Bersihkan Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 bg-slate-950 select-text">
        {filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            Tidak ada log yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/50 px-2 py-0.5 rounded transition-colors">
              <span className="text-slate-400 select-none text-[11px] font-mono">
                {log.timestamp}
              </span>

              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${getBadgeColor(log.level)}`}>
                {log.tag}
              </span>

              <span className={`flex-1 break-all ${
                log.level === 'error' ? 'text-rose-400 font-semibold' :
                log.level === 'warn' ? 'text-amber-300' :
                log.level === 'success' ? 'text-emerald-300 font-medium' :
                log.level === 'baileys' ? 'text-purple-300' :
                log.level === 'jadibot' ? 'text-cyan-300 font-medium' :
                'text-slate-200'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer Info */}
      <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Daemon Pipe stdout/stderr terhubung secara asinkron.</span>
        </span>
        <span className="font-mono text-slate-400">Encoding: UTF-8 CRLF</span>
      </div>

    </div>
  );
};
