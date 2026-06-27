"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Plus, Pencil, Trash2, ChevronRight, ChevronDown,
  ImagePlus, FolderTree, GripVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId: string | null
  isActive: boolean
  productCount: number
  children: Category[]
}

const initialCategories: Category[] = [
  {
    id: "1", name: "Prayer Mats", slug: "prayer-mats", description: "Premium prayer mats for daily salah",
    image: "", parentId: null, isActive: true, productCount: 234,
    children: [
      { id: "1a", name: "Velvet Prayer Mats", slug: "velvet-prayer-mats", description: "", image: "", parentId: "1", isActive: true, productCount: 67, children: [] },
      { id: "1b", name: "Travel Prayer Mats", slug: "travel-prayer-mats", description: "", image: "", parentId: "1", isActive: true, productCount: 45, children: [] },
    ],
  },
  {
    id: "2", name: "Holy Qur'an", slug: "holy-quran", description: "The Holy Qur'an in various sizes and bindings",
    image: "", parentId: null, isActive: true, productCount: 189,
    children: [
      { id: "2a", name: "Leather Bound", slug: "leather-bound", description: "", image: "", parentId: "2", isActive: true, productCount: 78, children: [] },
      { id: "2b", name: "Tajweed Qur'an", slug: "tajweed-quran", description: "", image: "", parentId: "2", isActive: true, productCount: 34, children: [] },
    ],
  },
  {
    id: "3", name: "Tasbih", slug: "tasbih", description: "Islamic prayer beads",
    image: "", parentId: null, isActive: true, productCount: 156,
    children: [],
  },
  {
    id: "4", name: "Islamic Clothing", slug: "islamic-clothing", description: "Modest Islamic fashion",
    image: "", parentId: null, isActive: true, productCount: 412,
    children: [
      { id: "4a", name: "Abayas", slug: "abayas", description: "", image: "", parentId: "4", isActive: true, productCount: 167, children: [] },
      { id: "4b", name: "Hijabs", slug: "hijabs", description: "", image: "", parentId: "4", isActive: true, productCount: 189, children: [] },
      { id: "4c", name: "Thobes", slug: "thobes", description: "", image: "", parentId: "4", isActive: true, productCount: 56, children: [] },
    ],
  },
  {
    id: "5", name: "Home Decor", slug: "home-decor", description: "Islamic wall art and home decorations",
    image: "", parentId: null, isActive: false, productCount: 89,
    children: [],
  },
]

function CategoryRow({
  category, level, onEdit, onDelete, onToggle
}: {
  category: Category
  level: number
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b",
          !category.isActive && "opacity-60"
        )}
        style={{ paddingLeft: `${16 + level * 24}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {category.children.length > 0 ? (
            expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="w-4" />
          )}
        </button>
        <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
        <div className="flex-1 flex items-center gap-3">
          {category.image ? (
            <img src={category.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <FolderTree className="h-5 w-5 text-primary" />
          )}
          <div>
            <p className="text-sm font-medium">{category.name}</p>
            <p className="text-xs text-muted-foreground">/{category.slug}</p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {category.productCount} products
        </Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(category)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Switch checked={category.isActive} onCheckedChange={() => onToggle(category.id)} />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(category.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {expanded && category.children.map(child => (
        <CategoryRow key={child.id} category={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [editDialog, setEditDialog] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = []
    for (const cat of cats) {
      result.push(cat)
      result.push(...flattenCategories(cat.children))
    }
    return result
  }

  const allCategories = flattenCategories(categories).filter(c => !c.parentId)

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setEditDialog(true)
  }

  const handleNew = () => {
    setEditing(null)
    setEditDialog(true)
  }

  const handleSave = (formData: { name: string; description: string; parentId: string | null; isActive: boolean }) => {
    if (editing) {
      setCategories(prev => updateCategory(prev, editing.id, { ...editing, ...formData }))
      toast.success("Category updated")
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`, name: formData.name, slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description, image: "", parentId: formData.parentId,
        isActive: formData.isActive, productCount: 0, children: [],
      }
      if (formData.parentId) {
        setCategories(prev => addChildCategory(prev, formData.parentId!, newCat))
      } else {
        setCategories(prev => [...prev, newCat])
      }
      toast.success("Category created")
    }
    setEditDialog(false)
  }

  const updateCategory = (cats: Category[], id: string, updated: Category): Category[] =>
    cats.map(cat => {
      if (cat.id === id) return updated
      return { ...cat, children: updateCategory(cat.children, id, updated) }
    })

  const addChildCategory = (cats: Category[], parentId: string, child: Category): Category[] =>
    cats.map(cat => {
      if (cat.id === parentId) return { ...cat, children: [...cat.children, child] }
      return { ...cat, children: addChildCategory(cat.children, parentId, child) }
    })

  const handleDelete = (id: string) => {
    setCategories(prev => removeCategory(prev, id))
    setDeleteId(null)
    toast.success("Category deleted")
  }

  const removeCategory = (cats: Category[], id: string): Category[] =>
    cats.filter(cat => cat.id !== id).map(cat => ({
      ...cat, children: removeCategory(cat.children, id)
    }))

  const handleToggle = (id: string) => {
    setCategories(prev => toggleCategoryActive(prev, id))
  }

  const toggleCategoryActive = (cats: Category[], id: string): Category[] =>
    cats.map(cat => {
      if (cat.id === id) return { ...cat, isActive: !cat.isActive }
      return { ...cat, children: toggleCategoryActive(cat.children, id) }
    })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Category Tree</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {categories.map(cat => (
            <CategoryRow
              key={cat.id}
              category={cat}
              level={0}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
              onToggle={handleToggle}
            />
          ))}
          {categories.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No categories yet. Create your first category.
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        category={editing}
        parentCategories={allCategories}
        onSave={handleSave}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete this category? Products in this category will become uncategorized.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteId!)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function CategoryDialog({
  open, onOpenChange, category, parentCategories, onSave
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  parentCategories: Category[]
  onSave: (data: { name: string; description: string; parentId: string | null; isActive: boolean }) => void
}) {
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [parentId, setParentId] = useState<string>("none")
  const [isActive, setIsActive] = useState(category?.isActive ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error("Category name is required"); return }
    onSave({
      name: name.trim(),
      description,
      parentId: parentId === "none" ? null : parentId,
      isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Category Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Prayer Mats" required />
          <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Parent Category</label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder="None (top level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {parentCategories.filter(c => c.id !== category?.id).map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Active</label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{category ? "Save Changes" : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
