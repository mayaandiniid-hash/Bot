export type ServerState = 'running' | 'stopped' | 'restarting' | 'error';

export interface ServerMetrics {
  uptimeSeconds: number;
  cpuUsage: number; // percentage 0-100
  memoryUsedMB: number;
  memoryTotalMB: number;
  pingMs: number;
  totalMessagesProcessed: number;
  totalCommandsExecuted: number;
  activeJadiBots: number;
  totalGroups: number;
  startedAt: string;
}

export interface JadiBotSession {
  id: string;
  phoneNumber: string;
  pushName: string;
  status: 'connected' | 'connecting' | 'idle' | 'expired' | 'disconnected';
  connectedAt: string;
  expiresAt: string;
  batteryLevel: number;
  isCharging: boolean;
  platform: 'Android' | 'iOS' | 'Desktop' | 'Web';
  messagesSent: number;
  limitQuota: number;
  tokenBalance: number;
  planType: 'Free Trial' | 'Sewa 7 Hari' | 'Sewa 30 Hari' | 'VIP Permanent';
  autoReboot: boolean;
  profilePicUrl?: string;
  lastActive: string;
}

export interface PairingRequest {
  phoneNumber: string;
  pairingCode: string;
  qrCodeUrl: string;
  expiresAt: number;
  status: 'pending' | 'paired' | 'timeout';
  requestedAt: number;
  mode: 'pairing_code' | 'qr_code';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'baileys' | 'command' | 'jadibot';
  tag: string;
  message: string;
  details?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  senderName: string;
  senderPhone?: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'sticker' | 'buttons' | 'qris' | 'location' | 'audio';
  mediaUrl?: string;
  caption?: string;
  quotedMessage?: {
    sender: string;
    text: string;
  };
  buttons?: { id: string; text: string; action: string }[];
  status?: 'sent' | 'delivered' | 'read';
}

export interface BotCommand {
  name: string;
  category: 'ai' | 'maker' | 'group' | 'download' | 'owner' | 'utility' | 'store' | 'search' | 'random' | 'addons';
  description: string;
  usage: string;
  limitCost: number;
  isPremium?: boolean;
  isOwnerOnly?: boolean;
  isGroupOnly?: boolean;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  updatedAt?: string;
  children?: FileItem[];
  content?: string;
}
