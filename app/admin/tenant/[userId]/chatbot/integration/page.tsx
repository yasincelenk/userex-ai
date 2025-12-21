"use client"

import IntegrationPage from "@/components/integration-page"

export default function TenantIntegrationPage({ params }: { params: { userId: string } }) {
    return <IntegrationPage userId={params.userId} />
}
