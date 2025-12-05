"use client"

import { BrandingSettings } from "@/components/branding-settings"

import { useAuth } from "@/context/AuthContext"

export default function BrandingPage() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="p-8">
            <BrandingSettings targetUserId={user.uid} />
        </div>
    )
}
