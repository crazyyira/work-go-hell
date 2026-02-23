import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '职场速效救心丸',
  description: '辞职还是搬砖？上天自有公论',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

