
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSystemStats, getResourceUsageOverTime, getAiConsumptionStats, SystemStats, ResourceUsageData, AiConsumptionStats } from "@/lib/super-admin-service";
import { Users, Bot, MessageSquare, Database, Activity, TrendingUp, Cpu, Zap, DollarSign } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function ResourceDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [chartData, setChartData] = useState<ResourceUsageData[]>([]);
    const [aiStats, setAiStats] = useState<AiConsumptionStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, historyData, aiData] = await Promise.all([
                    getSystemStats(),
                    getResourceUsageOverTime(),
                    getAiConsumptionStats()
                ]);
                setStats(statsData);
                setChartData(historyData);
                setAiStats(aiData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('totalTenants') || "Total Tenants"}
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalTenants || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.activeTenants || 0} {t('active') || "active"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('totalChatbots') || "Total Chatbots"}
                        </CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalChatbots || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('deployedChatbots') || "Deployed across all tenants"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('totalChatSessions') || "Total Chat Sessions"}
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalConversations.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('totalConversations') || "Total conversations recorded"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('totalMessages') || "Messages (Est.)"}
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalMessages.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('messagesProcessed') || "Messages processed"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Consumption Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total AI Consumption
                        </CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(aiStats?.totalInputTokens || 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">in</span></div>
                        <div className="text-2xl font-bold">{(aiStats?.totalOutputTokens || 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">out</span></div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tokens processed by LLMs
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            API Calls
                        </CardTitle>
                        <Cpu className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(aiStats?.totalApiCalls || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Total model interactions
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Estimated Cost
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(aiStats?.totalCost || 0).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Approx. operational cost
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white dark:bg-gray-900 border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            Usage Trends
                        </CardTitle>
                        <CardDescription>
                            Conversations and Chatbot growth over the last 30 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorBot" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="conversations" stroke="#22c55e" fillOpacity={1} fill="url(#colorConv)" name="Conversations" />
                                    <Area type="monotone" dataKey="chatbots" stroke="#8884d8" fillOpacity={1} fill="url(#colorBot)" name="Active Chatbots" />
                                    <Legend verticalAlign="top" height={36} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-white dark:bg-gray-900 border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            Tenant Growth
                        </CardTitle>
                        <CardDescription>
                            New tenant registrations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar dataKey="tenants" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tenants" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
