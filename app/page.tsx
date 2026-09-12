import SignIn from "@/components/sign-in"
import SignOut from "@/components/sign-out"
import { auth } from "@/auth"
 
export default async function Page() {
  const session = await auth()
  if (session) {
    console.log(session)
  }
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <SignIn />
        <SignOut />
      </div>
    </div>
  )
}
