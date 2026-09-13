import { Geist_Mono, Inter, Roboto_Slab } from "next/font/google"
import { redirect } from "next/navigation"

import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TopNav } from "@/components/dashboard/top-nav"
import { SideRail } from "@/components/dashboard/side-rail"
import { auth } from "@/auth"

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) {
    redirect("/")
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        robotoSlabHeading.variable
      )}
    >
      <body className="gap-6 bg-gradient-to-br from-rose-100 via-fuchsia-50 to-indigo-100 p-4 md:p-4 dark:bg-background dark:from-background dark:via-background dark:to-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex gap-6 p-4 md:p-8">
            <SideRail />

            <div className="flex-1 rounded-[2rem] p-6 md:p-4">
              <TopNav user={session.user} />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
