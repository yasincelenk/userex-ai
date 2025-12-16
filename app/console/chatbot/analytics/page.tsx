"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MessageSquare, Activity, Users, RefreshCw } from "lucide-react"
import { AnalyticsSummary } from "@/lib/analytics"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from "recharts"
import { format, subDays } from "date-fns"

export default function AnalyticsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const { t } = useLanguage()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<AnalyticsSummary | null>(null)
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: subDays(new Date(), 7),
        to: new Date()
    })

    useEffect(() => {
        if (user) {
            fetchAnalytics()
        }
    }, [user, dateRange])

    const fetchAnalytics = async () => {
        setIsLoading(true)
        try {
            const queryParams = new URLSearchParams({
                chatbotId: user!.uid,
                startDate: dateRange.from.toISOString(),
                endDate: dateRange.to.toISOString()
            })

            const res = await fetch(`/api/analytics?${queryParams}`)
            if (!res.ok) throw new Error("Failed to fetch analytics")

            const jsonData = await res.json()
            setData(jsonData)
        } catch (error) {
            console.error("Error fetching analytics:", error)
            toast({
                title: t('error'),
                description: "Failed to load analytics data.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const COLORS = ['#4ade80', '#94a3b8', '#f87171']; // Green, Gray, Red

    if (isLoading && !data) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('analytics')}</h1>
                    <p className="text-muted-foreground">{t('analyticsSubtitle')}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchAnalytics}>
                        {t('refresh')}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('totalConversations')}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalConversations || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('totalMessages')}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalMessages || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('avgMessagesPerChat')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.averageMessagesPerConversation || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Activity Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('activityOverview')}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.dailyStats || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => format(new Date(str), "MMM d")}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                                        labelFormatter={(str) => format(new Date(str), "MMM d, yyyy")}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="conversations" stroke="#2563eb" strokeWidth={2} name={t('totalConversations')} />
                                    <Line type="monotone" dataKey="messages" stroke="#16a34a" strokeWidth={2} name={t('totalMessages')} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Sentiment Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('sentimentAnalysis')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: t('positive'), value: data?.sentiment.positive || 0 },
                                            { name: t('neutral'), value: data?.sentiment.neutral || 0 },
                                            { name: t('negative'), value: data?.sentiment.negative || 0 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell key="cell-0" fill="#4ade80" /> {/* Positive - Green */}
                                        <Cell key="cell-1" fill="#94a3b8" /> {/* Neutral - Gray */}
                                        <Cell key="cell-2" fill="#f87171" /> {/* Negative - Red */}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

