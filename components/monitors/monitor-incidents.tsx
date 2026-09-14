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
import type { MonitorIncidentItem } from "@/lib/monitors"

export function MonitorIncidents({
  incidents,
}: {
  incidents: MonitorIncidentItem[]
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Incidents</CardTitle>
        <CardDescription>Outages recorded against this endpoint.</CardDescription>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <p className="text-sm text-neutral-500">No incidents recorded.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Started</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>
                    {new Date(incident.startedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {incident.resolvedAt
                      ? new Date(incident.resolvedAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        incident.status === "open" ? "destructive" : "secondary"
                      }
                      className="rounded-full"
                    >
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
