import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { MonitorCheckItem } from "@/lib/monitors"

export function MonitorCheckHistory({ checks }: { checks: MonitorCheckItem[] }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Check history</CardTitle>
        <CardDescription>Most recent probe results for this monitor.</CardDescription>
      </CardHeader>
      <CardContent>
        {checks.length === 0 ? (
          <p className="text-sm text-neutral-500">No checks recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>
                    {new Date(check.checkedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {check.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{check.statusCode}</TableCell>
                  <TableCell>{check.responseTime}ms</TableCell>
                  <TableCell className="max-w-xs truncate text-neutral-500">
                    {check.error || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
