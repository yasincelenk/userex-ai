"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    UserCircle,
    Database,
    Plug,
    BarChart3,
    LogOut,
    Package,
    ArrowLeft,
    Zap,
    GraduationCap,
    Grid,
    Shield,
    CreditCard,
    Code,
    Bell
} from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { PricingModal } from "./billing/pricing-modal"
import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

interface ConsoleSidebarProps {
    targetUserId?: string
    targetEmail?: string
}

export function ConsoleSidebar({ targetUserId, targetEmail }: ConsoleSidebarProps) {
    const pathname = usePathname() || ""
    const searchParams = useSearchParams()
    const router = useRouter()
    const { t } = useLanguage()
    const { user, role } = useAuth()
    const [showPricing, setShowPricing] = useState(false)

    // Build link based on whether we're in super admin mode (targetUserId provided)
    const buildLink = (path: string) => {
        if (targetUserId) {
            return path.replace('/console/', `/admin/tenant/${targetUserId}/`)
        }
        return path
    }

    // Check if current path matches
    const isActive = (path: string) => {
        if (targetUserId) {
            const adminPath = path.replace('/console/', `/admin/tenant/${targetUserId}/`)
            return pathname === adminPath || pathname.startsWith(adminPath + '/')
        }
        return pathname === path || pathname.startsWith(path + '/')
    }

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/login")
    }

    // Navigation Items
    const navItems = [
        {
            title: t('dashboard'),
            icon: Zap,
            href: "/console/chatbot",
            active: isActive("/console/chatbot") && !isActive("/console/chatbot/shopper")
        },
        {
            title: t('visitors'),
            icon: Users,
            href: "/console/chatbot/leads",
            active: isActive("/console/chatbot/leads") || isActive("/console/chatbot/appointments")
        },
        {
            title: t('chats'),
            icon: MessageSquare,
            href: "/console/chatbot/chats",
            active: isActive("/console/chatbot/chats")
        },
        {
            title: t('training'),
            icon: GraduationCap,
            href: "/console/knowledge",
            active: isActive("/console/knowledge")
        },
        {
            title: t('modules') || "Modules",
            icon: Grid, // Plugin/Grid icon
            href: "/console/modules",
            active: isActive("/console/modules") || isActive("/console/chatbot/shopper")
        },
        {
            title: t('reports'), // Analytics -> Reports
            icon: BarChart3,
            href: "/console/chatbot/analytics",
            active: isActive("/console/chatbot/analytics")
        },
        {
            title: t('integrations'),
            icon: Plug,
            href: "/console/chatbot/integration",
            active: isActive("/console/chatbot/integration")
        }
    ]

    return (
        <>
            <Sidebar collapsible="icon" className="!top-0 !h-screen border-r-0 bg-[#1e1e2d] text-white z-40" variant="sidebar">
                <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/10 bg-[#1e1e2d]">
                    <div className="flex items-center gap-2 px-2 w-full">
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white font-bold">
                            V
                        </div>
                        <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">Vion</span>
                    </div>
                </SidebarHeader>

                <SidebarContent className="bg-[#1e1e2d] px-2 py-4">
                    {/* Super Admin Back Button */}
                    {targetUserId && (
                        <SidebarMenu className="mb-4">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    size="lg"
                                    onClick={() => router.push("/platform/tenants")}
                                    className="bg-white/5 hover:bg-white/10 text-white"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
                                        <ArrowLeft className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold">{t('backToTenants')}</span>
                                        <span className="truncate text-xs text-white/50">{targetEmail || targetUserId}</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )}

                    <SidebarMenu className="gap-2">
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.active}
                                    className={cn(
                                        "w-full justify-start gap-3 px-3 py-6 h-auto transition-all duration-200",
                                        "hover:bg-white/10 hover:text-white",
                                        item.active
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                            : "text-zinc-400 group-hover:text-white"
                                    )}
                                >
                                    <Link href={buildLink(item.href)}>
                                        <item.icon className={cn("size-5", item.active ? "text-white" : "text-zinc-400 group-hover:text-white")} />
                                        <span className="font-medium text-[15px] group-data-[collapsible=icon]:hidden">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="bg-[#1e1e2d] border-t border-white/10 p-2">
                    <SidebarMenu className="gap-1">
                        {/* Settings Group */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive("/console/chatbot/widget")}
                                className={cn(
                                    "w-full justify-start gap-3 px-3 py-2 h-auto hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
                                    isActive("/console/chatbot/widget") && "text-white bg-white/10"
                                )}
                            >
                                <Link href={buildLink("/console/chatbot/widget")}>
                                    <Settings className="size-4" />
                                    <span className="font-medium text-sm group-data-[collapsible=icon]:hidden">{t('settings')} (Widget)</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive("/console/settings/subscription")}
                                className={cn(
                                    "w-full justify-start gap-3 px-3 py-2 h-auto hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
                                    isActive("/console/settings/subscription") && "text-white bg-white/10"
                                )}
                            >
                                <Link href="/console/settings/subscription">
                                    <CreditCard className="size-4" />
                                    <span className="font-medium text-sm group-data-[collapsible=icon]:hidden">{t('subscription')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive("/console/settings/developers")}
                                className={cn(
                                    "w-full justify-start gap-3 px-3 py-2 h-auto hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
                                    isActive("/console/settings/developers") && "text-white bg-white/10"
                                )}
                            >
                                <Link href="/console/settings/developers">
                                    <Code className="size-4" />
                                    <span className="font-medium text-sm group-data-[collapsible=icon]:hidden">{t('developers')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive("/console/settings/notifications")}
                                className={cn(
                                    "w-full justify-start gap-3 px-3 py-2 h-auto hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
                                    isActive("/console/settings/notifications") && "text-white bg-white/10"
                                )}
                            >
                                <Link href="/console/settings/notifications">
                                    <Bell className="size-4" />
                                    <span className="font-medium text-sm group-data-[collapsible=icon]:hidden">{t('notificationSettings') || "Notifications"}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <div className="h-px bg-white/10 my-2" />

                        {/* Profile / User */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-white/10 hover:bg-white/5 text-white"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-500 text-white font-bold">
                                    {user?.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold">{user?.displayName || 'User'}</span>
                                    <span className="truncate text-xs text-zinc-400">{user?.email}</span>
                                </div>
                                <LogOut className="ml-auto size-4 text-zinc-400 hover:text-white group-data-[collapsible=icon]:hidden" onClick={handleLogout} />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                currentPlan="free"
            />
        </>
    )
}
