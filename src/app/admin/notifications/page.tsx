"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Bell, Mail, MessageSquare, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface NotificationHistory {
  id: string
  title: string
  message: string
  target: string
  sentBy: string
  sentAt: Date
  deliveredCount: number
}

const mockHistory: NotificationHistory[] = []

const users: string[] = []

export default function AdminNotificationsPage() {
  const [target, setTarget] = useState("all")
  const [specificUser, setSpecificUser] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [history] = useState(mockHistory)

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required")
      return
    }
    if (target === "specific" && !specificUser) {
      toast.error("Select a user")
      return
    }
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    const targetLabel = target === "all" ? "All Users" : target === "sellers" ? "Sellers" : target === "specific" ? specificUser : "Users"
    history.unshift({
      id: `n-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      target: targetLabel,
      sentBy: "Admin",
      sentAt: new Date(),
      deliveredCount: target === "all" ? 1245 : target === "sellers" ? 847 : 1,
    })
    setTitle("")
    setMessage("")
    setSending(false)
    toast.success(`Notification sent to ${targetLabel}`)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight premium-heading">Notifications</h1>
        <p className="text-muted-foreground">Send notifications to users</p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send"><Send className="h-4 w-4 mr-2" /> Send Notification</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>Send a notification to all users, specific roles, or an individual user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Send To</label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="users">All Users (Non-Sellers)</SelectItem>
                    <SelectItem value="sellers">All Sellers</SelectItem>
                    <SelectItem value="specific">Specific User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {target === "specific" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Select User</label>
                  <Select value={specificUser} onValueChange={setSpecificUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u, i) => (
                        <SelectItem key={i} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Input label="Notification Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Ramadan Sale is Live!" />

              <Textarea label="Message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your notification message..." rows={4} />

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Bell className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  This will send a notification to {target === "all" ? "all registered users" : target === "sellers" ? "all sellers" : target === "specific" ? "the selected user" : "all non-seller users"}.
                </p>
              </div>

              <Button onClick={handleSend} isLoading={sending} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending..." : "Send Notification"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Previously sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notifications sent yet</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Bell className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.message}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0 ml-2">
                            {item.deliveredCount} delivered
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>To: {item.target}</span>
                          <span>•</span>
                          <span>By: {item.sentBy}</span>
                          <span>•</span>
                          <span>{formatDateTime(item.sentAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
