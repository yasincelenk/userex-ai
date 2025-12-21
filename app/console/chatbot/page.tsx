"use client"

import { DashboardStats } from "@/components/dashboard-stats";
import { useAuth } from "@/context/AuthContext";
import { SuperAdminDashboard } from "@/components/super-admin-dashboard";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ChatbotConsolePage() {
    const { role, user } = useAuth()
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

            {/* Widget Test Card */}
            <Card className="mt-6">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Play className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{t('testWidget') || "Widget'ı Test Et"}</CardTitle>
                            <CardDescription>{t('testWidgetDesc') || "Widget'ınızın gerçekte nasıl göründüğünü test edin."}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Link href={`/widget-test?id=${user?.uid}`} target="_blank">
                        <Button className="gap-2">
                            {t('testWidget') || "Widget'ı Test Et"} <ExternalLink className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
