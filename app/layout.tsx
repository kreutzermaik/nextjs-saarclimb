import type { Metadata } from 'next'
import '@/app/src/style/globals.css'

export const metadata: Metadata = {
  title: 'SaarClimb',
  description: 'Die App für Boulderer im Saarland',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
