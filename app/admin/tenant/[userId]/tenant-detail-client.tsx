"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Calendar, Shield, LayoutDashboard, Database, Settings, MessageSquare, Users, UserCircle, Plug, ShoppingBag, Eye, ScanLine, CheckSquare, FileText, GitMerge, TrendingUp, Bot, LogOut, Box } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ChatsList } from "@/components/chats-list"
import { KnowledgeBase } from "@/components/knowledge-base"
import { INDUSTRY_CONFIG, IndustryType } from "@/lib/industry-config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import IntegrationPage from "@/components/integration-page"
import WidgetSettings from "@/components/widget-settings"
import { TenantPermissions } from "@/components/tenant-permissions"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
// import { ScrollArea } from "@/components/ui/scroll-area" // Removed as Sidebar handles scrolling
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
    useSidebar,
    SidebarInset
} from "@/components/ui/sidebar"

interface TenantData {
    email: string
    role: string
    createdAt: any
    isActive: boolean
    enablePersonalShopper?: boolean
    enableChatbot?: boolean
    enableCopywriter?: boolean
    enableLeadFinder?: boolean
    industry?: string
    canManageModules?: boolean
}

function TenantProfileSettings({ tenant, userId, onUpdate }: { tenant: TenantData, userId: string, onUpdate: (data: Partial<TenantData>) => void }) {
    const [role, setRole] = useState(tenant.role)
    const [isActive, setIsActive] = useState(tenant.isActive)
    const [canManageModules, setCanManageModules] = useState(tenant.canManageModules || false)
    const [industry, setIndustry] = useState(tenant.industry || "ecommerce")
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()
    const { t } = useLanguage()
    const { user } = useAuth() // Get current user for token

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateDoc(doc(db, "users", userId), {
                role,
                isActive,
                canManageModules,
                industry
            })

            // Also update the chatbot document to keep industry in sync
            await updateDoc(doc(db, "chatbots", userId), {
                industry
            })

            // Check if user is being activated
            if (!tenant.isActive && isActive) {
                try {
                    await fetch('/api/admin/notify-approval', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: tenant.email,
                            name: tenant.email.split('@')[0]
                        })
                    })
                    toast({
                        title: t('success'),
                        description: "User activated and notification email sent.",
                    })
                } catch (emailError) {
                    console.error("Failed to send approval email:", emailError)
                    toast({
                        title: t('warning'),
                        description: "User activated, but failed to send email.",
                        variant: "destructive"
                    })
                }
            } else {
                toast({
                    title: t('success'),
                    description: "Profile updated successfully.",
                })
            }

            onUpdate({ role, isActive, canManageModules, industry })

        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: t('error'),
                description: "Failed to update profile.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">{t('profileSettings')}</h3>
                <p className="text-sm text-muted-foreground">{t('manageUserRole')}</p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">{t('emailAddress')}</Label>
                    <Input id="email" value={tenant.email} disabled className="bg-muted/50" />
                    <p className="text-[0.8rem] text-muted-foreground">{t('emailCannotChange')}</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role">{t('userRole')}</Label>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('selectRole')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TENANT_ADMIN">{t('tenantAdmin')}</SelectItem>
                            <SelectItem value="SUPER_ADMIN">{t('superAdmin')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="industry">{t('industrySector')}</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('selectIndustry')} />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(INDUSTRY_CONFIG).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">{t('accountStatus')}</Label>
                        <p className="text-sm text-muted-foreground">
                            {isActive ? t('userCanLogin') : t('userSuspended')}
                        </p>
                    </div>
                    <Switch
                        checked={isActive}
                        onCheckedChange={setIsActive}
                    />
                </div>

                {/* Password Reset Section */}
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                    <div className="mb-4">
                        <h4 className="text-base font-semibold text-red-700 dark:text-red-400">{t('passwordManagement')}</h4>
                        <p className="text-sm text-muted-foreground">{t('overridePasswordDesc')}</p>
                    </div>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder={t('newPassword')}
                            className="bg-background"
                            id="new-password-input"
                        />
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                const input = document.getElementById('new-password-input') as HTMLInputElement;
                                const newPassword = input.value;
                                if (!newPassword || newPassword.length < 6) {
                                    toast({
                                        title: t('error'),
                                        description: "Password must be at least 6 characters.",
                                        variant: "destructive"
                                    });
                                    return;
                                }

                                try {
                                    const token = await user?.getIdToken();
                                    const response = await fetch('/api/admin/reset-password', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({
                                            targetUserId: userId,
                                            newPassword
                                        })
                                    });

                                    const data = await response.json();

                                    if (!response.ok) {
                                        throw new Error(data.error || 'Failed to reset password');
                                    }

                                    toast({
                                        title: t('success'),
                                        description: "User password has been updated.",
                                    });
                                    input.value = ''; // Clear input
                                } catch (error: any) {
                                    console.error("Reset error:", error);
                                    toast({
                                        title: t('error'),
                                        description: error.message || "Failed to reset password.",
                                        variant: "destructive"
                                    });
                                }
                            }}
                        >
                            {t('reset')}
                        </Button>
                    </div>
                </div>

                <div className="pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('saveChanges')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const WIDGET_TABS = ['branding', 'appearance', 'behavior', 'availability']

