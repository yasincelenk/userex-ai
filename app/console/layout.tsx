"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { ConsoleSidebar } from "@/components/console-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { LanguageProvider } from "@/context/LanguageContext"

export default function ConsoleLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In the future, we can switch sidebars based on the path (e.g., /console/shopper vs /console/chatbot)
    // For now, we reuse the existing AppSidebar but we might want to customize it for the "Console" context.

    return (
        <AuthGuard>
            <LanguageProvider>
                <SidebarProvider>
                    <div className="flex flex-col h-screen w-full bg-[#f4f6f8]">
                        <SiteHeader />
                        <div className="flex flex-1 overflow-hidden">
                            <ConsoleSidebar />
                            <main className="flex-1 overflow-y-auto bg-[#f4f6f8] relative">
                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarProvider>
            </LanguageProvider>
        </AuthGuard>
    )
}
