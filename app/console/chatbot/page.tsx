"use client"

import { DashboardStats } from "@/components/dashboard-stats";
import { useAuth } from "@/context/AuthContext";
import { SuperAdminDashboard } from "@/components/super-admin-dashboard";
import { useLanguage } from "@/context/LanguageContext";

export default function ChatbotConsolePage() {
    const { role } = useAuth()
    const { t } = useLanguage()

    if (role === 'SUPER_ADMIN') {
        return (
            <div className="p-8">
                <SuperAdminDashboard />
            </div>
        )
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('dashboardOverview')}</h2>
            <DashboardStats />
        </div>
    );
}
