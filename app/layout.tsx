import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin", "cyrillic"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Joltap - Student Career Platform',
  description: 'Joltap bridges students and employers through verified digital portfolios, skill tracking, and smart job matching.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/cat.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/cat.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/GGG.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/cat.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
