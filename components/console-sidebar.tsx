"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
    ShoppingBag,
    Eye,
    ScanLine,
    CheckSquare,
    FileText,
    GitMerge,
    TrendingUp,
    Bot,
    Sparkles,
    Activity,
    Package,
    Inbox,
    Calendar,
    ArrowLeft,
    Shield
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
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"

interface ConsoleSidebarProps {
    targetUserId?: string
    targetEmail?: string
}

export function ConsoleSidebar({ targetUserId, targetEmail }: ConsoleSidebarProps) {
    const pathname = usePathname() || ""
    const searchParams = useSearchParams()
    const router = useRouter()
    const { t } = useLanguage()
    const { user, role, enablePersonalShopper, canManageModules } = useAuth()
    const [showPricing, setShowPricing] = useState(false)

    // Build link based on whether we're in super admin mode (targetUserId provided)
    const buildLink = (path: string) => {
        if (targetUserId) {
            // Replace /console/ with /admin/tenant/[userId]/
            return path.replace('/console/', `/admin/tenant/${targetUserId}/`)
        }
        return path
    }

    // Check if current path matches (accounting for super admin mode)
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

    return (
        <>
            <Sidebar collapsible="icon" className="!top-16 !h-[calc(100svh-4rem)] border-r">
                <SidebarContent>
                    {pathname.startsWith("/console/copywriter") ? (
                        /* Copywriter Menu */
                        <SidebarGroup>
                            <SidebarGroupLabel>{t('overview')}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/console/copywriter"}>
                                            <Link href="/console/copywriter">
                                                <LayoutDashboard />
                                                <span>{t('generator')}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ) : pathname.startsWith("/console/lead-finder") ? (
                        /* Lead Finder Menu */
                        <SidebarGroup>
                            <SidebarGroupLabel>{t('overview')}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/console/lead-finder"}>
                                            <Link href="/console/lead-finder">
                                                <LayoutDashboard />
                                                <span>{t('leadSearch')}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ) : (
                        /* Chatbot & Default Menu */
                        <>
                            {/* Super Admin Header when viewing tenant */}
                            {targetUserId && (
                                <SidebarGroup>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton size="lg" onClick={() => router.push("/platform/tenants")}>
                                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                                        <ArrowLeft className="size-4" />
                                                    </div>
                                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                                        <span className="truncate font-semibold">{t('backToTenants')}</span>
                                                        <span className="truncate text-xs text-muted-foreground">{targetEmail || targetUserId}</span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            )}

                            <SidebarGroup>
                                <SidebarGroupLabel>{t('overview')}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot") && !isActive("/console/chatbot/shopper")}>
                                                <Link href={buildLink("/console/chatbot")}>
                                                    <LayoutDashboard />
                                                    <span>{t('dashboard')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/analytics")}>
                                                <Link href={buildLink("/console/chatbot/analytics")}>
                                                    <BarChart3 />
                                                    <span>{t('analytics')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupLabel>{t('configuration')}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/knowledge")}>
                                                <Link href={buildLink("/console/knowledge")}>
                                                    <Database />
                                                    <span>{t('knowledgeBase')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/widget") && !searchParams.get('tab')}>
                                                <Link href={buildLink("/console/chatbot/widget")}>
                                                    <Settings />
                                                    <span>{t('widgetSettings')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {(isActive("/console/chatbot/widget") || pathname.startsWith(buildLink("/console/chatbot/widget"))) && (
                                                <SidebarMenuSub>
                                                    {[
                                                        { tab: "branding", label: t('branding') },
                                                        { tab: "appearance", label: t('appearance') },
                                                        { tab: "behavior", label: t('behavior') },

                                                        { tab: "availability", label: t('availability') },
                                                        { tab: "engagement", label: t('engagement') },
                                                    ].map((item) => (
                                                        <SidebarMenuSubItem key={item.tab}>
                                                            <SidebarMenuSubButton asChild isActive={searchParams.get('tab') === item.tab || (!searchParams.get('tab') && item.tab === "branding" && isActive("/console/chatbot/widget"))}>
                                                                <Link href={`${buildLink("/console/chatbot/widget")}?tab=${item.tab}`}>
                                                                    <span>{item.label}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            )}
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/integration")}>
                                                <Link href={buildLink("/console/chatbot/integration")}>
                                                    <Plug />
                                                    <span>{t('integration')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/modules") || isActive("/console/chatbot/shopper")}>
                                                <Link href={buildLink("/console/modules")}>
                                                    <Package />
                                                    <span>{t('modules') || "Modüller"}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupLabel>{t('communication')}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/chats")}>
                                                <Link href={buildLink("/console/chatbot/chats")}>
                                                    <MessageSquare />
                                                    <span>{t('chats')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/leads")}>
                                                <Link href={buildLink("/console/chatbot/leads")}>
                                                    <Users />
                                                    <span>{t('leads')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/appointments")}>
                                                <Link href={buildLink("/console/chatbot/appointments")}>
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{t('appointments') || "Appointments"}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupLabel>{t('settings')}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={isActive("/console/chatbot/profile")}>
                                                <Link href={buildLink("/console/chatbot/profile")}>
                                                    <UserCircle />
                                                    <span>{t('profile')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        {targetUserId && (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild isActive={pathname?.includes('/permissions')}>
                                                    <Link href={`/admin/tenant/${targetUserId}/permissions`}>
                                                        <Shield />
                                                        <span>{t('appPermissions') || "Uygulama Erişimleri"}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>


                            {!targetUserId && (role === 'admin' || role === 'SUPER_ADMIN') && (
                                <SidebarGroup>
                                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                                                    <Link href="/admin">
                                                        <Users />
                                                        <span>{t('tenants')}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild isActive={pathname === "/admin/requests"}>
                                                    <Link href="/admin/requests">
                                                        <Inbox />
                                                        <span>{t('requests') || "Requests"}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild isActive={pathname === "/admin/appointments"}>
                                                    <Link href="/admin/appointments">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{t('appointments') || "Appointments"}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            )}
                        </>
                    )}
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                                    {user?.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user?.displayName || 'User'}</span>
                                    <span className="truncate text-xs">{user?.email}</span>
                                </div>
                                <LogOut className="ml-auto size-4" onClick={handleLogout} />
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
