import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Schooduler',
  description: 'Elementary school timetable app',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
