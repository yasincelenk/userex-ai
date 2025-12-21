"use client"

import { AnalyticsContent } from "@/components/analytics-content"

export default function TenantAnalyticsPage({ params }: { params: { userId: string } }) {
    return <AnalyticsContent targetUserId={params.userId} />
}
