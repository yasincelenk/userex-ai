"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TenantsRedirect() {
    const router = useRouter()

    useEffect(() => {
        router.push("/platform/tenants")
    }, [router])

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-muted-foreground">Redirecting to platform...</p>
        </div>
    )
}
