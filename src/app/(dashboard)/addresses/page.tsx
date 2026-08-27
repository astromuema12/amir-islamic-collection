"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,

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
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Home,
  Briefcase,
} from "lucide-react"

interface Address {
  id: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  isDefault: boolean
  type: "home" | "work" | "other"
}

const initialAddresses: Address[] = [
  {
    id: "1",
    fullName: "Ahmad Abdullah",
    phone: "+2548012345678",
    street: "42 Kenyatta Avenue",
    city: "Nairobi",
    state: "Nairobi County",
    country: "Kenya",
    zipCode: "100271",
    isDefault: true,
    type: "home",
  },
  {
    id: "2",
    fullName: "Ahmad Abdullah",
    phone: "+2548098765432",
    street: "15 Marina Road, Suite 301",
    city: "Nairobi",
    state: "Nairobi County",
    country: "Kenya",
    zipCode: "101241",
    isDefault: false,
    type: "work",
  },
]

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().min(3, "ZIP code is required"),
})

type AddressFormData = z.infer<typeof addressSchema>

const typeIcons = {
  home: Home,
  work: Briefcase,
  other: MapPin,
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  })

  const openAdd = () => {
    setEditingId(null)
    reset({ fullName: "", phone: "", street: "", city: "", state: "", country: "", zipCode: "" })
    setDialogOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    reset({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zipCode: addr.zipCode,
    })
    setDialogOpen(true)
  }

  const onSubmit = (data: AddressFormData) => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...data } : a))
      )
      toast.success("Address updated")
    } else {
      const newAddr: Address = {
        id: crypto.randomUUID(),
        ...data,
        isDefault: addresses.length === 0,
        type: "other",
      }
      setAddresses((prev) => [...prev, newAddr])
      toast.success("Address added")
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.success("Address deleted")
    setDeleteId(null)
  }

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
    toast.success("Default address updated")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            My Addresses
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {addresses.map((addr) => {
            const TypeIcon = typeIcons[addr.type] || MapPin
            return (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm capitalize">
                            {addr.type} Address
                          </CardTitle>
                        </div>
                      </div>
                      {addr.isDefault && (
                        <Badge variant="success" className="gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Default
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="text-muted-foreground">{addr.street}</p>
                    <p className="text-muted-foreground">
                      {addr.city}, {addr.state}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.country} - {addr.zipCode}
                    </p>
                    <p className="text-muted-foreground">{addr.phone}</p>
                  </CardContent>
                  <div className="flex items-center gap-1 border-t px-6 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => openEdit(addr)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    {!addr.isDefault && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs text-muted-foreground"
                          onClick={() => setDefault(addr.id)}
                        >
                          <Star className="h-3.5 w-3.5" />
                          Set Default
                        </Button>
                        <Dialog
                          open={deleteId === addr.id}
                          onOpenChange={(o) => setDeleteId(o ? addr.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-xs text-destructive ml-auto"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Address</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this address?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDeleteId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => handleDelete(addr.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No addresses saved
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add an address to get started with shipping
          </p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              Fill in the address details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Full name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            <Input
              label="Phone Number"
              placeholder="+254 801 234 5678"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Street Address"
              placeholder="Street address"
              error={errors.street?.message}
              {...register("street")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="City"
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label="State"
                placeholder="State"
                error={errors.state?.message}
                {...register("state")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Country"
                placeholder="Country"
                error={errors.country?.message}
                {...register("country")}
              />
              <Input
                label="ZIP Code"
                placeholder="ZIP code"
                error={errors.zipCode?.message}
                {...register("zipCode")}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Save Changes" : "Add Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
