"use client"

import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShoppingBag, Mic, FileText, Users, ArrowRight, ArrowLeft } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TenantData {
    enablePersonalShopper?: boolean
    enableChatbot?: boolean
    enableCopywriter?: boolean
    enableLeadFinder?: boolean
    [key: string]: any
}

interface TenantPermissionsProps {
    tenant: TenantData
    userId: string
    onUpdate: (data: Partial<TenantData>) => void
}

interface ModuleConfig {
    id: string
    key: keyof TenantData
    title: string
    description: string
    icon: any
    color: string
    bgColor: string
}

const MODULES: ModuleConfig[] = [
    {
        id: "personal-shopper",
        key: "enablePersonalShopper",
        title: "Kişisel Alışveriş Asistanı",
        description: "Smart product recommendations and catalog management.",
        icon: ShoppingBag,
        color: "text-neutral-700",
        bgColor: "bg-neutral-100",
    },
    {
        id: "voice-assistant",
        key: "enableChatbot", // Assuming Chatbot maps to Voice Assistant in this context as per user image
        title: "Sesli Asistan",
        description: "Kullanıcıların chatbot ile konuşmasına (Ses-Metin) ve yanıtları duymasına (Metin-Ses) izin verin.",
        icon: Mic,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
    },
    {
        id: "copywriter",
        key: "enableCopywriter",
        title: "AI Copywriter",
        description: "Generate compelling marketing copy and product descriptions automatically.",
        icon: FileText,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
    },
    {
        id: "lead-finder",
        key: "enableLeadFinder",
        title: "Lead Finder",
        description: "Identify and engage potential customers using AI-driven insights.",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
    }
]

export function TenantPermissions({ tenant, userId, onUpdate }: TenantPermissionsProps) {
    const [permissions, setPermissions] = useState({
        enablePersonalShopper: tenant.enablePersonalShopper || false,
        enableChatbot: tenant.enableChatbot ?? true,
        enableCopywriter: tenant.enableCopywriter ?? true,
        enableLeadFinder: tenant.enableLeadFinder ?? true,
    })
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    const handlePermissionChange = async (key: string, value: boolean) => {
        const newPermissions = { ...permissions, [key]: value }
        setPermissions(newPermissions)

        // Auto-save on toggle
        setIsSaving(true)
        try {
            await updateDoc(doc(db, "users", userId), { [key]: value })
            onUpdate({ [key]: value })
            toast({
                title: "Success",
                description: "Module status updated.",
            })
        } catch (error) {
            console.error("Error updating permissions:", error)
            setPermissions(permissions) // Revert state
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const activeModule = MODULES.find(m => m.id === activeModuleId)

    if (activeModuleId && activeModule) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setActiveModuleId(null)} className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Modules
                    </Button>
                </div>

                <div className="border rounded-lg p-8 text-center bg-muted/20">
                    <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${activeModule.bgColor}`}>
                        <activeModule.icon className={`h-6 w-6 ${activeModule.color}`} />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight mb-2">{activeModule.title} Settings</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Detailed configuration for {activeModule.title} will be displayed here.
                        Use the "Back to Modules" button to return to the overview.
                    </p>

                    {/* Placeholder for actual settings components */}
                    <div className="mt-8 p-4 border border-dashed rounded bg-background/50">
                        <p className="text-sm font-mono text-muted-foreground">Component: {activeModule.id}-settings</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Modüller</h3>
                <p className="text-muted-foreground">Yapay zeka asistanlarını ve araçlarını yönetin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {MODULES.map((module) => {
                    const isEnabled = permissions[module.key as keyof typeof permissions]

                    return (
                        <Card
                            key={module.id}
                            className={`h-full transition-all duration-300 hover:shadow-lg border hover:border-primary/20 group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 ${!isEnabled && 'opacity-70 grayscale hover:grayscale-0 hover:opacity-100'}`}
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                {/* Optional: Add an external link icon or status here if needed */}
                            </div>

                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className={`p-2.5 rounded-xl ${module.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                                    <module.icon className={`h-6 w-6 ${module.color}`} />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant={isEnabled ? "default" : "secondary"} className={isEnabled ? "bg-green-500 hover:bg-green-600" : ""}>
                                        {isEnabled ? "Aktif" : "Pasif"}
                                    </Badge>
                                    {/* module.role is not defined in ModuleConfig, omitting for now */}
                                    {/* <Badge variant="outline" className="text-xs font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                                            {module.role}
                                        </Badge> */}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">
                                        {module.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                                        {module.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={isEnabled as boolean}
                                            onCheckedChange={(checked) => handlePermissionChange(module.key as string, checked)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {isEnabled ? "Açık" : "Kapalı"}
                                        </span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 hover:bg-primary hover:text-primary-foreground group/btn transition-all duration-300 ml-auto"
                                        onClick={() => setActiveModuleId(module.id)}
                                    >
                                        <span className="sr-only md:not-sr-only text-xs">Yönet</span>
                                        <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
