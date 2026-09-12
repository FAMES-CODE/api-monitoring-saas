import SignIn from "@/components/sign-in"
 import { auth } from "@/auth"
 
export default async function Page() {
  const session = await auth()
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <SignIn />
 
      </div>
    </div>
  )
}
