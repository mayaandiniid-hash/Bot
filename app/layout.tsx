import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Florence WA Bot Server & JadiBot Cloud Hub',
  description: 'Platform Manajemen Server Bot WhatsApp 24 Jam, Open JadiBot Pairing Code & Scan Barcode QR, Live Multi-Session Manager, dan Terminal Monitoring Real-time.',
  openGraph: {
    title: 'Florence WA Bot Server & JadiBot Cloud Hub',
    description: 'Platform Manajemen Server Bot WhatsApp 24 Jam, Open JadiBot Pairing Code & Scan Barcode QR, Live Multi-Session Manager, dan Terminal Monitoring Real-time.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florence WA Bot Server & JadiBot Cloud Hub',
    description: 'Platform Manajemen Server Bot WhatsApp 24 Jam, Open JadiBot Pairing Code & Scan Barcode QR, Live Multi-Session Manager, dan Terminal Monitoring Real-time.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
