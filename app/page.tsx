"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Bot,
    CheckCircle2,
    Zap,
    MessageSquare,
    Mic,
    Database,
    Share2,
    Calendar,
    Shield,
    Globe,
    BarChart3,
    ShoppingBag,
    Mail,
    Users,
    TrendingUp,
    LineChart,
    ScanEye
} from "lucide-react"
import { ChatbotLoader } from "@/components/chatbot-loader"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { HeroBackground } from "@/components/landing/hero-background"

export default function LandingPage() {
    const { t, language } = useLanguage()
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans">
            <PublicHeader transparent={true} />

            {/* Hero Section - Minimalist & Premium */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
                <HeroBackground />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-25"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            {t('landingTagline') || "Next Gen AI Experience"}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                            {t('landingHeroTitle')}
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
                            {t('landingHeroSubtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            {user ? (
                                <Link href="/platform">
                                    <Button className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 transition-all rounded-full font-medium">
                                        {language === 'tr' ? 'Panele Git' : 'Go to Console'}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/signup">
                                    <Button className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 transition-all rounded-full font-medium">
                                        {t('landingStartFree')}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Value Proposition - Focused on AI Assistant & Shopping */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            {t('landingAiSupport') || "Intelligent AI Modules"}
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
                            {t('landingAiSupportDesc') || "Powerful modules designed to transform your customer experience."}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">

                        {/* 1. Shopping Assistant (Large) */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col justify-center items-center text-center md:col-span-2 lg:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white relative z-10">{t('landingPersonalShopper')}</h3>
                            <p className="text-zinc-400 text-base leading-relaxed max-w-md relative z-10">
                                {t('landingPersonalShopperDesc')}
                            </p>
                            <Link href="/products/personal-shopper" className="mt-8 relative z-10">
                                <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 font-medium shadow-lg shadow-white/10">
                                    {language === 'tr' ? 'Keşfet' : 'Explore'} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* 2. General Chat / AI Support */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Genel Sohbet' : 'General Chat'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'Müşteri sorularını yanıtlayan standart asistan.' : 'Standard assistant answering customer queries.'}</p>
                        </div>

                        {/* 3. Knowledge Base */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Bilgi & Eğitim' : 'Knowledge & Education'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'PDF ve web sitenizle yapay zekayı eğitin.' : 'Train AI with your PDFs and website.'}</p>
                        </div>

                        {/* 4. Customer Data Collection (New) */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Müşteri Bilgi Toplama' : 'Lead Collection'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'Sohbet sırasında Ad, Soyad, Telefon toplar.' : 'Collects Name, Phone during chat.'}</p>
                        </div>

                        {/* 5. Appointments */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Randevu & Takvim' : 'Appointments'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'Sohbet içinden randevu almasını sağlar.' : 'Allows booking appointments within chat.'}</p>
                        </div>

                        {/* 6. Voice Assistant */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Sesli Asistan' : 'Voice Assistant'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'Sesli konuşma ve dinleme özelliği.' : 'Voice speaking and listening capabilities.'}</p>
                        </div>

                        {/* 7. Social Media Sharing */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Share2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Sosyal Medya' : 'Social Sharing'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'Ürün kartlarını paylaşmasını sağlar.' : 'Share product cards easily.'}</p>
                        </div>

                        {/* 8. Email Marketing (New) */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'E-posta Pazarlama' : 'Email Marketing'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'E-postaları toplar ve senkronize eder.' : 'Collects emails and syncs marketing.'}</p>
                        </div>

                        {/* 9. Sales Optimization (New) */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{language === 'tr' ? 'Satış Optimizasyonu' : 'Sales Optimization'}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{language === 'tr' ? 'İndirim kodları, stok uyarıları, sepet kurtarma.' : 'Discount codes, stock alerts, cart recovery.'}</p>
                        </div>

                        {/* 10. Coming Soon: Competitor Analysis -> Competitive Sales Bot */}
                        <div className="p-10 bg-black/50 hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center relative overflow-hidden opacity-75 hover:opacity-100">
                            <div className="absolute top-4 right-4 bg-white/10 px-2 py-0.5 rounded text-[10px] font-medium text-white border border-white/5">
                                {language === 'tr' ? 'YAKINDA' : 'SOON'}
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <ScanEye className="w-6 h-6 text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-zinc-300">{language === 'tr' ? 'Rekabet Analizi Asistanı' : 'Competitive Analysis Bot'}</h3>
                            <p className="text-zinc-600 text-sm leading-relaxed">{language === 'tr' ? 'Müşterilere rakiplerden daha uygun fiyatlı olduğunuzu sohbet anında kanıtlar.' : 'Proves your price advantage to customers in real-time chat.'}</p>
                        </div>

                        {/* 11. Coming Soon: Market Trends -> Trend Recommendation Bot */}
                        <div className="p-10 bg-black/50 hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center relative overflow-hidden opacity-75 hover:opacity-100">
                            <div className="absolute top-4 right-4 bg-white/10 px-2 py-0.5 rounded text-[10px] font-medium text-white border border-white/5">
                                {language === 'tr' ? 'YAKINDA' : 'SOON'}
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <LineChart className="w-6 h-6 text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-zinc-300">{language === 'tr' ? 'Trend Öneri Asistanı' : 'Trend Recommendation Bot'}</h3>
                            <p className="text-zinc-600 text-sm leading-relaxed">{language === 'tr' ? 'Yükselen trendleri algılar ve sohbet sırasında en popüler ürünleri önerir.' : 'Detects trends and suggests popular products within the conversation.'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Minimalist */}
            <section className="py-24 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Globe,
                                titleKey: 'landingGlobalReach',
                                descKey: 'landingGlobalReachDesc'
                            },
                            {
                                icon: BarChart3,
                                titleKey: 'landingDeepAnalytics',
                                descKey: 'landingDeepAnalyticsDesc'
                            },
                            {
                                icon: Zap,
                                titleKey: 'landingInstantSetup',
                                descKey: 'landingInstantSetupDesc'
                            },
                            {
                                icon: Shield,
                                titleKey: 'landingEnterpriseSecurity',
                                descKey: 'landingEnterpriseSecurityDesc'
                            },
                            {
                                icon: MessageSquare,
                                titleKey: 'landingCustomBranding',
                                descKey: 'landingCustomBrandingDesc'
                            },
                            {
                                icon: CheckCircle2,
                                titleKey: 'landingTeamCollab',
                                descKey: 'landingTeamCollabDesc'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold mb-3 text-white">{t(feature.titleKey)}</h3>
                                <p className="text-zinc-500 leading-relaxed font-light">{t(feature.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Stark Monochrome */}
            <section className="py-32 relative overflow-hidden border-t border-white/5">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                        {t('landingReadyToTransform')}
                    </h2>
                    <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto font-light">
                        {t('landingReadyToTransformDesc')}
                    </p>
                    <Link href="/signup">
                        <Button className="h-14 px-12 text-lg bg-white text-black hover:bg-zinc-200 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {t('landingCreateAccount')}
                        </Button>
                    </Link>
                </div>
            </section>

            <PublicFooter />
            <ChatbotLoader chatbotId="qqv4HRZyAuUwsApyYxoBEgTs4hC2" />
        </div>
    )
}
