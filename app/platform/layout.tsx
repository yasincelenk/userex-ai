"use client"

import { SiteHeader } from "@/components/site-header"
import { LanguageProvider } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { AuthGuard } from "@/components/auth-guard"

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, enableChatbot } = useAuth()

    return (
        <AuthGuard>
            <LanguageProvider>
                <div className="flex flex-col h-screen w-full bg-muted/5">
                    <SiteHeader showSidebarTrigger={false} />
                    <div className="flex flex-1 overflow-hidden">
                        <main className="flex-1 overflow-y-auto w-full">
                            <div className="max-w-7xl mx-auto p-4 md:p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </LanguageProvider>
        </AuthGuard>
    )
}
