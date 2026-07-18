"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Plus, Pencil, Trash2, Search, Eye, EyeOff,
  Calendar, FileText, User
} from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  published: boolean
  tags: string[]
  createdAt: Date
}

const mockPosts: BlogPost[] = []

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formExcerpt, setFormExcerpt] = useState("")
  const [formPublished, setFormPublished] = useState(false)
  const [formImage, setFormImage] = useState("")

  const filtered = posts.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / 10)
  const paginated = filtered.slice((page - 1) * 10, page * 10)

  const handleNew = () => {
    setEditing(null)
    setFormTitle(""); setFormContent(""); setFormExcerpt(""); setFormPublished(false); setFormImage("")
    setDialogOpen(true)
  }

  const handleEdit = (post: BlogPost) => {
    setEditing(post)
    setFormTitle(post.title); setFormContent(post.content); setFormExcerpt(post.excerpt); setFormPublished(post.published)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim()) { toast.error("Title and content are required"); return }
    const post: BlogPost = {
      id: editing?.id || `blog-${Date.now()}`,
      title: formTitle,
      slug: editing?.slug || formTitle.toLowerCase().replace(/\s+/g, "-"),
      excerpt: formExcerpt,
      content: formContent,
      author: editing?.author || "Admin",
      published: formPublished,
      tags: editing?.tags || [],
      createdAt: editing?.createdAt || new Date(),
    }
    if (editing) {
      setPosts(prev => prev.map(p => p.id === editing.id ? post : p))
      toast.success("Blog post updated")
    } else {
      setPosts(prev => [post, ...prev])
      toast.success("Blog post created")
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setPosts(prev => prev.filter(p => p.id !== deleteId))
    setDeleteId(null)
    toast.success("Blog post deleted")
  }

  const handleToggle = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !p.published } : p))
    toast.success("Status toggled")
  }

  const columns: Column<BlogPost>[] = [
    {
      key: "title", label: "Title",
      render: (p) => (
        <div className="max-w-sm">
          <p className="font-medium line-clamp-1">{p.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{p.excerpt}</p>
        </div>
      ),
    },
    { key: "author", label: "Author", render: (p) => <span className="text-sm">{p.author}</span> },
    {
      key: "published", label: "Status",
      render: (p) => p.published
        ? <Badge variant="success"><Eye className="h-3 w-3 mr-1" /> Published</Badge>
        : <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" /> Draft</Badge>,
    },
    {
      key: "tags", label: "Tags",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.tags.map((tag, i) => <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>)}
        </div>
      ),
    },
    { key: "createdAt", label: "Date", render: (p) => <span className="text-xs text-muted-foreground">{formatDateTime(p.createdAt)}</span> },
    {
      key: "actions", label: "Actions",
      render: (p) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(p.id)}>
            {p.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Blogs</h1>
          <p className="text-muted-foreground">Manage blog posts</p>
        </div>
        <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4" /> New Post</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search posts..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
      </div>

      <DataTable columns={columns} data={paginated} total={filtered.length} page={page} totalPages={totalPages} onPageChange={setPage} searchable={false} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Blog Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input label="Title" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Post title" />
            <Input label="Image URL" value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="https://..." />
            <Textarea label="Excerpt" value={formExcerpt} onChange={e => setFormExcerpt(e.target.value)} placeholder="Brief summary..." rows={2} />
            <Textarea label="Content" value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="Write your blog post content here..." rows={8} />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Published</label>
              <Switch checked={formPublished} onCheckedChange={setFormPublished} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Blog Post</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
