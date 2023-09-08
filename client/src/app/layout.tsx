import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.css'


export const metadata: Metadata = {
	title: 'Reputation of members'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
