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
    <div className="app-shell min-h-svh p-3 md:p-5">
      <div className="mx-auto flex max-w-[1680px] gap-5">
        <SideRail />

        <div className="min-w-0 flex-1 pb-8 md:px-2">
          <TopNav user={session.user} />
          {children}
        </div>
      </div>
    </div>
  )
}
