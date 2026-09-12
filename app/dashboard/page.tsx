import { auth } from "@/auth"
import SignOut from "@/components/sign-out"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()
  if (!session) {
    return redirect("/")
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user?.name || session?.user?.email}</p>
      <SignOut />
    </div>
  )
}
