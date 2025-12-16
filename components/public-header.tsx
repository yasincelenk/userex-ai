import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

interface PublicHeaderProps {
    transparent?: boolean
}

export function PublicHeader({ transparent = false }: PublicHeaderProps) {
    const { t, language, setLanguage } = useLanguage()
    const { user } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const languageLabels: Record<string, string> = {
        en: "English",
        tr: "Türkçe"
    }

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 border-b transition-all duration-300",
            isScrolled || !transparent
                ? "border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 shadow-lg shadow-black/5"
                : "border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent"
        )}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Link href="/">
                        <Image
                            src="/exai-logo.png"
                            alt="ex ai"
                            width={100}
                            height={24}
                            className="h-6 w-auto object-contain"
                        />
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/#products" className="hover:text-white transition-colors">{t('landingProducts')}</Link>
                    <Link href="/#features" className="hover:text-white transition-colors">{t('landingFeatures')}</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">{t('landingPricing')}</Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 gap-1">
                                <Globe className="w-4 h-4" />
                                {languageLabels[language] || language.toUpperCase()}
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black border-white/10">
                            <DropdownMenuItem onClick={() => setLanguage('en')} className="text-white hover:bg-white/10 cursor-pointer">
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('tr')} className="text-white hover:bg-white/10 cursor-pointer">
                                Türkçe
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <Link href="/platform">
                            <Button className="bg-white text-black hover:bg-white/90 font-medium shadow-lg shadow-white/10">
                                {language === 'tr' ? 'Panele Git' : 'Go to Console'}
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                                    {t('login')}
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-white text-black hover:bg-white/90 font-medium shadow-lg shadow-white/10">
                                    {t('landingGetStarted')}
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
