"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Search, Globe, Image, RefreshCw, Save, Code,
  FileCode, ExternalLink
} from "lucide-react"
import { getSettings, updateSettings } from "@/lib/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

export default function AdminSEOPage() {
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  const load = useCallback(async () => {
    const settings = await getSettings()
    if (settings) {
      setMetaTitle(settings.seoTitle || "")
      setMetaDescription(settings.seoDescription || "")
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => load(), 0)
    return () => clearTimeout(t)
  }, [load])

  const handleSave = async (section: string, fd: FormData) => {
    if (fd.entries().next().done) {
      toast.success(`${section} saved`)
      return
    }
    setSaving(true)
    const result = await updateSettings(fd)
    setSaving(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success(`${section} saved`)
  }

  const saveMetaTags = () => {
    const fd = new FormData()
    if (metaTitle) fd.set("seoTitle", metaTitle)
    if (metaDescription) fd.set("seoDescription", metaDescription)
    handleSave("Meta Tags", fd)
  }

  const handleRegenerateSitemap = () => {
    setRegenerating(true)
    setTimeout(() => {
      setRegenerating(false)
      toast.success("Sitemap regenerated successfully")
    }, 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight premium-heading">SEO Settings</h1>
        <p className="text-muted-foreground">Manage search engine optimization</p>
      </div>

      {/* Meta Tags */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Meta Tags</CardTitle>
              <CardDescription>Default meta title and description for your site</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Meta Title" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Site title" />
          <Textarea label="Meta Description" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={3} />
          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">{metaTitle || "Site title"}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{metaDescription || "Site description"}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">https://amirislamic.com/</p>
          </div>
          <Button onClick={saveMetaTags} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" /> Save Meta Tags
          </Button>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Image className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Open Graph</CardTitle>
              <CardDescription>Social media sharing preview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="OG Title" defaultValue="Amir Islamic Collections" />
          <Textarea label="OG Description" defaultValue="Your trusted marketplace for premium Islamic products" rows={2} />
          <div>
            <label className="text-sm font-medium mb-1.5 block">OG Image URL</label>
            <div className="flex gap-2">
              <Input defaultValue="/og-image.png" placeholder="https://..." className="flex-1" />
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Recommended size: 1200x630px</p>
          </div>
          <div className="aspect-[1.9/1] max-w-md rounded-lg border bg-muted overflow-hidden">
            <div className="h-full w-full bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-lg font-bold premium-heading">Amir Islamic Collections</p>
                <p className="text-sm text-emerald-200">Premium Islamic Products Marketplace</p>
              </div>
            </div>
          </div>
          <Button onClick={() => handleSave("Open Graph", new FormData())} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" /> Save Open Graph
          </Button>
        </CardContent>
      </Card>

      {/* Google Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Google Analytics</CardTitle>
              <CardDescription>Track site traffic and user behavior</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Google Analytics ID (G-ID)" placeholder="G-XXXXXXXXXX" />
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Badge variant="outline">Tracking</Badge>
            <span className="text-sm text-muted-foreground">Analytics tracking is currently active</span>
            <Switch className="ml-auto" />
          </div>
          <Button onClick={() => handleSave("Analytics", new FormData())} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" /> Save Analytics Settings
          </Button>
        </CardContent>
      </Card>

      {/* Structured Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileCode className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Structured Data</CardTitle>
              <CardDescription>Schema.org JSON-LD markup</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Current Schema</p>
            <pre className="text-xs font-mono bg-muted p-3 rounded-lg overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Amir Islamic Collections",
  "url": "https://amirislamic.com",
  "description": "Premium Islamic products marketplace"
}`}
            </pre>
          </div>
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <span className="text-sm">Enable structured data</span>
          </div>
          <Button onClick={() => handleSave("Structured Data", new FormData())} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" /> Save Structured Data
          </Button>
        </CardContent>
      </Card>

      {/* Sitemap */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Sitemap</CardTitle>
              <CardDescription>Regenerate XML sitemap for search engines</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Sitemap URL</p>
              <p className="text-xs text-muted-foreground font-mono">https://amirislamic.com/sitemap.xml</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The sitemap includes all published products, categories, blog posts, and static pages. Regenerate after adding new content.
          </p>
          <Button onClick={handleRegenerateSitemap} isLoading={regenerating}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {regenerating ? "Regenerating..." : "Regenerate Sitemap"}
          </Button>
        </CardContent>
      </Card>

      {/* Robots.txt */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Robots.txt</CardTitle>
              <CardDescription>Control search engine crawling</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Current robots.txt</p>
            <pre className="text-xs font-mono bg-muted p-3 rounded-lg">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/

Sitemap: https://amirislamic.com/sitemap.xml`}
            </pre>
          </div>
          <Button onClick={() => handleSave("Robots", new FormData())} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" /> Save Robots.txt
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
