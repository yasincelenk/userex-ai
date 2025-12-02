"use client"

import IntegrationPage from "@/components/integration-page"
import { useAuth } from "@/context/AuthContext"

export default function IntegrationDashboardPage() {
    const { user } = useAuth()

    if (!user) return null

    return <IntegrationPage userId={user.uid} />
}
