"use client"

import { Users, LogOut, Shield, Home } from "lucide-react"
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

// Menu items for Super Admin
const items = [
    {
        title: "Tenants",
        url: "/admin",
        icon: Users,
    },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const { toast } = useToast()
    const { user } = useAuth()

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
                <SidebarGroup>
                    <SidebarGroupLabel>Super Admin Panel</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
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
