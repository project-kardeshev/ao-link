import type { Metadata } from "next"

import "./globals.css"
import { Suspense } from "react"

import { NavigationEvents } from "@/components/NavigationEvents"

import RootLayoutUI from "../components/RootLayout/RootLayoutUI"

export const metadata: Metadata = {
  title: "AOLink",
  icons: {
    icon: "/ao.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayoutUI>{children}</RootLayoutUI>
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  )
}
