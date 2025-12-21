"use client"

import { LeadsContent } from "@/components/leads-content"

export default function TenantLeadsPage({ params }: { params: { userId: string } }) {
    return <LeadsContent targetUserId={params.userId} />
}
