import SignIn from "@/components/sign-in"
import { Activity, ArrowUpRight, Check, ShieldCheck, Zap } from "lucide-react"

export default function Page() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[oklch(0.17_0.04_258)] p-4 text-white selection:bg-primary/40 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,oklch(0.48_0.15_245_/_0.35),transparent_28rem),radial-gradient(circle_at_85%_80%,oklch(0.38_0.12_275_/_0.3),transparent_30rem)]" />
      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[540px] overflow-hidden p-7 sm:p-11">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Activity className="size-5" />
              </span>
              <div>
                <p className="font-bold tracking-tight">Pulse-API</p>
                <p className="text-xs text-white/50">Uptime intelligence</p>
              </div>
            </div>

            <div className="my-auto max-w-xl py-12">
              <p className="mb-4 text-xs font-bold tracking-[0.16em] text-primary uppercase">
                Monitoring, simplified
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                See problems before your users do.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
                Keep every endpoint reliable with a focused, real-time view of
                uptime, incidents, and response times.
              </p>
              <div className="mt-9 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
                {[
                  "Continuous checks",
                  "Instant incident history",
                  "Clear response trends",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="size-4" />
              Secure sign-in powered by GitHub
            </div>
          </div>
        </div>

        <div className="flex items-center border-t border-white/10 bg-black/10 p-7 sm:p-11 lg:border-t-0 lg:border-l">
          <div className="w-full max-w-sm">
            <span className="mb-6 grid size-11 place-items-center rounded-xl bg-white/10 text-primary">
              <Zap className="size-5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Sign in to access your monitoring workspace.
            </p>
            <div className="my-7 h-px bg-white/10" />
            <SignIn />
            <p className="mt-5 flex items-center justify-center gap-1 text-center text-xs text-white/40">
              Your endpoints deserve a pulse.{" "}
              <ArrowUpRight className="size-3" />
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
