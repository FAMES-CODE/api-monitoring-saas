import { signOut } from "@/auth";
import { redirect } from "next/navigation"
 
export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        console.log("signing out")
        await signOut()
        redirect("/login")
      }}
    >
      <button type="submit">Signout</button>
    </form>
  )
}