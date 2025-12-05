"use client"

import { UnifiedInbox } from "@/components/unified-inbox"
import { useAuth } from "@/context/AuthContext"

export default function ChatsPage() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="h-[calc(100vh-4rem)]">
            <UnifiedInbox userId={user.uid} />
        </div>
    )
}
