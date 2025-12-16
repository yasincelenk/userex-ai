
"use client";

import { ResourceDashboard } from "@/components/super-admin/resource-dashboard";
import { useLanguage } from "@/context/LanguageContext";

export default function SuperAdminResourcesPage() {
    const { t } = useLanguage();

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI & System Resource Usage</h2>
                    <p className="text-muted-foreground">{t('systemPerformanceOverview') || "System performance overview and resource analytics."}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-muted px-4 py-2 rounded-md text-sm font-medium">
                        {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            <ResourceDashboard />
        </div>
    );
}

