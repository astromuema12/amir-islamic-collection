"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Save,
  Store,
  Upload,
  Phone,
  Mail,
  Globe,
  Link2,
  CreditCard,
  Banknote,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

const storeSettingsSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  description: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
})

type StoreSettingsValues = z.infer<typeof storeSettingsSchema>

export default function SellerSettingsPage() {
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "Amir Store",
      description:
        "Premium Islamic products including prayer mats, Qur'an, hijabs, perfumes, and more. Authentic products with fast delivery across Kenya.",
      email: "store@amirislamic.com",
      phone: "+254 800 000 0000",
      city: "Nairobi",
      state: "Nairobi County",
      country: "Kenya",
      website: "https://amirislamic.com",
      twitter: "@amir_store",
      instagram: "@amir_store",
      facebook: "amirstore",
      youtube: "@amirstore",
      linkedin: "amir-store",
      bankName: "GTBank",
      accountNumber: "0123456789",
      accountName: "Amir Store",
    },
  })

  const onSubmit = async (data: StoreSettingsValues) => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Settings saved successfully!")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your store profile, branding, and payment details
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Upload className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social">
            <Globe className="h-4 w-4" />
            Social Links
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4" />
            Payment Details
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Store Name"
                  placeholder="Your store name"
                  error={errors.storeName?.message}
                  {...register("storeName")}
                />
                <Textarea
                  label="Store Description"
                  placeholder="Describe your store..."
                  className="min-h-[120px]"
                  {...register("description")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Store Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Store Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                      <AvatarImage src="" alt="Store logo" />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        AS
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 400x400px, PNG or JPG, max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Store Banner</Label>
                  <div className="mt-2">
                    <div className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Upload banner image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Recommended: 1200x400px
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="h-4 w-4" />
                      Upload Banner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="store@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Input
                    label="Phone"
                    placeholder="+254 800 000 0000"
                    icon={<Phone className="h-4 w-4" />}
                    {...register("phone")}
                  />
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="City"
                    placeholder="Nairobi"
                    icon={<MapPin className="h-4 w-4" />}
                    {...register("city")}
                  />
                  <Input
                    label="State"
                    placeholder="Nairobi"
                    {...register("state")}
                  />
                  <Input
                    label="Country"
                    placeholder="Kenya"
                    {...register("country")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Website"
                  placeholder="https://yourstore.com"
                  icon={<Globe className="h-4 w-4" />}
                  error={errors.website?.message}
                  {...register("website")}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Twitter / X"
                    placeholder="@yourstore"
                    icon={<Link2 className="h-4 w-4" />}
                    {...register("twitter")}
                  />
                  <Input
                    label="Instagram"
                    placeholder="@yourstore"
                    icon={<Link2 className="h-4 w-4" />}
                    {...register("instagram")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Facebook"
                    placeholder="yourstore"
                    icon={<Link2 className="h-4 w-4" />}
                    {...register("facebook")}
                  />
                  <Input
                    label="YouTube"
                    placeholder="@yourstore"
                    icon={<Link2 className="h-4 w-4" />}
                    {...register("youtube")}
                  />
                </div>
                <Input
                  label="LinkedIn"
                  placeholder="your-store"
                  icon={<Link2 className="h-4 w-4" />}
                  {...register("linkedin")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details for Withdrawals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-primary" />
                    Bank Account Information
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This information will be used for all withdrawal requests.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Bank Name"
                    placeholder="e.g. GTBank"
                    {...register("bankName")}
                  />
                  <Input
                    label="Account Number"
                    placeholder="0123456789"
                    {...register("accountNumber")}
                  />
                </div>
                <Input
                  label="Account Name"
                  placeholder="John Doe"
                  {...register("accountName")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="premium"
              size="lg"
              isLoading={saving}
            >
              <Save className="h-4 w-4" />
              Save All Settings
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
