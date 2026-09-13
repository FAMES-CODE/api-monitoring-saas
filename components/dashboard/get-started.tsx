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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type SetupTask = {
  title: string
  status: string
  lastChecked: string
  responseTime: number
}

const Monitors: SetupTask[] = [
  {
    title: "Github API",
    status: "UP",
    lastChecked: "~2 min",
    responseTime: 300,
  },
  {
    title: "My WEBSITE API",
    status: "DOWN",
    lastChecked: "~1 min",
    responseTime: 250,
  },
]

export function GetStarted() {
  return (
    <Card className="h-full rounded-3xl border-none shadow-sm">
      <CardHeader>
        <CardTitle>Your monitors</CardTitle>
        <CardDescription>7 Monitors | 5 Up - 2 Down</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Checked</TableHead>
              <TableHead className="text-right">Response Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Monitors.map((monitor) => {
              return (
                <TableRow key={monitor.title}>
                  <TableCell className="font-medium">{monitor.title}</TableCell>
                  <TableCell>{monitor.status}</TableCell>
                  <TableCell>{monitor.lastChecked}</TableCell>
                  <TableCell className="text-right">
                    {monitor.responseTime} ms
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
