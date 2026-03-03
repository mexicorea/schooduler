import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Simple Timetable',
  description: 'Elementary school timetable app'
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
