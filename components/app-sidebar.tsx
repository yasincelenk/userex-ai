"use client"

import { Calendar, Home, Inbox, Search, Settings, User, LogOut, MessageSquare, Database, Shield, Users } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"

import { useLanguage } from "@/context/LanguageContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const { toast } = useToast()
    const { role } = useAuth()
    const { t } = useLanguage()

    // Menu items.
    const mainItems = [
        {
            title: t('dashboard'),
            url: "/dashboard",
            icon: Home,
        },
    ]

    const testItems = [
        {
            title: t('chats'),
            url: "/dashboard/chats",
            icon: MessageSquare,
        },
        {
            title: t('knowledgeBase'),
            url: "/dashboard/knowledge",
            icon: Database,
        },
        {
            title: t('branding'),
            url: "/dashboard/branding",
            icon: Settings,
        },
    ]

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push("/")
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            })
        } catch (error) {
            console.error("Logout error:", error)
            toast({
                title: "Error",
                description: "Failed to log out.",
                variant: "destructive",
            })
        }
    }

    return (
        <Sidebar {...props}>
            <SidebarContent>
                {/* Main Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {role === "SUPER_ADMIN" && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/dashboard/tenants">
                                            <Users />
                                            <span>{t('tenants')}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Test Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Test</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {testItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
