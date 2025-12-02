"use client"

import { useEffect, useState, useRef } from "react"
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useLanguage } from "@/context/LanguageContext"
import { format } from "date-fns"
import { Loader2, Send, MessageSquare, Monitor, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ChatSession {
    id: string
    chatbotId: string
    createdAt: any
    messages: any[]
    lastMessage?: string
    lastMessageTime?: any
    isPaused?: boolean
}

interface UnifiedInboxProps {
    userId: string
}

export function UnifiedInbox({ userId }: UnifiedInboxProps) {
    const { t } = useLanguage()
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [replyText, setReplyText] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isTogglingPause, setIsTogglingPause] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    // 1. Listen to Sessions List
    useEffect(() => {
        if (!userId) return

        // Note: Ordering by 'createdAt' or 'lastMessageTime' requires an index in Firestore
        // For now, we'll fetch recent 50 and sort client-side if needed, or rely on index creation
        const q = query(
            collection(db, "chat_sessions"),
            where("chatbotId", "==", userId),
            // orderBy("createdAt", "desc"), // Uncomment if index exists
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedSessions: ChatSession[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                fetchedSessions.push({
                    id: doc.id,
                    ...data,
                    // Helper to get last message content/time for preview
                    lastMessage: data.messages?.length > 0 ? data.messages[data.messages.length - 1].content : "",
                    lastMessageTime: data.messages?.length > 0 ? data.messages[data.messages.length - 1].createdAt : data.createdAt
                } as ChatSession)
            })

            // Sort by last message time descending
            fetchedSessions.sort((a, b) => {
                const dateA = new Date(a.lastMessageTime || 0).getTime()
                const dateB = new Date(b.lastMessageTime || 0).getTime()
                return dateB - dateA
            })

            setSessions(fetchedSessions)
            setIsLoading(false)
        }, (error) => {
            console.error("Error fetching sessions:", error)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [userId])

    // 2. Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [selectedSessionId, sessions])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim() || !selectedSessionId) return

        setIsSending(true)
        try {
            const response = await fetch("/api/admin/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: selectedSessionId,
                    chatbotId: userId,
                    content: replyText
                })
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            setReplyText("")
        } catch (error) {
            console.error("Error sending message:", error)
            alert("Failed to send message")
        } finally {
            setIsSending(false)
        }
    }

    const handleTogglePause = async () => {
        if (!selectedSessionId || !selectedSession) return

        setIsTogglingPause(true)
        const newStatus = !selectedSession.isPaused

        try {
            const response = await fetch("/api/admin/toggle-pause", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: selectedSessionId,
                    isPaused: newStatus
                })
            })

            if (!response.ok) {
                throw new Error("Failed to toggle pause")
            }

            // No need to update local state manually as onSnapshot will handle it
        } catch (error) {
            console.error("Error toggling pause:", error)
            alert("Failed to update AI status")
        } finally {
            setIsTogglingPause(false)
        }
    }

    const selectedSession = sessions.find(s => s.id === selectedSessionId)

    const filteredSessions = sessions.filter(s =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.lastMessage && s.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const getChannelIcon = (sessionId: string) => {
        if (sessionId.startsWith("telegram-")) {
            return <Send className="h-4 w-4 text-sky-500" />
        }
        return <Monitor className="h-4 w-4 text-gray-500" />
    }

    const getChannelName = (sessionId: string) => {
        if (sessionId.startsWith("telegram-")) return "Telegram"
        return "Web Widget"
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Sidebar - Session List */}
            <div className="w-80 border-r flex flex-col bg-gray-50/50">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search chats..."
                            className="pl-8 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {filteredSessions.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No conversations found.
                            </div>
                        ) : (
                            filteredSessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSessionId(session.id)}
                                    className={`flex items-start gap-3 p-4 text-left hover:bg-gray-100 transition-colors border-b last:border-0 ${selectedSessionId === session.id ? "bg-blue-50 hover:bg-blue-50 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                                        }`}
                                >
                                    <Avatar className="h-10 w-10 border bg-white">
                                        <AvatarFallback className="bg-gray-100 text-gray-500">
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm truncate">
                                                {session.id.startsWith("telegram-") ? "Telegram User" : "Web Visitor"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                {session.lastMessageTime ? format(new Date(session.lastMessageTime), "HH:mm") : ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            {getChannelIcon(session.id)}
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                {getChannelName(session.id)}
                                            </span>
                                            {session.isPaused && (
                                                <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                                                    PAUSED
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {session.lastMessage || "No messages"}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {selectedSession.id.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        {selectedSession.id}
                                        {selectedSession.isPaused ? (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                AI Paused
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                AI Active
                                            </Badge>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        {getChannelIcon(selectedSession.id)}
                                        <span>{getChannelName(selectedSession.id)}</span>
                                        <span>•</span>
                                        <span>{format(new Date(selectedSession.createdAt), "PP p")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={selectedSession.isPaused ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleTogglePause}
                                    disabled={isTogglingPause}
                                    className={selectedSession.isPaused ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {isTogglingPause ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : selectedSession.isPaused ? (
                                        "Resume AI"
                                    ) : (
                                        "Pause AI"
                                    )}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setSelectedSessionId(null)} className="md:hidden">
                                    Back
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30" ref={scrollRef}>
                            {selectedSession.messages?.map((msg: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 max-w-[80%] ${msg.role === "assistant" || msg.role === "agent"
                                        ? "ml-auto flex-row-reverse"
                                        : ""
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 border ${msg.role === "assistant" || msg.role === "agent"
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-600"
                                            }`}
                                    >
                                        {msg.role === "assistant" || msg.role === "agent" ? "AI" : "U"}
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === "assistant" || msg.role === "agent"
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-white border text-gray-800 rounded-tl-none"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div className={`text-[10px] text-muted-foreground ${msg.role === "assistant" || msg.role === "agent" ? "text-right" : "text-left"
                                            }`}>
                                            {format(new Date(msg.createdAt), "HH:mm")}
                                            {msg.isHuman && <span className="ml-1 font-medium text-blue-600">(Admin)</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type a reply..."
                                    className="flex-1"
                                    disabled={isSending}
                                />
                                <Button type="submit" disabled={isSending || !replyText.trim()}>
                                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                            <div className="mt-2 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                                <span>Reply will be sent to the user immediately via {getChannelName(selectedSession.id)}.</span>
                                {selectedSession.isPaused && (
                                    <span className="text-amber-600 font-medium">(AI is paused)</span>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Select a conversation</h3>
                        <p className="text-sm max-w-xs text-center">
                            Choose a chat from the sidebar to view history and reply to users in real-time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
