import type { Metadata } from 'next'
import './globals.css'
import { epilogue, newsreader, inter } from './fonts'

export const metadata: Metadata = {
  title: 'GDC-ARENA | Nautical Editorial',
  description: 'O Gigante da Colina em sua forma definitiva.',
}

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${epilogue.variable} ${newsreader.variable} ${inter.variable}`}>
      <body className="antialiased" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '64px' }}>
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}


