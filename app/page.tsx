"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Bot,
    CheckCircle2,
    Globe,
    Layout,
    Shield,
    Zap,
    ShoppingBag,
    PenTool,
    Search,
    BarChart3,
    Users,
} from "lucide-react"
import Script from "next/script"

import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"

export default function LandingPage() {
    const { t, language } = useLanguage()
    const { user } = useAuth()

    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-lime-500/20 font-sans">
            <PublicHeader transparent={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-900/20 via-black to-black pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-lime-400 animate-fade-in backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                            </span>
                            {t('landingTagline')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 pb-2">
                            {t('landingHeroTitle')}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t('landingHeroSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            {user ? (
                                <Link href="/platform">
                                    <Button className="h-12 px-8 text-lg bg-lime-600 hover:bg-lime-500 text-white shadow-lg shadow-lime-500/25 w-full sm:w-auto transition-all hover:scale-105">
                                        {language === 'tr' ? 'Panele Git' : 'Go to Console'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/signup">
                                    <Button className="h-12 px-8 text-lg bg-lime-600 hover:bg-lime-500 text-white shadow-lg shadow-lime-500/25 w-full sm:w-auto transition-all hover:scale-105">
                                        {t('landingStartFree')}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            {t('landingMeetAiTeam')}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t('landingMeetAiTeamDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* AI Chatbot - Featured */}
                        <div className="group relative overflow-hidden rounded-3xl border-2 border-lime-500/50 bg-lime-500/5 p-8 hover:bg-lime-500/10 transition-all duration-300 md:col-span-2">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                                <Bot className="w-48 h-48" />
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-lime-500 text-black text-xs font-bold rounded-full">⭐ {language === 'tr' ? 'ÖNE ÇIKAN' : 'FEATURED'}</span>
                            </div>
                            <div className="relative z-10 space-y-4 max-w-2xl">
                                <div className="w-16 h-16 rounded-2xl bg-lime-500/20 flex items-center justify-center">
                                    <Bot className="w-8 h-8 text-lime-400" />
                                </div>
                                <h3 className="text-3xl font-bold">{t('landingAiSupport')}</h3>
                                <p className="text-muted-foreground text-lg">
                                    {t('landingAiSupportDesc')}
                                </p>
                                <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-lime-500" /> {t('landingMultilingual')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-lime-500" /> {t('landingLeadCollection')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-lime-500" /> {t('landingSeamlessHandoff')}</li>
                                </ul>
                                <Link href="/products/ai-support">
                                    <Button variant="outline" className="mt-4 border-lime-500/50 text-lime-400 hover:bg-lime-500/10 hover:text-lime-300">
                                        {language === 'tr' ? 'Daha Fazla Bilgi' : 'Learn More'}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Personal Shopper */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShoppingBag className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold">{t('landingPersonalShopper')}</h3>
                                <p className="text-muted-foreground">
                                    {t('landingPersonalShopperDesc')}
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t('landingSmartRecommendations')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t('landingVisualSearch')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t('landingUpselling')}</li>
                                </ul>
                            </div>
                        </div>

                        {/* AI Copywriter */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <PenTool className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <PenTool className="w-6 h-6 text-pink-400" />
                                </div>
                                <h3 className="text-2xl font-bold">{t('landingAiCopywriter')}</h3>
                                <p className="text-muted-foreground">
                                    {t('landingAiCopywriterDesc')}
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> {t('landingSeoOptimized')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> {t('landingMultiFormat')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> {t('landingBrandVoice')}</li>
                                </ul>
                            </div>
                        </div>

                        {/* Lead Finder */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300 md:col-span-2">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Search className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Search className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">{t('landingLeadFinder')}</h3>
                                <p className="text-muted-foreground">
                                    {t('landingLeadFinderDesc')}
                                </p>
                                <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t('landingAutomatedProspecting')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t('landingEmailEnrichment')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t('landingCrmIntegration')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landingEverythingYouNeed')}</h2>
                        <p className="text-muted-foreground">{t('landingEverythingYouNeedDesc')}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                titleKey: 'landingGlobalReach' as const,
                                descKey: 'landingGlobalReachDesc' as const
                            },
                            {
                                icon: BarChart3,
                                titleKey: 'landingDeepAnalytics' as const,
                                descKey: 'landingDeepAnalyticsDesc' as const
                            },
                            {
                                icon: Zap,
                                titleKey: 'landingInstantSetup' as const,
                                descKey: 'landingInstantSetupDesc' as const
                            },
                            {
                                icon: Shield,
                                titleKey: 'landingEnterpriseSecurity' as const,
                                descKey: 'landingEnterpriseSecurityDesc' as const
                            },
                            {
                                icon: Layout,
                                titleKey: 'landingCustomBranding' as const,
                                descKey: 'landingCustomBrandingDesc' as const
                            },
                            {
                                icon: Users,
                                titleKey: 'landingTeamCollab' as const,
                                descKey: 'landingTeamCollabDesc' as const
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white/80" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
                                <p className="text-muted-foreground">{t(feature.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-lime-900/20 to-black pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {t('landingReadyToTransform')}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t('landingReadyToTransformDesc')}
                        </p>
                        <Link href="/signup">
                            <Button className="h-14 px-10 text-lg bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 transition-all hover:scale-105">
                                {t('landingCreateAccount')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
            <Script
                src="/widget.js"
                data-chatbot-id="qqv4HRZyAuUwsApyYxoBEgTs4hC2"
                strategy="afterInteractive"
            />
        </div>
    )
}
