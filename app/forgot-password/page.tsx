"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Command, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)
    const { toast } = useToast()
    const { t } = useLanguage()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await sendPasswordResetEmail(auth, email)
            setIsEmailSent(true)
            toast({
                title: "Email sent",
                description: "Check your email for a link to reset your password.",
            })
        } catch (error: any) {
            console.error("Reset password error:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isEmailSent) {
        return (
            <div className="flex h-screen w-full items-center justify-center px-4">
                <div className="mx-auto grid w-[350px] gap-6 text-center">
                    <div className="grid gap-2">
                        <h1 className="text-3xl font-bold">Check your email</h1>
                        <p className="text-muted-foreground">
                            We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                        </p>
                    </div>
                    <Link href="/login">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
            <div className="hidden bg-muted lg:block relative">
                <div className="absolute inset-0 bg-black" />
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center text-lg font-medium">
                        <Command className="mr-2 h-6 w-6" />
                        Userex AI Assistant
                    </div>
                    <div className="space-y-2">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;Security is not just a feature, it's a foundation.&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center py-12 relative">
                <div className="absolute top-4 right-4 md:top-8 md:right-8">
                    <LanguageSwitcher />
                </div>
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Forgot Password</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>
                    <form onSubmit={handleResetPassword} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/login" className="flex items-center justify-center underline text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
