"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    UserCircle,
    Database,
    Palette,
    Plug,
    BarChart3,
    LogOut,
    ChevronLeft,
    ShoppingBag
} from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"

export function ConsoleSidebar() {
    const pathname = usePathname() || ""
    const router = useRouter()
    const { t } = useLanguage()
    const { role, enablePersonalShopper } = useAuth()

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/login")
    }



    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64 flex-shrink-0">
            <div className="flex h-full flex-col gap-2 pt-4">
                {/* Header removed as it is now global */}
                <div className="flex-1">
                    <ScrollArea className="h-[calc(100vh-65px)]">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-4">
                            {pathname.startsWith("/console/copywriter") ? (
                                <>
                                    {/* Copywriter Menu */}
                                    <div>
                                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Overview
                                        </div>
                                        <Link
                                            href="/console/copywriter"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/copywriter" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Generator
                                        </Link>
                                    </div>
                                </>
                            ) : pathname.startsWith("/console/lead-finder") ? (
                                <>
                                    {/* Lead Finder Menu */}
                                    <div>
                                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Overview
                                        </div>
                                        <Link
                                            href="/console/lead-finder"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/lead-finder" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Lead Search
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Chatbot Menu (Existing) */}
                                    <div>
                                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Overview
                                        </div>
                                        <Link
                                            href="/console/chatbot"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot" && !pathname.startsWith("/console/chatbot/shopper") ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            {t('dashboard')}
                                        </Link>
                                        <Link
                                            href="/console/chatbot/analytics"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/analytics" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Analytics
                                        </Link>
                                    </div>

                                    {/* Personal Shopper Group */}
                                    {(role === 'SUPER_ADMIN' || enablePersonalShopper) && (
                                        <div>
                                            <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                Personal Shopper
                                            </div>
                                            <Link
                                                href="/console/chatbot/shopper"
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    pathname === "/console/chatbot/shopper" ? "bg-muted text-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                                Overview
                                            </Link>
                                            <Link
                                                href="/console/chatbot/shopper/catalog"
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    pathname === "/console/chatbot/shopper/catalog" ? "bg-muted text-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                <Database className="h-4 w-4" />
                                                Product Catalog
                                            </Link>
                                            <Link
                                                href="/console/chatbot/shopper/settings"
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    pathname === "/console/chatbot/shopper/settings" ? "bg-muted text-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                <Settings className="h-4 w-4" />
                                                Shopper Settings
                                            </Link>
                                        </div>
                                    )}

                                    {/* Communication Group */}
                                    <div>
                                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Communication
                                        </div>
                                        <Link
                                            href="/console/chatbot/chats"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/chats" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            {t('chats')}
                                        </Link>
                                        <Link
                                            href="/console/chatbot/leads"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/leads" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <Users className="h-4 w-4" />
                                            Leads
                                        </Link>
                                    </div>

                                    {/* Configuration Group */}
                                    <div>
                                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Configuration
                                        </div>
                                        <Link
                                            href="/console/knowledge"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/knowledge" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <Database className="h-4 w-4" />
                                            {t('knowledgeBase')}
                                        </Link>
                                        <Link
                                            href="/console/chatbot/branding"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/branding" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <Palette className="h-4 w-4" />
                                            {t('branding')}
                                        </Link>
                                        <Link
                                            href="/console/chatbot/widget"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/widget" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Widget Settings
                                        </Link>
                                        <Link
                                            href="/console/chatbot/integration"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/integration" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <Plug className="h-4 w-4" />
                                            {t('integration')}
                                        </Link>
                                    </div>

                                    {/* Settings Group */}
                                    <div>
                                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Settings
                                        </div>
                                        <Link
                                            href="/console/chatbot/profile"
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === "/console/chatbot/profile" ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <UserCircle className="h-4 w-4" />
                                            {t('profile')}
                                        </Link>
                                    </div>
                                </>
                            )}
                        </nav>
                    </ScrollArea>
                </div>
                <div className="mt-auto p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        {t('logout')}
                    </Button>
                </div>
            </div>
        </div >
    )
}
