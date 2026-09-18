import Link from "next/link"
import { Plus } from "lucide-react"

export function MonitorsPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="mt-6 mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold tracking-[0.14em] text-primary uppercase">Control center</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-px hover:bg-primary/85"
        >
          <Plus className="size-4" />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
