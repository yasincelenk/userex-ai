"use client"

import { useAuth } from "@/context/AuthContext"
import { TenantManagement } from "@/components/tenant-management"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function TenantsPage() {
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
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user || role !== "SUPER_ADMIN") {
        return null
    }

    return (
        <div className="p-8">
            <TenantManagement />
        </div>
    )
}
