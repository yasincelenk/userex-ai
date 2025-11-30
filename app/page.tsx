"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Command } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: t('error'),
        description: t('invalidEmailPassword'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
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
            <h1 className="text-3xl font-bold">{t('login')}</h1>
            <p className="text-balance text-muted-foreground">
              {t('loginDescription')}
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">{t('password')}</Label>
              </div>
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
                  {t('loggingIn')}
                </>
              ) : (
                t('login')
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('dontHaveAccount')}{" "}
            <Link href="/signup" className="underline">
              {t('signUp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
