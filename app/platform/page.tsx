"use client"

import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, User, LogOut, Globe, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { ProductLauncher } from "@/components/product-launcher"
import { products } from "@/lib/product-items"
import { useLanguage } from "@/context/LanguageContext"

export default function PlatformPage() {
    const { user, enableChatbot, enableCopywriter, enableLeadFinder } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const { language, setLanguage } = useLanguage()

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

    const visibleProducts = products.filter(product => {
        if (product.id === 'chatbot') return enableChatbot
        if (product.id === 'copywriter') return enableCopywriter
        if (product.id === 'lead-finder') return enableLeadFinder
        return true
    })

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground mt-2">Select a product to manage or explore new AI capabilities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((product) => (
                    <Card key={product.id} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20 group"
                        onClick={() => product.status === "active" && router.push(product.href)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-xl ${product.bgColor} ${product.color} mb-4`}>
                                    <product.icon className="w-6 h-6" />
                                </div>
                                {product.status === "coming_soon" && (
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-500">Coming Soon</Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {product.title}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                {product.description}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            {product.status === "active" ? (
                                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                                    Open Console <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button variant="ghost" disabled className="w-full justify-start text-muted-foreground">
                                    <Lock className="w-4 h-4 mr-2" /> Early Access
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
