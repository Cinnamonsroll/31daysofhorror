import type React from "react"
import type { Metadata, Viewport } from "next"
import { Creepster, Nosifer } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-creepster",
})

const nosifer = Nosifer({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nosifer",
})

export const metadata: Metadata = {
  title: "31 Days of Horror - October Movie Calendar",
  description:
    "A spine-chilling movie for every October night. Discover horror films in our interactive advent calendar.",
  keywords: ["horror movies", "october", "halloween", "advent calendar", "scary films"],
  openGraph: {
    title: "31 Days of Horror",
    description: "A spine-chilling movie for every October night",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: '#E67146', 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${creepster.variable} ${nosifer.variable} antialiased`}
      >
        <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-background/95 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.1),transparent_50%)] pointer-events-none" />

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          />
          <div
            className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent/30 rounded-full animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          />
          <div
            className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-secondary/25 rounded-full animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          />
          <div
            className="absolute top-1/6 right-1/4 w-1 h-1 bg-primary/15 rounded-full animate-pulse"
            style={{ animationDelay: "3s", animationDuration: "6s" }}
          />
        </div>

        <Suspense fallback={null}>
          <div className="relative z-10">{children}</div>
        </Suspense>
      </body>
    </html>
  )
}
