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
    BarChart3
} from "lucide-react"
import { ChatbotLoader } from "@/components/chatbot-loader"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"

export default function LandingPage() {
    const { t, language } = useLanguage()
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans">
            <PublicHeader transparent={true} />

            {/* Hero Section - Minimalist & Premium */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
                {/* Subtle Background - No heavy colors */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-25"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            {t('landingTagline') || "Next Gen AI Experience"}
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight">
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

            {/* Core Value Proposition - Focused on AI Assistant */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            {t('landingAiSupport') || "Intelligent AI Assistant"}
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
                            {t('landingAiSupportDesc') || "Transform your customer experience with our advanced AI chatbot."}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                        {/* Appointments */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{t('landingModAppointments')}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{t('landingModAppointmentsDesc')}</p>
                        </div>

                        {/* Voice */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{t('landingModVoice')}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{t('landingModVoiceDesc')}</p>
                        </div>

                        {/* Knowledge Base */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{t('landingModKnowledge')}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{t('landingModKnowledgeDesc')}</p>
                        </div>

                        {/* Omnichannel */}
                        <div className="p-10 bg-black hover:bg-zinc-900/50 transition-colors group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Share2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-white">{t('landingModOmni')}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{t('landingModOmniDesc')}</p>
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
