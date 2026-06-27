"use client"

import { useState } from "react"
import {
  Wallet,
  Plus,
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

interface Withdrawal {
  id: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
  status: "pending" | "approved" | "rejected" | "completed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const mockWithdrawals: Withdrawal[] = [
  {
    id: "WTH-001",
    amount: 150000,
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Amir Store",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "WTH-002",
    amount: 250000,
    bankName: "Access Bank",
    accountNumber: "0987654321",
    accountName: "Amir Store",
    status: "approved",
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: "WTH-003",
    amount: 50000,
    bankName: "First Bank",
    accountNumber: "1122334455",
    accountName: "Amir Store",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 86400000),
    updatedAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: "WTH-004",
    amount: 100000,
    bankName: "UBA",
    accountNumber: "5544332211",
    accountName: "Amir Store",
    status: "rejected",
    notes: "Insufficient balance at time of processing",
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 5 * 86400000),
  },
]

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", badge: "warning" as const, label: "Pending" },
  approved: { icon: CheckCircle2, color: "text-success", badge: "success" as const, label: "Approved" },
  rejected: { icon: XCircle, color: "text-destructive", badge: "danger" as const, label: "Rejected" },
  completed: { icon: CheckCircle2, color: "text-primary", badge: "default" as const, label: "Completed" },
}

export default function SellerWithdrawalsPage() {
  const [withdrawals] = useState(mockWithdrawals)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "completed" || w.status === "approved")
    .reduce((s, w) => s + w.amount, 0)

  const pendingAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((s, w) => s + w.amount, 0)

  const handleSubmit = async () => {
    if (!amount || !bankName || !accountNumber || !accountName) {
      toast.error("Please fill in all fields")
      return
    }
    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Withdrawal request submitted!")
      setShowForm(false)
      setAmount("")
      setBankName("")
      setAccountNumber("")
      setAccountName("")
    } catch {
      toast.error("Failed to submit withdrawal")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
          <p className="text-sm text-muted-foreground">
            Manage your payout requests and bank details
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button variant="premium">
              <Plus className="h-4 w-4" />
              New Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
              <DialogDescription>
                Enter the amount and bank details for the withdrawal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(3200000)}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Amount (KES)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  placeholder="e.g. GTBank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input
                  placeholder="John Doe"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                variant="premium"
                onClick={handleSubmit}
                isLoading={submitting}
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(3200000)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Total Withdrawn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalWithdrawn)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatPrice(pendingAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((w) => {
                const config = statusConfig[w.status]
                const StatusIcon = config.icon
                return (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium text-xs">
                      {w.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(w.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{w.accountName}</p>
                        <p className="text-xs text-muted-foreground">
                          {w.bankName} • {w.accountNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.badge}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(w.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(w.updatedAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
