"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Camera, Save, Loader2 } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Ahmad Abdullah",
      phone: "+2348012345678",
      bio: "Islamic art enthusiast and collector. Love exploring beautiful prayer mats and Quranic calligraphy.",
    },
  })

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      toast.success("Profile updated successfully!")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          My Profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a profile photo to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                <AvatarImage
                  src={avatarPreview || "/avatars/default.png"}
                  alt="Profile"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  AA
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-accent"
              >
                <Camera className="h-4 w-4 text-muted-foreground" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>JPG, PNG or WebP</p>
              <p>Max 2MB</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email Address"
                type="email"
                value="ahmad.abdullah@example.com"
                disabled
                wrapperClassName="opacity-60"
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 801 234 5678"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Textarea
                label="Bio"
                placeholder="Tell us a little about yourself"
                rows={4}
                error={errors.bio?.message}
                {...register("bio")}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
