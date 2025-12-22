"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Command, Bot, ShoppingBag, PenTool, Search, Scan, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Ensure persistence is set before signing in
      await setPersistence(auth, browserLocalPersistence)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Check if user is active in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.isActive === false) {
          await auth.signOut()
          const msg = t('accountPendingApproval')
          setError(msg)
          toast({
            title: t('accountPendingTitle'),
            description: msg,
            variant: "destructive",
          })
          return
        }
      }

      router.push("/platform")
    } catch (error: any) {
      console.error("Login error:", error)
      const msg = t('invalidEmailPassword')
      setError(msg)
      toast({
        title: t('error'),
        description: msg,
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
            <Image
              src="/exai-logo.png"
              alt="ex ai"
              width={100}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="space-y-8 max-w-md">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{t('loginHeroTitle')}</h2>
              <p className="text-gray-400">{t('loginHeroSubtitle')}</p>
            </div>
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 border border-lime-500/20">
                  <Bot className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('featureCustSupportTitle')}</h3>
                  <p className="text-sm text-gray-400">{t('featureCustSupportDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <ShoppingBag className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('featureShopperTitle')}</h3>
                  <p className="text-sm text-gray-400">{t('featureShopperDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <PenTool className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('featureCopywriterTitle')}</h3>
                  <p className="text-sm text-gray-400">{t('featureCopywriterDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                  <Search className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('featureLeadFinderTitle')}</h3>
                  <p className="text-sm text-gray-400">{t('featureLeadFinderDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Scan className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('featureAuditorTitle')}</h3>
                  <p className="text-sm text-gray-400">{t('featureAuditorDesc')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {t('copyright')}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 relative">
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <LanguageSwitcher />
        </div>
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              {t('back') || (t.language === 'tr' ? 'Ana Sayfa' : 'Home')}
            </Button>
          </Link>
        </div>
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{t('login')}</h1>
            <p className="text-balance text-muted-foreground">
              {t('loginDescription')}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/15 border border-red-500/50 rounded-md p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              {error}
            </div>
          )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                  {t('forgotPassword')}
                </Link>
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
