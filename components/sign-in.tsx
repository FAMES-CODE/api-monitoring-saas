import { signIn } from "@/auth"
import { Code2 } from "lucide-react"

export default function SignIn() {
  return (
    <form
      className="w-full"
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button
        type="submit"
        className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-foreground px-5 text-sm font-semibold text-background shadow-xl shadow-foreground/15 transition duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Code2 className="size-5 transition-transform duration-200 group-hover:rotate-6" />
        Continue with GitHub
      </button>
    </form>
  )
}
