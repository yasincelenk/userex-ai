"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Loader2, MessageSquare, Users, Activity } from "lucide-react"
import { format, subDays, isSameDay, startOfDay } from "date-fns"
import { useLanguage } from "@/context/LanguageContext"

interface ChatSession {
    id: string
    createdAt: any
    messages: any[]
}

export function DashboardStats() {
    const { user } = useAuth()
    const { t } = useLanguage()
    const [stats, setStats] = useState({
        totalChats: 0,
        totalMessages: 0,
        avgMessagesPerChat: 0,
    })
    const [chartData, setChartData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.uid) return

            try {
                const q = query(
                    collection(db, "chat_sessions"),
                    where("chatbotId", "==", user.uid),
                    orderBy("createdAt", "desc")
                )
                const querySnapshot = await getDocs(q)
                const sessions: ChatSession[] = []
                querySnapshot.forEach((doc) => {
                    sessions.push({ id: doc.id, ...doc.data() } as ChatSession)
                })

                // Calculate Stats
                const totalChats = sessions.length
                const totalMessages = sessions.reduce((acc, session) => acc + (session.messages?.length || 0), 0)
                const avgMessagesPerChat = totalChats > 0 ? Math.round(totalMessages / totalChats) : 0

                setStats({
                    totalChats,
                    totalMessages,
                    avgMessagesPerChat,
                })

                // Prepare Chart Data (Last 7 Days)
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = subDays(new Date(), 6 - i)
                    return startOfDay(d)
                })

                const data = last7Days.map((date) => {
                    const daySessions = sessions.filter((session) => {
                        if (!session.createdAt?.seconds) return false
                        const sessionDate = new Date(session.createdAt.seconds * 1000)
                        return isSameDay(sessionDate, date)
                    })

                    return {
                        name: format(date, "EEE"), // Mon, Tue, etc.
                        chats: daySessions.length,
                        fullDate: format(date, "MMM d"),
                    }
                })

                setChartData(data)

            } catch (error) {
                console.error("Error fetching dashboard stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [user?.uid])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('totalChats')}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalChats}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('lifetimeConversations')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('totalMessages')}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMessages}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('messagesProcessed')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('avgMessagesPerChat')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgMessagesPerChat}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('engagementDepth')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>{t('weeklyActivity')}</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                {payload[0].payload.fullDate}
                                                            </span>
                                                            <span className="font-bold text-muted-foreground">
                                                                {payload[0].value} chats
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Bar
                                    dataKey="chats"
                                    fill="currentColor"
                                    radius={[4, 4, 0, 0]}
                                    className="fill-primary"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
