"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, role, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

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

    // Check if we are in the tenant detail view (e.g., /admin/tenant/[userId])
    // The path should contain /admin/tenant/ and have a segment after it
    const isTenantDetail = pathname && pathname.startsWith("/admin/tenant/") && pathname.split("/").length > 3

    if (isTenantDetail) {
        return (
            <SidebarProvider>
                <div className="flex flex-col h-screen w-full">
                    <SiteHeader showSidebarTrigger={true} />
                    <div className="flex flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        )
    }

    return (
        <div className="flex flex-col h-screen w-full bg-muted/5">
            <SiteHeader showSidebarTrigger={false} />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