function SidebarNav({ activeTab, onTabChange, enablePersonalShopper }: { activeTab: string, onTabChange: (tab: string) => void, enablePersonalShopper?: boolean }) {
    const isWidgetActive = activeTab === 'widget' || WIDGET_TABS.includes(activeTab)
    const { t } = useLanguage()

    return (
        <SidebarContent>
            {/* Overview Group */}
            <SidebarGroup>
                <SidebarGroupLabel>{t('overview')}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeTab === "profile"}
                                onClick={() => onTabChange("profile")}
                            >
                                <UserCircle />
                                <span>{t('profileSettings')}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            {/* Configuration Group */}
            <SidebarGroup>
                <SidebarGroupLabel>{t('configuration')}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeTab === "modules"}
                                onClick={() => onTabChange("modules")}
                            >
                                <Box />
                                <span>{t('modules')}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeTab === "knowledge"}
                                onClick={() => onTabChange("knowledge")}
                            >
                                <Database />
                                <span>{t('knowledgeBase')}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={isWidgetActive}
                                onClick={() => onTabChange("widget")}
                            >
                                <Settings />
                                <span>{t('widgetSettings')}</span>
                            </SidebarMenuButton>
                            {isWidgetActive && (
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            isActive={activeTab === "branding"}
                                            onClick={() => onTabChange("branding")}
                                            className="cursor-pointer"
                                        >
                                            <span>{t('branding')}</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            isActive={activeTab === "appearance"}
                                            onClick={() => onTabChange("appearance")}
                                            className="cursor-pointer"
                                        >
                                            <span>{t('appearance')}</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            isActive={activeTab === "behavior"}
                                            onClick={() => onTabChange("behavior")}
                                            className="cursor-pointer"
                                        >
                                            <span>{t('behavior')}</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>

                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                            isActive={activeTab === "availability"}
                                            onClick={() => onTabChange("availability")}
                                            className="cursor-pointer"
                                        >
                                            <span>{t('availability')}</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeTab === "integration"}
                                onClick={() => onTabChange("integration")}
                            >
                                <Plug />
                                <span>{t('integration')}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            {/* Personal Shopper Group */}
            {enablePersonalShopper && (
                <SidebarGroup>
                    <SidebarGroupLabel>Personal Shopper</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-2 text-sm text-muted-foreground italic">
                            Shopper settings managed in specific module.
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}

            {/* Communication Group */}
            <SidebarGroup>
                <SidebarGroupLabel>Communication</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={activeTab === "chats"}
                                onClick={() => onTabChange("chats")}
                            >
                                <MessageSquare />
                                <span>{t('chats')}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}

export default function TenantDetailClient({ userId }: { userId: string }) {
    const { user, role } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useLanguage()

    // Default tab or read from URL
    const [activeTab, setActiveTab] = useState("profile")

    const [tenant, setTenant] = useState<TenantData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const tabParam = searchParams.get('tab')
        if (tabParam) {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        // Optionally update URL without reload
        const url = new URL(window.location.href)
        url.searchParams.set('tab', tab)
        window.history.pushState({}, '', url)
    }

    useEffect(() => {
        if (role && role !== "SUPER_ADMIN") {
            router.push("/dashboard")
            return
        }

        const fetchTenant = async () => {
            if (!userId) return

            try {
                const docRef = doc(db, "users", userId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setTenant(docSnap.data() as TenantData)
                } else {
                    console.error("Tenant not found")
                }
            } catch (error) {
                console.error("Error fetching tenant:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (role === "SUPER_ADMIN") {
            fetchTenant()
        }
    }, [userId, role, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!tenant) {
        return (
            <div className="p-8">
                <div className="text-center">Tenant not found</div>
                <Button variant="link" onClick={() => router.push("/admin")}>Go back</Button>
            </div>
        )
    }

    // Helper to get translated tab name
    const getTabTitle = (tab: string) => {
        if (WIDGET_TABS.includes(tab) || tab === 'widget') return t('widgetSettings');
        return t(tab) || tab;
    }

    return (
        <div className="flex w-full h-full">
            {/* Use full width/height for flex container inside SidebarProvider */}
            <Sidebar collapsible="icon" className="border-r">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" onClick={() => router.push("/platform/tenants")}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <ArrowLeft className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{t('backToTenants')}</span>
                                    <span className="truncate text-xs">{t('returnToList')}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarNav activeTab={activeTab} onTabChange={handleTabChange} enablePersonalShopper={tenant.enablePersonalShopper} />
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    {tenant.email.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{tenant.email}</span>
                                    <span className="truncate text-xs">{tenant.role}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            {/* Main Content wrapped in SidebarInset for proper spacing behavior */}
            <SidebarInset className="overflow-hidden">
                <div className="flex flex-col h-full bg-muted/10 overflow-hidden">
                    {/* Header */}
                    <div className="h-[60px] flex shrink-0 items-center justify-between px-8 border-b bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold capitalize">{tenant.email}</h1>
                            <Badge variant={tenant.isActive ? "outline" : "destructive"} className={tenant.isActive ? "text-green-600 border-green-600/20 bg-green-50" : ""}>
                                {tenant.isActive ? t('active') : t('inactive')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground mr-4">
                                {t('editingAsSuperAdmin')}
                            </div>
                            <Button variant="outline" size="sm" className="bg-background" onClick={() => window.open(`/chatbot-view?id=${userId}`, '_blank')}>
                                {t('testFullPage')}
                            </Button>
                            <Button size="sm" onClick={() => window.open(`/widget-test?id=${userId}`, '_blank')}>
                                {t('testWidget')}
                            </Button>
                        </div>
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === "profile" && (
                            <TenantProfileSettings tenant={tenant} userId={userId} onUpdate={(updated) => setTenant({ ...tenant, ...updated })} />
                        )}
                        {activeTab === "modules" && (
                            <TenantPermissions tenant={tenant} userId={userId} onUpdate={(updated) => setTenant({ ...tenant, ...updated })} />
                        )}
                        {activeTab === "knowledge" && (
                            <KnowledgeBase targetUserId={userId} embedded={true} />
                        )}
                        {(activeTab === "widget" || WIDGET_TABS.includes(activeTab)) && (
                            <WidgetSettings userId={userId} />
                        )}
                        {activeTab === "integration" && (
                            <IntegrationPage userId={userId} />
                        )}
                        {activeTab === "chats" && (
                            <ChatsList targetUserId={userId} embedded={true} />
                        )}
                    </div>
                </div>
            </SidebarInset>
        </div>
    )
}
