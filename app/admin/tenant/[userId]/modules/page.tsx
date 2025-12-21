"use client"

import { ModulesContent } from "@/components/modules-content"

export default function TenantModulesPage({ params }: { params: { userId: string } }) {
    return <ModulesContent targetUserId={params.userId} />
}
