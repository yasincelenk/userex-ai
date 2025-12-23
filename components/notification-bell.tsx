"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, MessageCircle, Calendar, UserPlus, Users, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import { collection, query, where, orderBy, onSnapshot, limit, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type NotificationType = 'chat' | 'appointment' | 'lead' | 'system'

interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string
    timestamp: Date
    isNew: boolean
    data?: any
}

export function NotificationBell() {
    const { user, role } = useAuth()
    const { t } = useLanguage()
    const router = useRouter()

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<string>('all')
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const lastSeenRef = useRef<{ [key: string]: Date }>({})
    const previousIdsRef = useRef<Set<string>>(new Set())

    const isSuperAdmin = role === 'SUPER_ADMIN'

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('/notification.mp3')
        audioRef.current.volume = 0.5

        const savedPref = localStorage.getItem('notificationSoundEnabled')
        if (savedPref !== null) {
            setSoundEnabled(savedPref === 'true')
        }
    }, [])

    // Play notification sound
    const playNotificationSound = useCallback(() => {
        if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(err => {
                console.log('Could not play notification sound:', err)
            })
        }
    }, [soundEnabled])

    // Show browser notification
    const showBrowserNotification = useCallback((title: string, body: string, tag: string = 'notification') => {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body,
                icon: '/exai-logo-dark.png',
                badge: '/exai-logo-dark.png',
                tag,
                renotify: true
            })

            notification.onclick = () => {
                window.focus()
                notification.close()
            }
        }
    }, [])

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }, [])

    // Listen for CHAT notifications
    useEffect(() => {
        if (!user?.uid) return

        const sessionsRef = collection(db, "chatbots", user.uid, "sessions")
        const q = query(sessionsRef, orderBy("updatedAt", "desc"), limit(20))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatNotifications: Notification[] = []
            let hasNew = false

            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data()
                const messages = data.messages || []
                const lastMessage = messages[messages.length - 1]

                if (!lastMessage || lastMessage.role !== 'user') return
                if (data.unreadByAdmin === false) return

                const timestamp = data.updatedAt?.toDate() || new Date()
                const notifId = `chat_${docSnap.id}`
                const isNew = !previousIdsRef.current.has(notifId)

                chatNotifications.push({
                    id: notifId,
                    type: 'chat',
                    title: data.userName || data.userEmail || 'Anonim Kullanıcı',
                    message: lastMessage.content?.substring(0, 80) + (lastMessage.content?.length > 80 ? '...' : '') || '',
                    timestamp,
                    isNew,
                    data: { sessionId: docSnap.id }
                })

                if (isNew && previousIdsRef.current.size > 0) hasNew = true
                previousIdsRef.current.add(notifId)
            })

            setNotifications(prev => {
                const others = prev.filter(n => n.type !== 'chat')
                return [...chatNotifications, ...others].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            })

            if (hasNew && chatNotifications.length > 0) {
                playNotificationSound()
                showBrowserNotification(t('newMessage') || 'Yeni Mesaj', `${chatNotifications[0].title}: ${chatNotifications[0].message}`, 'chat')
            }
        })

        return () => unsubscribe()
    }, [user?.uid, playNotificationSound, showBrowserNotification])

    // Listen for APPOINTMENT notifications
    useEffect(() => {
        if (!user?.uid) return

        const appointmentsRef = collection(db, "appointments")
        const q = query(
            appointmentsRef,
            where("chatbotId", "==", user.uid),
            where("status", "==", "pending"),
            orderBy("createdAt", "desc"),
            limit(10)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appointmentNotifications: Notification[] = []
            let hasNew = false

            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data()
                const timestamp = data.createdAt?.toDate() || new Date()
                const notifId = `appointment_${docSnap.id}`
                const isNew = !previousIdsRef.current.has(notifId)

                appointmentNotifications.push({
                    id: notifId,
                    type: 'appointment',
                    title: '📅 Yeni Randevu Talebi',
                    message: `${data.customerName || 'Müşteri'} - ${data.date} ${data.time}`,
                    timestamp,
                    isNew,
                    data: { appointmentId: docSnap.id }
                })

                if (isNew && previousIdsRef.current.size > 0) hasNew = true
                previousIdsRef.current.add(notifId)
            })

            setNotifications(prev => {
                const others = prev.filter(n => n.type !== 'appointment')
                return [...others, ...appointmentNotifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            })

            if (hasNew && appointmentNotifications.length > 0) {
                playNotificationSound()
                showBrowserNotification(t('newAppointment') || 'Yeni Randevu', appointmentNotifications[0].message, 'appointment')
            }
        })

        return () => unsubscribe()
    }, [user?.uid, playNotificationSound, showBrowserNotification])

    // Listen for LEAD notifications  
    useEffect(() => {
        if (!user?.uid) return

        const leadsRef = collection(db, "leads")
        const q = query(
            leadsRef,
            where("chatbotId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(10)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadNotifications: Notification[] = []
            let hasNew = false

            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data()
                const timestamp = data.createdAt?.toDate() || new Date()
                const notifId = `lead_${docSnap.id}`
                const isNew = !previousIdsRef.current.has(notifId)

                // Only show leads from last 24 hours
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
                if (timestamp < oneDayAgo) return

                leadNotifications.push({
                    id: notifId,
                    type: 'lead',
                    title: '🎯 Yeni Lead',
                    message: `${data.name || 'Anonim'} - ${data.email || data.phone || ''}`,
                    timestamp,
                    isNew,
                    data: { leadId: docSnap.id }
                })

                if (isNew && previousIdsRef.current.size > 0) hasNew = true
                previousIdsRef.current.add(notifId)
            })

            setNotifications(prev => {
                const others = prev.filter(n => n.type !== 'lead')
                return [...others, ...leadNotifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            })

            if (hasNew && leadNotifications.length > 0) {
                playNotificationSound()
                showBrowserNotification(t('newLead') || 'Yeni Lead', leadNotifications[0].message, 'lead')
            }
        })

        return () => unsubscribe()
    }, [user?.uid, playNotificationSound, showBrowserNotification])

    // Listen for SUPER ADMIN notifications (new tenants)
    useEffect(() => {
        if (!isSuperAdmin) return

        const usersRef = collection(db, "users")
        const q = query(usersRef, where("isActive", "==", false), orderBy("createdAt", "desc"), limit(10))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const systemNotifications: Notification[] = []
            let hasNew = false

            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data()
                const timestamp = data.createdAt ? new Date(data.createdAt) : new Date()
                const notifId = `system_tenant_${docSnap.id}`
                const isNew = !previousIdsRef.current.has(notifId)

                systemNotifications.push({
                    id: notifId,
                    type: 'system',
                    title: '👤 Yeni Tenant Kaydı',
                    message: `${data.fullName || data.email} - Onay bekliyor`,
                    timestamp,
                    isNew,
                    data: { userId: docSnap.id }
                })

                if (isNew && previousIdsRef.current.size > 0) hasNew = true
                previousIdsRef.current.add(notifId)
            })

            setNotifications(prev => {
                const others = prev.filter(n => n.type !== 'system')
                return [...others, ...systemNotifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            })

            if (hasNew && systemNotifications.length > 0) {
                playNotificationSound()
                showBrowserNotification(t('newTenant') || 'Yeni Tenant', systemNotifications[0].message, 'system')
            }
        })

        return () => unsubscribe()
    }, [isSuperAdmin, playNotificationSound, showBrowserNotification])

    // Update unread count
    useEffect(() => {
        setUnreadCount(notifications.filter(n => n.isNew).length)
    }, [notifications])

    // Handle notification click
    const handleNotificationClick = async (notification: Notification) => {
        setIsOpen(false)

        // Mark as read (remove isNew flag)
        setNotifications(prev => prev.map(n =>
            n.id === notification.id ? { ...n, isNew: false } : n
        ))

        // Navigate based on type
        switch (notification.type) {
            case 'chat':
                if (notification.data?.sessionId) {
                    try {
                        await updateDoc(doc(db, "chatbots", user!.uid, "sessions", notification.data.sessionId), {
                            unreadByAdmin: false
                        })
                    } catch (e) { console.error(e) }
                }
                router.push('/console/chatbot/chats')
                break
            case 'appointment':
                router.push('/console/chatbot/appointments')
                break
            case 'lead':
                router.push('/console/chatbot/leads')
                break
            case 'system':
                router.push('/admin')
                break
        }
    }

    // Toggle sound
    const toggleSound = () => {
        const newValue = !soundEnabled
        setSoundEnabled(newValue)
        localStorage.setItem('notificationSoundEnabled', String(newValue))
    }

    // Format time ago
    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return t('justNow') || 'Şimdi'
        if (diffMins < 60) return `${diffMins}${t('minutesAgo') || 'dk önce'}`
        if (diffHours < 24) return `${diffHours}${t('hoursAgo') || 'sa önce'}`
        return `${diffDays}${t('daysAgo') || 'g önce'}`
    }

    // Get icon by type
    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'chat': return <MessageCircle className="h-5 w-5 text-indigo-600" />
            case 'appointment': return <Calendar className="h-5 w-5 text-green-600" />
            case 'lead': return <Users className="h-5 w-5 text-orange-600" />
            case 'system': return <UserPlus className="h-5 w-5 text-red-600" />
        }
    }

    // Get bg color by type
    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case 'chat': return 'bg-indigo-100'
            case 'appointment': return 'bg-green-100'
            case 'lead': return 'bg-orange-100'
            case 'system': return 'bg-red-100'
        }
    }

    // Filter notifications
    const filteredNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeTab)

    if (!user) return null

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
                <div className="flex items-center justify-between p-3 border-b">
                    <h4 className="font-semibold text-sm">
                        {t('notifications') || 'Bildirimler'}
                    </h4>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleSound}
                        title={soundEnabled ? (t('mute') || 'Sesi kapat') : (t('unmute') || 'Sesi aç')}
                    >
                        {soundEnabled ? (
                            <Volume2 className="h-4 w-4 text-green-600" />
                        ) : (
                            <VolumeX className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-4 h-9 p-1">
                        <TabsTrigger value="all" className="text-xs">{t('all') || 'Tümü'}</TabsTrigger>
                        <TabsTrigger value="chat" className="text-xs">
                            <MessageCircle className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger value="appointment" className="text-xs">
                            <Calendar className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger value="lead" className="text-xs">
                            <Users className="h-4 w-4" />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <ScrollArea className="h-[320px]">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{t('noNewNotifications') || 'Yeni bildirim yok'}</p>
                        </div>
                    ) : (
                        <div className="py-1">
                            {filteredNotifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "w-full p-3 text-left hover:bg-muted/50 transition-colors flex gap-3 border-b last:border-0",
                                        notification.isNew && "bg-blue-50/50 dark:bg-blue-950/20"
                                    )}
                                >
                                    <div className="flex-shrink-0">
                                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", getBgColor(notification.type))}>
                                            {getIcon(notification.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium text-sm truncate">
                                                {notification.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                {formatTimeAgo(notification.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {notification.isNew && (
                                        <div className="flex-shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
