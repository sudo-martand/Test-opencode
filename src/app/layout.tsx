import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cyber Operations Center | v0.1.0",
  description: "High-fidelity cyber operations simulation platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full font-mono">{children}</body>
    </html>
  )
}
