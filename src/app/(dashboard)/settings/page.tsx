"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Separator,
} from "@/components/ui/separator"
import {
  Lock,
  Bell,
  Mail,
  Smartphone,
  AlertTriangle,
  Trash2,
  Loader2,
} from "lucide-react"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmitPassword = async (data: PasswordFormData) => {
    setPasswordLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      toast.success("Password changed successfully")
      reset()
    } catch {
      toast.error("Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      toast.success("Account deletion request submitted")
      setDeleteDialogOpen(false)
    } catch {
      toast.error("Failed to delete account")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={passwordLoading}
                  className="gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <Label
                    htmlFor="email-notif"
                    className="text-sm font-medium"
                  >
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive order updates, promotions, and security alerts via email
                  </p>
                </div>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifs}
                onCheckedChange={setEmailNotifs}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <Label
                    htmlFor="sms-notif"
                    className="text-sm font-medium"
                  >
                    SMS Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get shipping updates and delivery alerts via SMS
                  </p>
                </div>
              </div>
              <Switch
                id="sms-notif"
                checked={smsNotifs}
                onCheckedChange={setSmsNotifs}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Delete Account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="danger" className="gap-2 shrink-0">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. All your data, orders, and
                      preferences will be permanently deleted. Please make sure
                      you have no pending orders before proceeding.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
                    <p className="font-medium text-destructive">What will be deleted:</p>
                    <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted-foreground">
                      <li>Profile information and saved addresses</li>
                      <li>Order history and wishlist</li>
                      <li>Payment methods and preferences</li>
                    </ul>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      isLoading={deleteLoading}
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
