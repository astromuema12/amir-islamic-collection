"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Save, Key, Image, Mail, Truck, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSettings, updateSettings } from "@/lib/actions/admin-actions"
import toast from "react-hot-toast"

interface SettingsData {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  primaryColor: string
  supportEmail: string
  supportPhone: string
  facebook: string
  twitter: string
  instagram: string
  youtube: string
  whatsapp: string
  paystackPublicKey: string
  paystackSecretKey: string
  flutterwavePublicKey: string
  flutterwaveSecretKey: string
  fromEmail: string
  fromName: string
  freeShippingThreshold: string
  standardRate: string
  expressRate: string
}

const EMPTY: SettingsData = {
  siteName: "", siteDescription: "", logo: "", favicon: "", primaryColor: "#059669",
  supportEmail: "", supportPhone: "", facebook: "", twitter: "", instagram: "", youtube: "", whatsapp: "",
  paystackPublicKey: "", paystackSecretKey: "", flutterwavePublicKey: "", flutterwaveSecretKey: "",
  fromEmail: "", fromName: "", freeShippingThreshold: "", standardRate: "", expressRate: "",
}

export default function AdminSettingsPage() {
  const [data, setData] = useState<SettingsData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const settings = await getSettings()
    if (settings) {
      setData({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        logo: settings.logo || "",
        favicon: settings.favicon || "",
        primaryColor: settings.primaryColor || "#059669",
        supportEmail: settings.supportEmail || "",
        supportPhone: settings.supportPhone || "",
        facebook: settings.socialLinks?.facebook || "",
        twitter: settings.socialLinks?.twitter || "",
        instagram: settings.socialLinks?.instagram || "",
        youtube: settings.socialLinks?.youtube || "",
        whatsapp: settings.socialLinks?.whatsapp || "",
        paystackPublicKey: settings.paymentProviders?.paystack?.publicKey || "",
        paystackSecretKey: settings.paymentProviders?.paystack?.secretKey || "",
        flutterwavePublicKey: settings.paymentProviders?.flutterwave?.publicKey || "",
        flutterwaveSecretKey: settings.paymentProviders?.flutterwave?.secretKey || "",
        fromEmail: settings.emailSettings?.fromEmail || "",
        fromName: settings.emailSettings?.fromName || "",
        freeShippingThreshold: settings.shippingSettings?.freeShippingThreshold ? String(settings.shippingSettings.freeShippingThreshold) : "",
        standardRate: settings.shippingSettings?.standardRate ? String(settings.shippingSettings.standardRate) : "",
        expressRate: settings.shippingSettings?.expressRate ? String(settings.shippingSettings.expressRate) : "",
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => load(), 0)
    return () => clearTimeout(t)
  }, [load])

  const set = (key: keyof SettingsData) => (value: string) => setData(prev => ({ ...prev, [key]: value }))

  const handleSave = async (section: string, keys: (keyof SettingsData)[]) => {
    if (loading) return
    setSaving(true)
    const fd = new FormData()
    keys.forEach(key => fd.set(key, data[key]))
    const result = await updateSettings(fd)
    setSaving(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success(`${section} settings saved`)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight premium-heading">Settings</h1>
        <p className="text-muted-foreground">Manage your site configuration</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="cloudinary">Cloudinary</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        )}

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Site Name" value={data.siteName} onChange={e => set("siteName")(e.target.value)} placeholder="Your site name" />
              <Textarea label="Site Description" value={data.siteDescription} onChange={e => set("siteDescription")(e.target.value)} rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Logo URL" value={data.logo} onChange={e => set("logo")(e.target.value)} placeholder="https://..." />
                <Input label="Favicon URL" value={data.favicon} onChange={e => set("favicon")(e.target.value)} placeholder="https://..." />
              </div>
              <Separator />
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Support Email" value={data.supportEmail} onChange={e => set("supportEmail")(e.target.value)} type="email" />
                <Input label="Support Phone" value={data.supportPhone} onChange={e => set("supportPhone")(e.target.value)} />
              </div>
              <Separator />
              <h3 className="text-sm font-semibold">Social Media Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Facebook URL" value={data.facebook} onChange={e => set("facebook")(e.target.value)} />
                <Input label="Twitter URL" value={data.twitter} onChange={e => set("twitter")(e.target.value)} />
                <Input label="Instagram URL" value={data.instagram} onChange={e => set("instagram")(e.target.value)} />
                <Input label="YouTube URL" value={data.youtube} onChange={e => set("youtube")(e.target.value)} />
                <Input label="WhatsApp Number" value={data.whatsapp} onChange={e => set("whatsapp")(e.target.value)} />
              </div>
              <Button onClick={() => handleSave("General", ["siteName", "siteDescription", "logo", "favicon", "supportEmail", "supportPhone", "facebook", "twitter", "instagram", "youtube", "whatsapp"])} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure your payment providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Paystack</h3>
                    <p className="text-xs text-muted-foreground">Primary payment gateway</p>
                  </div>
                </div>
                <Input label="Public Key" value={data.paystackPublicKey} onChange={e => set("paystackPublicKey")(e.target.value)} placeholder="pk_test_..." type="password" />
                <Input label="Secret Key" value={data.paystackSecretKey} onChange={e => set("paystackSecretKey")(e.target.value)} placeholder="sk_test_..." type="password" />
              </div>
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Flutterwave</h3>
                    <p className="text-xs text-muted-foreground">Secondary payment gateway</p>
                  </div>
                </div>
                <Input label="Public Key" value={data.flutterwavePublicKey} onChange={e => set("flutterwavePublicKey")(e.target.value)} placeholder="FLWPUBK-..." type="password" />
                <Input label="Secret Key" value={data.flutterwaveSecretKey} onChange={e => set("flutterwaveSecretKey")(e.target.value)} placeholder="FLWSEC-..." type="password" />
              </div>
              <Button onClick={() => handleSave("Payment", ["paystackPublicKey", "paystackSecretKey", "flutterwavePublicKey", "flutterwaveSecretKey"])} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">The Resend API key is configured via environment variables</p>
              </div>
              <Input label="From Email" value={data.fromEmail} onChange={e => set("fromEmail")(e.target.value)} type="email" />
              <Input label="From Name" value={data.fromName} onChange={e => set("fromName")(e.target.value)} />
              <Button onClick={() => handleSave("Email", ["fromEmail", "fromName"])} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cloudinary */}
        <TabsContent value="cloudinary">
          <Card>
            <CardHeader>
              <CardTitle>Cloudinary Settings</CardTitle>
              <CardDescription>Image upload configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Image className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Cloudinary is configured via environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>Configure shipping rates and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Truck className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Shipping rates in KES</p>
              </div>
              <Input label="Free Shipping Threshold (KES)" type="number" value={data.freeShippingThreshold} onChange={e => set("freeShippingThreshold")(e.target.value)} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Standard Rate (KES)" type="number" value={data.standardRate} onChange={e => set("standardRate")(e.target.value)} />
                <Input label="Express Rate (KES)" type="number" value={data.expressRate} onChange={e => set("expressRate")(e.target.value)} />
              </div>
              <Button onClick={() => handleSave("Shipping", ["freeShippingThreshold", "standardRate", "expressRate"])} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Palette className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Customize colors and branding</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={data.primaryColor} onChange={e => set("primaryColor")(e.target.value)} className="h-10 w-10 rounded-lg border cursor-pointer" />
                    <Input value={data.primaryColor} onChange={e => set("primaryColor")(e.target.value)} className="flex-1 font-mono" />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("Theme", ["primaryColor"])} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Theme Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
