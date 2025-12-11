"use client"

import { KnowledgeBase } from "@/components/knowledge-base"
import { useAuth } from "@/context/AuthContext"

export default function KnowledgePage() {
    const { user } = useAuth()

    if (!user) return null

    return <KnowledgeBase targetUserId={user.uid} />
}
