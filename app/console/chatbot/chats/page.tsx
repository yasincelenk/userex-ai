"use client"

import { UnifiedInbox } from "@/components/unified-inbox"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

export default function ChatsPage() {
    const { user } = useAuth()
    const { t } = useLanguage()

    if (!user) return null

    return (
        <div className="h-[calc(100vh-4rem)] p-6 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('chats')}</h1>
                <p className="text-muted-foreground">View and manage your conversations with users.</p>
            </div>
            <div className="flex-1 min-h-0">
                <UnifiedInbox userId={user.uid} />
            </div>
        </div>
    )
}
