"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User, Loader2 } from "lucide-react"

interface ActivityItem {
    id: string
    type: 'user' | 'chatbot'
    title: string
    subtitle: string
    timestamp: Date
}

export function AdminActivityFeed() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Fetch recent users
                const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
                const usersSnapshot = await getDocs(usersQuery)
                const userActivities: ActivityItem[] = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    type: 'user',
                    title: "New User Registered",
                    subtitle: doc.data().email,
                    timestamp: new Date(doc.data().createdAt)
                }))

                // Fetch recent chatbots
                const chatbotsQuery = query(collection(db, "chatbots"), orderBy("createdAt", "desc"), limit(5))
                const chatbotsSnapshot = await getDocs(chatbotsQuery)
                const chatbotActivities: ActivityItem[] = chatbotsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    type: 'chatbot',
                    title: "New Chatbot Created",
                    subtitle: doc.data().name,
                    timestamp: new Date(doc.data().createdAt)
                }))

                // Merge and sort
                const allActivities = [...userActivities, ...chatbotActivities]
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 5) // Keep only top 5

                setActivities(allActivities)
            } catch (error) {
                console.error("Error fetching activity feed:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivity()
    }, [])

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((item) => (
                        <div key={item.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className={item.type === 'user' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}>
                                    {item.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.subtitle}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-xs text-muted-foreground">
                                {item.timestamp.toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
