"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider, microsoftProvider, appleProvider } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface SocialAuthButtonsProps {
    mode: 'login' | 'signup'
    onSuccess?: (user: any, providerId: string) => void
    disabled?: boolean
}

export function SocialAuthButtons({ mode, onSuccess, disabled }: SocialAuthButtonsProps) {
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
    const { toast } = useToast()

    const handleSocialAuth = async (provider: any, providerId: string) => {
        setLoadingProvider(providerId)
        try {
            const result = await signInWithPopup(auth, provider)
            if (onSuccess) {
                onSuccess(result.user, providerId)
            }
        } catch (error: any) {
            console.error("Social auth error:", error)
            toast({
                title: "Authentication Error",
                description: error.message || "Failed to authenticate. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoadingProvider(null)
        }
    }

    const actionText = mode === 'login' ? 'Log in' : 'Sign up'

    return (
        <div className="grid gap-3">
            <Button
                variant="outline"
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => handleSocialAuth(googleProvider, 'google.com')}
                disabled={disabled || !!loadingProvider}
            >
                {loadingProvider === 'google.com' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                )}
                {actionText} with Google
            </Button>

            <Button
                variant="outline"
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => handleSocialAuth(microsoftProvider, 'microsoft.com')}
                disabled={disabled || !!loadingProvider}
            >
                {loadingProvider === 'microsoft.com' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                        <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                        <rect x="12" y="1" width="10" height="10" fill="#00a4ef" />
                        <rect x="1" y="12" width="10" height="10" fill="#7fba00" />
                        <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                    </svg>
                )}
                {actionText} with Microsoft
            </Button>

            <Button
                variant="outline"
                className="w-full h-11 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => handleSocialAuth(appleProvider, 'apple.com')}
                disabled={disabled || !!loadingProvider}
            >
                {loadingProvider === 'apple.com' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                )}
                {actionText} with Apple
            </Button>
        </div>
    )
}
