"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Calendar, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BrandingSettings } from "@/components/branding-settings"
import { ChatsList } from "@/components/chats-list"
import { KnowledgeBase } from "@/components/knowledge-base"
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
import { updateDoc } from "firebase/firestore"
import IntegrationPage from "@/components/integration-page"
import WidgetSettings from "@/components/widget-settings"
import { TenantPermissions } from "@/components/tenant-permissions"
import ShopperSettingsPage from "@/app/console/chatbot/shopper/settings/page"

interface TenantData {
    email: string
    role: string
    createdAt: any
    isActive: boolean
    enablePersonalShopper?: boolean
    enableChatbot?: boolean
    enableCopywriter?: boolean
    enableLeadFinder?: boolean
}

function TenantProfileSettings({ tenant, userId, onUpdate }: { tenant: TenantData, userId: string, onUpdate: (data: Partial<TenantData>) => void }) {
    const [role, setRole] = useState(tenant.role)
    const [isActive, setIsActive] = useState(tenant.isActive)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateDoc(doc(db, "users", userId), {
                role,
                isActive
            })
            onUpdate({ role, isActive })
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            })
        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: "Error",
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
                <h3 className="text-lg font-semibold tracking-tight">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">Manage user role and access status.</p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={tenant.email} disabled className="bg-muted/50" />
                    <p className="text-[0.8rem] text-muted-foreground">Email cannot be changed directly.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role">User Role</Label>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Account Status</Label>
                        <p className="text-sm text-muted-foreground">
                            {isActive ? "User can log in and access the dashboard." : "User access is suspended."}
                        </p>
                    </div>
                    <Switch
                        checked={isActive}
                        onCheckedChange={setIsActive}
                    />
                </div>

                <div className="pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ... imports


// ... (keep TenantData and TenantProfileSettings)

export default function TenantDetailClient({ userId }: { userId: string }) {
    const { user, role } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab')

    const [tenant, setTenant] = useState<TenantData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Protect route
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

    return (
        <div className="flex flex-col min-h-screen bg-background/50">
            {/* Header Section */}
            <div className="bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b border-border/40">
                <div className="container mx-auto py-4 px-4 md:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground" onClick={() => router.push("/platform/tenants")}>
                                    Tenants
                                </Button>
                                <span>/</span>
                                <span className="text-foreground font-medium">{tenant.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold tracking-tight">{tenant.email}</h1>
                                <Badge variant={tenant.isActive ? "outline" : "destructive"} className={tenant.isActive ? "text-green-600 border-green-600/20 bg-green-50" : ""}>
                                    {tenant.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="secondary" className="bg-secondary/50">
                                    {tenant.role}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="bg-background" onClick={() => window.open(`/chatbot-view?id=${userId}`, '_blank')}>
                                <ArrowLeft className="w-4 h-4 mr-2 rotate-180" />
                                Test Full Page
                            </Button>
                            <Button size="sm" onClick={() => window.open(`/widget-test?id=${userId}`, '_blank')}>
                                Test Widget
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto py-8 px-4 md:px-8">
                {currentTab === 'settings' ? (
                    <ShopperSettingsPage userId={userId} />
                ) : (
                    <Tabs defaultValue="profile" className="w-full space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList className="h-auto bg-transparent p-0 gap-2 flex-wrap">
                                {["profile", "permissions", "branding", "widget", "chats", "knowledge", "integration"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/50 transition-all"
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-border/50 min-h-[500px]">
                            <TabsContent value="profile" className="m-0 p-6">
                                <TenantProfileSettings tenant={tenant} userId={userId} onUpdate={(updated) => setTenant({ ...tenant, ...updated })} />
                            </TabsContent>

                            <TabsContent value="permissions" className="m-0 p-6">
                                <TenantPermissions tenant={tenant} userId={userId} onUpdate={(updated) => setTenant({ ...tenant, ...updated })} />
                            </TabsContent>

                            <TabsContent value="branding" className="m-0 p-6">
                                <BrandingSettings targetUserId={userId} />
                            </TabsContent>

                            <TabsContent value="widget" className="m-0 p-6">
                                <WidgetSettings userId={userId} />
                            </TabsContent>

                            <TabsContent value="chats" className="m-0 p-6">
                                <ChatsList targetUserId={userId} embedded={true} />
                            </TabsContent>

                            <TabsContent value="knowledge" className="m-0 p-6">
                                <KnowledgeBase targetUserId={userId} embedded={true} />
                            </TabsContent>

                            <TabsContent value="integration" className="m-0 p-6">
                                <IntegrationPage userId={userId} />
                            </TabsContent>
                        </div>
                    </Tabs>
                )}
            </div>
        </div>
    )
}
