import { NextRequest, NextResponse } from 'next/server';

// In-memory runtime state for development & preview
let serverState: 'running' | 'stopped' | 'restarting' | 'error' = 'running';
let serverStartedAt = Date.now() - 3600 * 48 * 1000; // 48 hours ago
let totalMessages = 28450;
let totalCommands = 12930;

export async function GET() {
  const uptimeSeconds = serverState === 'running' ? Math.floor((Date.now() - serverStartedAt) / 1000) : 0;
  
  return NextResponse.json({
    status: 'success',
    serverState,
    metrics: {
      uptimeSeconds,
      cpuUsage: serverState === 'running' ? Math.floor(12 + Math.random() * 15) : 0,
      memoryUsedMB: serverState === 'running' ? Math.floor(198 + Math.random() * 30) : 18,
      memoryTotalMB: 512,
      pingMs: serverState === 'running' ? Math.floor(28 + Math.random() * 25) : 999,
      totalMessagesProcessed: totalMessages,
      totalCommandsExecuted: totalCommands,
      activeJadiBots: serverState === 'running' ? 3 : 0,
      totalGroups: 42,
      startedAt: new Date(serverStartedAt).toISOString(),
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'start') {
      serverState = 'running';
      serverStartedAt = Date.now();
    } else if (action === 'stop') {
      serverState = 'stopped';
    } else if (action === 'restart') {
      serverState = 'restarting';
      setTimeout(() => {
        serverState = 'running';
        serverStartedAt = Date.now();
      }, 1500);
    } else if (action === 'increment_stats') {
      totalMessages += body.messages || 1;
      totalCommands += body.commands || 1;
    }

    return NextResponse.json({
      status: 'success',
      serverState,
      message: `Action '${action}' executed successfully.`
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: (error as Error).message }, { status: 500 });
  }
}
