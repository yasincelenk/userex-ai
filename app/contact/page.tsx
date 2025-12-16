"use client"

import { Button } from "@/components/ui/button"
import { Mail, MessageSquare } from "lucide-react"

import { PublicHeader } from "@/components/public-header"
import { useLanguage } from "@/context/LanguageContext"

export default function ContactPage() {
    const { t } = useLanguage()

    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-lime-500/20 font-sans">
            <PublicHeader />

            <main className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl font-bold">{t('contactTitle')}</h1>
                    <p className="text-xl text-muted-foreground">
                        {t('contactSubtitle')}
                    </p>

                    <div className="grid gap-6 md:grid-cols-2 mt-12">
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <Mail className="w-10 h-10 text-lime-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{t('emailSupportTitle')}</h3>
                            <p className="text-gray-400 text-sm mb-4">{t('emailSupportDesc')}</p>
                            <a href="mailto:support@userex.ai" className="text-lime-400 hover:text-lime-300 font-medium">
                                support@userex.ai
                            </a>
                        </div>

                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <MessageSquare className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{t('salesTitle')}</h3>
                            <p className="text-gray-400 text-sm mb-4">{t('salesDesc')}</p>
                            <a href="mailto:sales@userex.ai" className="text-purple-400 hover:text-purple-300 font-medium">
                                sales@userex.ai
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
