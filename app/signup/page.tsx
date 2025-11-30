"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function SignUpForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { t } = useLanguage()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Create user document with default role
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: "TENANT_ADMIN",
                createdAt: new Date().toISOString(),
                isActive: true
            })

            toast({
                title: t('success'),
                description: t('accountCreated'),
            })
            router.push("/dashboard")
        } catch (error: any) {
            console.error("Sign up error:", error)
            toast({
                title: t('error'),
                description: error.message || t('failedToCreateAccount'),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">{t('signUp')}</CardTitle>
                    <CardDescription>
                        {t('signUpDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="grid gap-4">
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
                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('creatingAccount')}
                                </>
                            ) : (
                                t('createAccount')
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        {t('alreadyHaveAccount')}{" "}
                        <Link href="/" className="underline">
                            {t('signIn')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
