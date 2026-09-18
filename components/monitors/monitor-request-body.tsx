import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MonitorRequestBody({ body }: { body: unknown }) {
  const serialized =
    body === null || body === undefined
      ? null
      : typeof body === "string"
        ? body
        : JSON.stringify(body, null, 2)

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Request body</CardTitle>
        <CardDescription>Payload included with POST and PUT checks.</CardDescription>
      </CardHeader>
      <CardContent>
        {serialized ? (
          <pre className="overflow-x-auto rounded-2xl bg-muted/60 p-3 font-mono text-xs">
            {serialized}
          </pre>
        ) : (
          <p className="text-sm text-neutral-500">No request body.</p>
        )}
      </CardContent>
    </Card>
  )
}
