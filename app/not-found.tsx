"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"

export default function NotFound() {
    const { t } = useLanguage()

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold mt-4 mb-2">{t('pageNotFound')}</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
                {t('pageNotFoundDescription')}
            </p>
            <Link href="/">
                <Button size="lg">
                    {t('goHome')}
                </Button>
            </Link>
        </div>
    )
}
