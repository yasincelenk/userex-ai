"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Command, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function SignUpForm() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [companyWebsite, setCompanyWebsite] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { toast } = useToast()
    const { t } = useLanguage()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            const msg = "Passwords do not match."
            setError(msg)
            toast({
                title: t('error'),
                description: msg,
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Create user document with default role and extra fields
            // Set isActive to false for application-based flow
            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                companyName,
                companyWebsite,
                email: user.email,
                role: "TENANT_ADMIN",
                createdAt: new Date().toISOString(),
                isActive: false // User must be approved by admin
            })

            // Create default chatbot document
            await setDoc(doc(db, "chatbots", user.uid), {
                companyName: companyName || "Acme Corp",
                welcomeMessage: "Hello! How can I help you today?",
                brandColor: "#000000",
                brandLogo: "",
                suggestedQuestions: ["What are your pricing plans?", "How do I get started?", "Contact support"],
                enableLeadCollection: false,
                createdAt: new Date().toISOString()
            })

            // No email verification needed for application flow

            setIsSuccess(true)
            toast({
                title: t('success'),
                description: "Application received successfully.",
            })
        } catch (error: any) {
            console.error("Sign up error:", error)
            let errorMessage = error.message || t('failedToCreateAccount')

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email address is already in use. Please sign in instead."
            }

            setError(errorMessage)
            toast({
                title: t('error'),
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
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
                                    &ldquo;Join thousands of businesses using Userex AI to improve their customer support.&rdquo;
                                </p>
                            </blockquote>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12 relative">
                    <div className="mx-auto grid w-[350px] gap-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold">Application Received</h1>
                        <p className="text-muted-foreground">
                            Thank you for applying! Your account has been created and is pending approval.
                            Our team will review your application and contact you shortly.
                        </p>
                        <div className="grid gap-4">
                            <Link href="/login">
                                <Button className="w-full">
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    </div>
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
                                &ldquo;The best way to predict the future is to create it.&rdquo;
                            </p>
                            <footer className="text-sm">Peter Drucker</footer>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center py-12 relative overflow-y-auto">
                <div className="absolute top-4 right-4 md:top-8 md:right-8">
                    <LanguageSwitcher />
                </div>
                <div className="mx-auto grid w-[350px] gap-6 my-8">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Apply for Access</h1>
                        <p className="text-balance text-muted-foreground">
                            Fill out the form below to apply for an account.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/15 border border-red-500/50 rounded-md p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                placeholder="Acme Inc."
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="companyWebsite">Website</Label>
                            <Input
                                id="companyWebsite"
                                placeholder="https://example.com"
                                type="url"
                                required
                                value={companyWebsite}
                                onChange={(e) => setCompanyWebsite(e.target.value)}
                            />
                        </div>
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
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        {t('alreadyHaveAccount')}{" "}
                        <Link href="/login" className="underline">
                            {t('signIn')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
