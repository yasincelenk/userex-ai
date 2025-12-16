"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"

export function PublicFooter() {
    const { t } = useLanguage()

    return (
        <footer className="border-t border-white/10 py-12 bg-black">
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
                        © 2025 ex ai by Userex. {t('landingAllRights')}
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t('landingPrivacy')}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t('landingTerms')}</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">{t('landingContact')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
