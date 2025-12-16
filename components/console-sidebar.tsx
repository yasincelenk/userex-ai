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
    Package
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

export function ConsoleSidebar() {
    const pathname = usePathname() || ""
    const searchParams = useSearchParams()
    const router = useRouter()
    const { t } = useLanguage()
    const { user, role, enablePersonalShopper, canManageModules } = useAuth()
    const [showPricing, setShowPricing] = useState(false)

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
                    ) : pathname.startsWith("/console/ui-ux-auditor") ? (
                        /* UI/UX Auditor Menu */
                        <SidebarGroup>
                            <SidebarGroupLabel>{t('analysisTools')}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {[
                                        { href: "/console/ui-ux-auditor/autopilot", icon: Bot, label: t('autopilot') },
                                        { href: "/console/ui-ux-auditor/visual", icon: Eye, label: t('visualAnalysis') },
                                        { href: "/console/ui-ux-auditor/accessibility", icon: ScanLine, label: t('accessibility') },
                                        { href: "/console/ui-ux-auditor/heuristic", icon: CheckSquare, label: t('heuristicEval') },
                                        { href: "/console/ui-ux-auditor/copy", icon: FileText, label: t('copyTone') },
                                        { href: "/console/ui-ux-auditor/user-flow", icon: GitMerge, label: t('userFlow') },
                                        { href: "/console/ui-ux-auditor/cro", icon: TrendingUp, label: t('optimization') },
                                    ].map((item) => (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                                <Link href={item.href}>
                                                    <item.icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ) : (
                        /* Chatbot & Default Menu */
                        <>
                            <SidebarGroup>
                                <SidebarGroupLabel>{t('overview')}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot" && !pathname.startsWith("/console/chatbot/shopper")}>
                                                <Link href="/console/chatbot">
                                                    <LayoutDashboard />
                                                    <span>{t('dashboard')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot/analytics"}>
                                                <Link href="/console/chatbot/analytics">
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
                                            <SidebarMenuButton asChild isActive={pathname === "/console/knowledge"}>
                                                <Link href="/console/knowledge">
                                                    <Database />
                                                    <span>{t('knowledgeBase')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot/widget" && !searchParams.get('tab')}>
                                                <Link href="/console/chatbot/widget">
                                                    <Settings />
                                                    <span>{t('widgetSettings')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {pathname.startsWith("/console/chatbot/widget") && (
                                                <SidebarMenuSub>
                                                    {[
                                                        { tab: "branding", label: t('branding') },
                                                        { tab: "appearance", label: t('appearance') },
                                                        { tab: "behavior", label: t('behavior') },
                                                        { tab: "triggers", label: t('triggers') },
                                                        { tab: "availability", label: t('availability') },
                                                        { tab: "engagement", label: t('engagement') },
                                                    ].map((item) => (
                                                        <SidebarMenuSubItem key={item.tab}>
                                                            <SidebarMenuSubButton asChild isActive={searchParams.get('tab') === item.tab || (!searchParams.get('tab') && item.tab === "branding" && pathname === "/console/chatbot/widget")}>
                                                                <Link href={`/console/chatbot/widget?tab=${item.tab}`}>
                                                                    <span>{item.label}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            )}
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot/integration"}>
                                                <Link href="/console/chatbot/integration">
                                                    <Plug />
                                                    <span>{t('integration')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        {(canManageModules || role === 'SUPER_ADMIN') && (
                                            <>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname.startsWith("/console/modules") || pathname.startsWith("/console/chatbot/shopper")}>
                                                        <Link href="/console/modules">
                                                            <Package />
                                                            <span>{t('modules') || "Modüller"}</span>
                                                        </Link>
                                                    </SidebarMenuButton>

                                                </SidebarMenuItem>
                                            </>
                                        )}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarGroup>
                                <SidebarGroupLabel>{t('communication')}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot/chats"}>
                                                <Link href="/console/chatbot/chats">
                                                    <MessageSquare />
                                                    <span>{t('chats')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot/leads"}>
                                                <Link href="/console/chatbot/leads">
                                                    <Users />
                                                    <span>{t('leads')}</span>
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
                                            <SidebarMenuButton asChild isActive={pathname === "/console/chatbot/profile"}>
                                                <Link href="/console/chatbot/profile">
                                                    <UserCircle />
                                                    <span>{t('profile')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            {role === 'admin' && (
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
