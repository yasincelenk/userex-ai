"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConsoleSidebar } from "@/components/console-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { LanguageProvider } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export default function TenantConsoleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { userId: string }
}) {
    const { role } = useAuth()
    const router = useRouter()
    const [targetEmail, setTargetEmail] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load tenant email for display
        const loadTenantEmail = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", params.userId))
                if (userDoc.exists()) {
                    setTargetEmail(userDoc.data().email || params.userId)
                }
            } catch (error) {
                console.error("Error loading tenant:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadTenantEmail()
    }, [params.userId])

    // Redirect non-super-admins
    useEffect(() => {
        if (role && role !== "SUPER_ADMIN") {
            router.push("/console/chatbot")
        }
    }, [role, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AuthGuard>
            <LanguageProvider>
                <SidebarProvider>
                    <div className="flex flex-col h-screen w-full bg-background">
                        <SiteHeader />
                        <div className="flex flex-1 overflow-hidden">
                            <ConsoleSidebar
                                targetUserId={params.userId}
                                targetEmail={targetEmail}
                            />
                            <main className="flex-1 overflow-y-auto bg-muted/10">
                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarProvider>
            </LanguageProvider>
        </AuthGuard>
    )
}
