"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, LayoutDashboard, Globe, Check } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Breadcrumbs } from "@/components/breadcrumbs"

import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/LanguageContext"
import { ProductLauncher } from "@/components/product-launcher"
import Image from "next/image"

export function SiteHeader({ showSidebarTrigger = true }: { showSidebarTrigger?: boolean }) {
    const { user, role } = useAuth()
    const { t, language, setLanguage } = useLanguage()
    const router = useRouter()
    const { toast } = useToast()

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

    const getInitials = (email: string) => {
        return email?.substring(0, 2).toUpperCase() || "U"
    }

    return (
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 shadow-sm w-full">
            <div className="flex items-center gap-2">
                <ProductLauncher />
                {showSidebarTrigger && <SidebarTrigger />}
                <div className="flex items-center gap-2 ml-2">
                    <Image
                        src="/exai-logo-dark.png"
                        alt="ex ai"
                        width={100}
                        height={24}
                        className="h-6 w-auto object-contain"
                    />
                </div>
                <div className="ml-4 h-6 w-px bg-border" />
                <Breadcrumbs />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2 h-auto p-2 hover:bg-accent hover:text-accent-foreground outline-none")}>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || ""} alt={user?.email || ""} />
                            <AvatarFallback>{user?.email ? getInitials(user.email) : "U"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">User</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>{t('dashboard')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>{t('profile')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/dashboard/branding")}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t('settings')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
                            {t('language')}
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setLanguage('en')}>
                            <Globe className="mr-2 h-4 w-4" />
                            <span>English</span>
                            {language === 'en' && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('tr')}>
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Türkçe</span>
                            {language === 'tr' && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(role === 'admin' || role === 'SUPER_ADMIN') && (
                            <DropdownMenuItem onClick={() => router.push("/admin")}>
                                <LayoutDashboard className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500 font-medium">Manage Tenants</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{t('logout')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
