"use client"

import { ChatsList } from "@/components/chats-list"

export default function TenantChatsPage({ params }: { params: { userId: string } }) {
    return (
        <div className="p-6">
            <ChatsList targetUserId={params.userId} embedded={false} />
        </div>
    )
}
