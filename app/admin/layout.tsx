"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, role, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/")
            } else if (role !== "SUPER_ADMIN") {
                router.push("/dashboard")
            }
        }
    }, [user, role, loading, router])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user || role !== "SUPER_ADMIN") {
        return null
    }

    return (
        <SidebarProvider>
            <div className="flex flex-col h-screen w-full">
                <SiteHeader />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar className="!top-16 !h-[calc(100svh-4rem)]" />
                    <main className="flex-1 overflow-auto p-4">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
