'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [ready, setReady] = useState(false)

  const router = useRouter()

  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!supabase) {
      setError("Authentication service is not available")
      return
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setError(
          "Failed to verify password reset token. Please request a new one."
        )
        return
      }
      setReady(true)
    })
  }, [supabase])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!supabase) {
      setError("Authentication service is not available")
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Password updated successfully!")
      setError("")
      setTimeout(() => {
        router.push("/admin-login")
      }, 2000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-center text-sm text-gray-600">
              {error || "Verifying your password reset token..."}
            </p>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  required
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>

              {message && (
                <p className="text-green-500 text-sm">{message}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
