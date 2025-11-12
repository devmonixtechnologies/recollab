import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import './globals.css'
import { Metadata } from "next"
import Provider from "./Provider"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { getCurrentUser } from "@/lib/auth"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Recollab',
  description: 'Your go-to collaborative editor',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider user={user}>
          <Provider>
            {children}
          </Provider>
        </AuthProvider>
      </body>
    </html>
  )
}
