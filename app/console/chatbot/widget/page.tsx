"use client"

import WidgetSettings from "@/components/widget-settings"

import { useAuth } from "@/context/AuthContext"

export default function WidgetPage() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="p-8">
            <WidgetSettings userId={user.uid} />
        </div>
    )
}
