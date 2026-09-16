import { redirect } from "next/navigation"

import { TopNav } from "@/components/dashboard/top-nav"
import { SideRail } from "@/components/dashboard/side-rail"
import { auth } from "@/auth"

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
    <div className="min-h-svh gap-6 bg-gradient-to-br from-rose-100 via-fuchsia-50 to-indigo-100 p-4 md:p-4 dark:bg-background dark:from-background dark:via-background dark:to-background">
      <div className="flex gap-6 p-4 md:p-8">
        <SideRail />

        <div className="flex-1 rounded-[2rem] p-6 md:p-4">
          <TopNav user={session.user} />
          {children}
        </div>
      </div>
    </div>
  )
}
