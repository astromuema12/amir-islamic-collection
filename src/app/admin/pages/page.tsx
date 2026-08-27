"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Eye, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  isPublished: boolean
}

const initialPages: Page[] = [
  { id: "home-hero", title: "Homepage Hero Section", slug: "home-hero", content: "Welcome to Amir Islamic Collections - Your destination for premium Islamic products. Discover prayer mats, Qur'ans, hijabs, perfumes, and more.", isPublished: true },
  { id: "home-featured", title: "Homepage Featured Products", slug: "home-featured", content: "Featured products section configuration.", isPublished: true },
  { id: "home-about", title: "Homepage About Section", slug: "home-about", content: "Amir Islamic Collections is a trusted marketplace for authentic Islamic products. We connect you with quality sellers offering everything from prayer essentials to modest fashion.", isPublished: true },
  { id: "about", title: "About Us", slug: "about", content: "Learn about our mission to provide quality Islamic products to the global Muslim community.", isPublished: true },
  { id: "terms", title: "Terms & Conditions", slug: "terms", content: "Terms and conditions content...", isPublished: true },
  { id: "privacy", title: "Privacy Policy", slug: "privacy", content: "Privacy policy content...", isPublished: true },
  { id: "shipping", title: "Shipping Policy", slug: "shipping", content: "Shipping policy content...", isPublished: true },
  { id: "refund", title: "Refund Policy", slug: "refund", content: "Refund policy content...", isPublished: true },
  { id: "faq", title: "FAQ Page", slug: "faq", content: "Frequently asked questions content...", isPublished: true },
  { id: "contact", title: "Contact Page", slug: "contact", content: "Contact page content and map configuration.", isPublished: true },
]

export default function AdminPagesPage() {
  const [pages, setPages] = useState(initialPages)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editTitle, setEditTitle] = useState("")

  const handleEdit = (page: Page) => {
    setEditingId(page.id)
    setEditTitle(page.title)
    setEditContent(page.content)
  }

  const handleSave = (id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, title: editTitle, content: editContent } : p))
    setEditingId(null)
    toast.success("Page updated")
  }

  const handleToggle = (id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    toast.success("Page status toggled")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight premium-heading">Pages</h1>
        <p className="text-muted-foreground">Manage static pages and homepage sections</p>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="homepage">Homepage Sections</TabsTrigger>
          <TabsTrigger value="legal">Legal Pages</TabsTrigger>
          <TabsTrigger value="other">Other Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-4">
          {pages.filter(p => p.slug.startsWith("home-")).map(page => (
            <PageEditorCard
              key={page.id}
              page={page}
              isEditing={editingId === page.id}
              editTitle={editTitle}
              editContent={editContent}
              onTitleChange={setEditTitle}
              onContentChange={setEditContent}
              onEdit={() => handleEdit(page)}
              onSave={() => handleSave(page.id)}
              onToggle={() => handleToggle(page.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          {pages.filter(p => ["terms", "privacy", "shipping", "refund"].includes(p.slug)).map(page => (
            <PageEditorCard
              key={page.id}
              page={page}
              isEditing={editingId === page.id}
              editTitle={editTitle}
              editContent={editContent}
              onTitleChange={setEditTitle}
              onContentChange={setEditContent}
              onEdit={() => handleEdit(page)}
              onSave={() => handleSave(page.id)}
              onToggle={() => handleToggle(page.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          {pages.filter(p => !p.slug.startsWith("home-") && !["terms", "privacy", "shipping", "refund"].includes(p.slug)).map(page => (
            <PageEditorCard
              key={page.id}
              page={page}
              isEditing={editingId === page.id}
              editTitle={editTitle}
              editContent={editContent}
              onTitleChange={setEditTitle}
              onContentChange={setEditContent}
              onEdit={() => handleEdit(page)}
              onSave={() => handleSave(page.id)}
              onToggle={() => handleToggle(page.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function PageEditorCard({
  page, isEditing, editTitle, editContent,
  onTitleChange, onContentChange,
  onEdit, onSave, onToggle, onCancel
}: {
  page: Page
  isEditing: boolean
  editTitle: string
  editContent: string
  onTitleChange: (v: string) => void
  onContentChange: (v: string) => void
  onEdit: () => void
  onSave: () => void
  onToggle: () => void
  onCancel: () => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-base">{isEditing ? (
            <Input value={editTitle} onChange={e => onTitleChange(e.target.value)} className="font-semibold" />
          ) : page.title}</CardTitle>
          <CardDescription>/{page.slug}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {page.isPublished ? (
            <Badge variant="success">Published</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" /> Save</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={onToggle}>
                <Eye className="h-4 w-4 mr-1" />
                {page.isPublished ? "Unpublish" : "Publish"}
              </Button>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea value={editContent} onChange={e => onContentChange(e.target.value)} rows={8} className="font-mono text-sm" />
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{page.content}</p>
        )}
      </CardContent>
    </Card>
  )
}
