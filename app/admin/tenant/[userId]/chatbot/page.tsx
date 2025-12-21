"use client"

import { DashboardStats } from "@/components/dashboard-stats"
import { useLanguage } from "@/context/LanguageContext"

export default function TenantDashboardPage({ params }: { params: { userId: string } }) {
    const { t } = useLanguage()

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('dashboardOverview')}</h2>
            <DashboardStats targetUserId={params.userId} />
        </div>
    )
}
