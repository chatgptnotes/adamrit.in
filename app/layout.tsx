import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ESIC Package Management - Hope Hospital",
  description: "Manage diagnoses, surgeries, and complications for ESIC patients",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
