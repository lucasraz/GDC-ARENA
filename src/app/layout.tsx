import type { Metadata } from 'next'
import './globals.css'
import { epilogue, newsreader, inter } from './fonts'

export const metadata: Metadata = {
  metadataBase: new URL('https://gdc-arena.vercel.app'),
  title: 'GDC-ARENA | Vasco, meu primeiro amor',
  description: 'O Gigante da Colina em sua forma definitiva.',
  openGraph: {
    title: 'GDC-ARENA | Vasco, meu primeiro amor',
    description: 'O Gigante da Colina em sua forma definitiva.',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GDC-ARENA | Vasco, meu primeiro amor',
    description: 'O Gigante da Colina em sua forma definitiva.',
  },
}

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${epilogue.variable} ${newsreader.variable} ${inter.variable}`}>
      <body className="antialiased" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}



