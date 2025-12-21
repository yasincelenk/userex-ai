"use client"

import { KnowledgeBase } from "@/components/knowledge-base"

export default function TenantKnowledgePage({ params }: { params: { userId: string } }) {
    return (
        <div className="p-6">
            <KnowledgeBase targetUserId={params.userId} embedded={false} />
        </div>
    )
}
