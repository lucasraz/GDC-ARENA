import type { Metadata } from 'next'
import './globals.css'
import { epilogue, newsreader, inter } from './fonts'

export const metadata: Metadata = {
  title: 'GDC-ARENA | Nautical Editorial',
  description: 'O Gigante da Colina em sua forma definitiva.',
}

import Header from '@/components/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${epilogue.variable} ${newsreader.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}
