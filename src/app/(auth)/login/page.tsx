"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { login, resendVerificationEmail } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { SocialLogin } from "@/components/auth/social-login"
import toast from "react-hot-toast"

const OAUTH_ERRORS: Record<string, string> = {
  oauth_denied: "Access was denied by the provider. Please try again.",
  oauth_missing_params: "Invalid OAuth response. Please try again.",
  oauth_invalid_state: "Security validation failed. Please try again.",
  oauth_email_conflict:
    "An account with this email already exists. Sign in with your password first.",
  oauth_failed: "Authentication failed. Please try again later.",
  verification_failed: "This verification link is invalid or has expired.",
  rate_limited: "Too many attempts. Please try again later.",
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const error = searchParams.get("error")
    const checkEmail = searchParams.get("check-email")
    if (error) {
      toast.error(OAUTH_ERRORS[error] || "Authentication failed. Please try again.")
    } else if (checkEmail === "1") {
      toast.success("Account created! Check your email to verify your address.")
    }
    if (error || checkEmail) router.replace("/login")
  }, [searchParams, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)

      const result = await login(formData)

      if (result.success) {
        toast.success("Welcome back!")
        router.push("/")
        router.refresh()
      } else if (result.error) {
        const errorMsg =
          typeof result.error === "string"
            ? result.error
            : ("email" in result.error && result.error.email?.[0]) ||
              ("password" in result.error && result.error.password?.[0]) ||
              "Invalid credentials"
        toast.error(errorMsg)
        if ("code" in result && result.code === "UNVERIFIED_EMAIL") {
          setUnverifiedEmail(data.email)
        }
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendVerification() {
    if (!unverifiedEmail) return
    setIsResending(true)
    try {
      const formData = new FormData()
      formData.append("email", unverifiedEmail)
      const result = await resendVerificationEmail(formData)
      if (result.error) toast.error(result.error)
      else toast.success("Verification email sent. Please check your inbox.")
    } catch {
      toast.error("Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue shopping"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {unverifiedEmail && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Need a new verification link?
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            isLoading={isResending}
            onClick={handleResendVerification}
          >
            Resend verification email
          </Button>
        </div>
      )}

      <div className="mt-6">
        <SocialLogin />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
