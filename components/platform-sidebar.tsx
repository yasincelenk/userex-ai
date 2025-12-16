"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    Package,
    Users,
    LogOut
} from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

import { useAuth } from "@/context/AuthContext"

export function PlatformSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { role } = useAuth()

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/login")
    }

    const menuItems = [
        {
            title: "Ürünler",
            href: "/platform/products",
            icon: Package
        },
        {
            title: "Kiracılar",
            href: "/platform/tenants",
            icon: Users
        }
    ]

    return (
        <Sidebar collapsible="icon" className="!top-16 !h-[calc(100svh-4rem)] border-r">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/platform"}>
                                    <Link href="/platform">
                                        <Package className="h-4 w-4" />
                                        <span>Genel Bakış</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {role === 'SUPER_ADMIN' && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Kiracılar</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/platform/tenants"}>
                                        <Link href="/platform/tenants">
                                            <Users className="h-4 w-4" />
                                            <span>Kiracı Listesi</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
