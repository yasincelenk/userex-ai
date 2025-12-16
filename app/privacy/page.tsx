"use client"

import { PublicHeader } from "@/components/public-header"
import { useLanguage } from "@/context/LanguageContext"

export default function PrivacyPage() {
    const { t } = useLanguage()

    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-lime-500/20 font-sans">
            <PublicHeader />

            <main className="container mx-auto px-4 py-16 max-w-4xl pt-32">
                <h1 className="text-4xl font-bold mb-8">{t('privacyTitle')}</h1>
                <p className="text-muted-foreground mb-8">{t('lastUpdated')}: December 14, 2025</p>

                <div className="prose prose-lg max-w-none text-gray-300 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy1Title')}</h2>
                        <p>{t('privacy1Content')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy2Title')}</h2>
                        <p>{t('privacy2Content')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy3Title')}</h2>
                        <p>{t('privacy3Content')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy4Title')}</h2>
                        <p>{t('privacy4Content')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy5Title')}</h2>
                        <p>{t('privacy5Content')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy6Title')}</h2>
                        <p>{t('privacy6Content')}</p>
                    </section>
                </div>
            </main>
        </div>
    )
}
