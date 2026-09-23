import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { cleanPhoneNumber, generatePairingCode, formatPhoneNumber } from '@/lib/bot-data';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, mode = 'pairing_code' } = await req.json();

    if (!phoneNumber && mode === 'pairing_code') {
      return NextResponse.json({
        status: 'error',
        message: 'Nomor WhatsApp wajib diisi untuk meminta kode pairing!'
      }, { status: 400 });
    }

    const cleaned = cleanPhoneNumber(phoneNumber || '6285812349876');

    if (mode === 'pairing_code' && (cleaned.length < 9 || cleaned.length > 16)) {
      return NextResponse.json({
        status: 'error',
        message: 'Format nomor tidak valid. Masukkan nomor dengan awalan 62 atau 08 (contoh: 6281234567890).'
      }, { status: 400 });
    }

    const pairingCode = generatePairingCode();
    const sessionId = `jb_${cleaned}_${Date.now()}`;
    const rawQrString = `2@${Buffer.from(sessionId).toString('base64')},${Buffer.from(pairingCode).toString('base64')},${Date.now()}`;
    
    // Generate real QR base64 data URL
    const qrDataUrl = await QRCode.toDataURL(rawQrString, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 8,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    const expiresAt = Date.now() + 60 * 1000; // 60 seconds expiry

    return NextResponse.json({
      status: 'success',
      data: {
        phoneNumber: cleaned,
        formattedPhone: formatPhoneNumber(cleaned),
        pairingCode,
        qrCodeUrl: qrDataUrl,
        expiresAt,
        expiresInSeconds: 60,
        sessionId,
        instructions: [
          '1. Buka aplikasi WhatsApp di HP yang ingin dijadikan Bot',
          '2. Klik menu titik tiga (⋮) di kanan atas atau buka Pengaturan',
          '3. Pilih "Perangkat Tertaut" (Linked Devices)',
          mode === 'pairing_code' 
            ? '4. Pilih "Tautkan dengan nomor telepon" lalu masukkan 8 karakter kode pairing di atas' 
            : '4. Arahkan kamera WhatsApp untuk memindai kode QR / Barcode di atas',
          '5. Tunggu hingga status berubah menjadi "Terhubung / Aktif"'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: (error as Error).message || 'Gagal membuat sesi pairing'
    }, { status: 500 });
  }
}
