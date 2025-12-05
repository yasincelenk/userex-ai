"use client"

import { SiteHeader } from "@/components/site-header"
import { PlatformSidebar } from "@/components/platform-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { LanguageProvider } from "@/context/LanguageContext"

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LanguageProvider>
            <SidebarProvider>
                <div className="flex flex-col h-screen w-full">
                    <SiteHeader />
                    <div className="flex flex-1 overflow-hidden">
                        <PlatformSidebar />
                        <SidebarInset className="min-h-0">
                            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </div>
            </SidebarProvider>
        </LanguageProvider>
    )
}
