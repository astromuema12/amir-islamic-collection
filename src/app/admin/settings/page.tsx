"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Key, Image, Mail, Truck, Percent, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = (section: string) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success(`${section} settings saved`)
    }, 1000)
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
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Site Name" defaultValue="Amir Islamic Collections" placeholder="Your site name" />
              <Textarea label="Site Description" defaultValue="Premium Islamic products marketplace - Prayer mats, Qur'an, hijabs, perfumes, and more." rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Logo URL" defaultValue="/logo.png" placeholder="https://..." />
                <Input label="Favicon URL" defaultValue="/favicon.ico" placeholder="https://..." />
              </div>
              <Separator />
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Support Email" defaultValue="support@amirislamic.com" type="email" />
                <Input label="Support Phone" defaultValue="+234 800 264 7526" />
              </div>
              <Input label="Address" defaultValue="Nairobi, Kenya" />
              <Separator />
              <h3 className="text-sm font-semibold">Social Media Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Facebook URL" defaultValue="https://facebook.com/amirislamic" />
                <Input label="Twitter URL" defaultValue="https://twitter.com/amirislamic" />
                <Input label="Instagram URL" defaultValue="https://instagram.com/amirislamic" />
                <Input label="YouTube URL" defaultValue="https://youtube.com/@amirislamic" />
                <Input label="WhatsApp Number" defaultValue="+2348002647526" />
              </div>
              <Button onClick={() => handleSave("General")} isLoading={saving}>
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
                  <Switch defaultChecked className="ml-auto" />
                </div>
                <Input label="Public Key" defaultValue="pk_test_..." type="password" />
                <Input label="Secret Key" defaultValue="sk_test_..." type="password" />
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
                  <Switch className="ml-auto" />
                </div>
                <Input label="Public Key" placeholder="FLWPUBK-..." type="password" />
                <Input label="Secret Key" placeholder="FLWSEC-..." type="password" />
              </div>
              <Button onClick={() => handleSave("Payment")} isLoading={saving}>
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
              <CardDescription>Configure email delivery with Resend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Using Resend for email delivery</p>
              </div>
              <Input label="Resend API Key" placeholder="re_..." type="password" />
              <Input label="From Email" defaultValue="noreply@amirislamic.com" type="email" />
              <Input label="From Name" defaultValue="Amir Islamic Collections" />
              <Button onClick={() => handleSave("Email")} isLoading={saving}>
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
                <p className="text-sm text-muted-foreground">Cloudinary is used for image uploads and transformations</p>
              </div>
              <Input label="Cloud Name" placeholder="your-cloud-name" />
              <Input label="API Key" placeholder="your-api-key" type="password" />
              <Input label="API Secret" placeholder="your-api-secret" type="password" />
              <Input label="Upload Preset" placeholder="your-upload-preset" />
              <Button onClick={() => handleSave("Cloudinary")} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Cloudinary Settings
              </Button>
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
              <Input label="Free Shipping Threshold (₦)" type="number" defaultValue="50000" />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Standard Rate (₦)" type="number" defaultValue="1500" />
                <Input label="Express Rate (₦)" type="number" defaultValue="3500" />
                <Input label="Next Day Rate (₦)" type="number" defaultValue="5000" />
              </div>
              <Button onClick={() => handleSave("Shipping")} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Percent className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Tax is applied automatically to all orders</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Tax Rate (%)" type="number" defaultValue="7.5" step="0.1" />
                <Input label="Tax Name" defaultValue="VAT" />
              </div>
              <Input label="Tax Description" defaultValue="Value Added Tax (VAT)" />
              <Button onClick={() => handleSave("Tax")} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Tax Settings
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
                    <input type="color" defaultValue="#059669" className="h-10 w-10 rounded-lg border cursor-pointer" />
                    <Input defaultValue="#059669" className="flex-1 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Premium/Gold Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#B8860B" className="h-10 w-10 rounded-lg border cursor-pointer" />
                    <Input defaultValue="#B8860B" className="flex-1 font-mono" />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("Theme")} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" /> Save Theme Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
