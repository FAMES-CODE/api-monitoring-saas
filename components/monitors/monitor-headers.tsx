import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MonitorHeaders({
  headers,
}: {
  headers: Record<string, string>
}) {
  const entries = Object.entries(headers)

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Headers</CardTitle>
        <CardDescription>Request headers sent with each check.</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-neutral-500">No custom headers.</p>
        ) : (
          <dl className="space-y-2 text-sm">
            {entries.map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="font-mono text-neutral-500">{key}</dt>
                <dd className="max-w-[70%] truncate font-mono">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
