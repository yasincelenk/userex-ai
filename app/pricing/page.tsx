"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PublicHeader } from "@/components/public-header"
import { useLanguage } from "@/context/LanguageContext"
import { ArrowRight, Mail, Sparkles } from "lucide-react"

export default function PricingPage() {
    const { t } = useLanguage()

    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-lime-500/20 font-sans flex flex-col">
            <PublicHeader />

            <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/20 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                        <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-4 py-1.5 text-sm font-medium text-lime-400">
                            <Sparkles className="w-4 h-4" />
                            <span>{t('pricingComingSoon')}</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight" dangerouslySetInnerHTML={{ __html: t('pricingFlexiblePlans') }} />
                            <p className="text-xl text-gray-400 leading-relaxed max-w-lg mx-auto">
                                {t('pricingFinalizingStructure')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/contact">
                                <Button size="lg" className="bg-lime-500 text-black hover:bg-lime-400 font-semibold h-12 px-8 rounded-full shadow-lg shadow-lime-500/20 transition-all hover:scale-105">
                                    {t('pricingGetQuote')}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <a href="mailto:info@userex.com.tr">
                                <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 text-white h-12 px-8 rounded-full transition-all hover:scale-105">
                                    <Mail className="mr-2 w-4 h-4" />
                                    {t('pricingContactSupport')}
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-white/10 py-12 bg-black/50 backdrop-blur-sm z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <Image
                                src="/exai-logo.png"
                                alt="ex ai"
                                width={100}
                                height={28}
                                className="h-6 w-auto object-contain"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2025 ex ai. {t('landingAllRights')}
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <Link href="/privacy" className="hover:text-white transition-colors">{t('landingPrivacy')}</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">{t('landingTerms')}</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">{t('landingContact')}</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
