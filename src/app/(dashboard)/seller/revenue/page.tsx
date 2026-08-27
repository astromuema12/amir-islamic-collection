"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice, formatDate } from "@/lib/utils"

const weeklyData: { week: string; revenue: number; orders: number; profit: number }[] = []

const monthlyData: { month: string; revenue: number; orders: number; profit: number }[] = []

const yearlyData: { year: string; revenue: number; orders: number; profit: number }[] = []

const transactions: { id: string; description: string; amount: number; type: string; status: string; date: Date }[] = []

export default function SellerRevenuePage() {
  const [chartView, setChartView] = useState<"weekly" | "monthly" | "yearly">("monthly")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawDialog, setWithdrawDialog] = useState(false)

  const chartData = useMemo(() => {
    switch (chartView) {
      case "weekly":
        return weeklyData as Record<string, unknown>[]
      case "yearly":
        return yearlyData as Record<string, unknown>[]
      default:
        return monthlyData as Record<string, unknown>[]
    }
  }, [chartView])

  const totalRevenue = transactions
    .filter((t) => t.type === "sale")
    .reduce((s, t) => s + t.amount, 0)

  const totalWithdrawn = Math.abs(
    transactions
      .filter((t) => t.type === "withdrawal")
      .reduce((s, t) => s + t.amount, 0)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
          <p className="text-sm text-muted-foreground">
            Track your earnings and financial performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="premium"
            size="sm"
            onClick={() => setWithdrawDialog(true)}
          >
            <Wallet className="h-4 w-4" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(totalRevenue - totalWithdrawn)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue)}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+18.5% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Withdrawn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalWithdrawn)}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3" />
              <span>{transactions.filter((t) => t.type === "withdrawal").length} withdrawals</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Clearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatPrice(0)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Will be available in 3 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Revenue Chart</CardTitle>
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as typeof chartView)}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey={chartView === "yearly" ? "year" : chartView === "weekly" ? "week" : "month"}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                    tickFormatter={(v: unknown) => `KES ${(Number(v) / 1000).toFixed(0)}k`}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                    formatter={(value: unknown) => formatPrice(Number(value))}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Sales
            </Badge>
            <Badge variant="warning" className="gap-1">
              <TrendingDown className="h-3 w-3" />
              Withdrawals
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium text-xs">{tx.id}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {tx.description}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      tx.amount > 0 ? "text-success" : "text-warning"
                    )}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatPrice(Math.abs(tx.amount))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.type === "sale" ? "success" : "warning"}
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(tx.date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={withdrawDialog} onOpenChange={setWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Transfer your available balance to your bank account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(totalRevenue - totalWithdrawn)}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Amount (KES)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input placeholder="e.g. GTBank" />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input placeholder="0123456789" />
            </div>
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input placeholder="John Doe" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="premium">Submit Withdrawal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
