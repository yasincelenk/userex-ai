"use client"

import { TenantManagement } from "@/components/tenant-management"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function TenantsPage() {
    const { role, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && role !== 'SUPER_ADMIN') {
            router.push('/platform')
        }
    }, [role, loading, router])

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (role !== 'SUPER_ADMIN') {
        return null
    }

    return (
        <div className="p-8">
            <TenantManagement />
        </div>
    )
}
