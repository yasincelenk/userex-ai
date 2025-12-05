"use client"

import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Shield } from "lucide-react"
import { products } from "@/lib/product-items"

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

export function TenantPermissions({ tenant, userId, onUpdate }: TenantPermissionsProps) {
    const [permissions, setPermissions] = useState({
        enablePersonalShopper: tenant.enablePersonalShopper || false,
        enableChatbot: tenant.enableChatbot ?? true, // Default to true if not set
        enableCopywriter: tenant.enableCopywriter ?? true,
        enableLeadFinder: tenant.enableLeadFinder ?? true,
    })
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    const handlePermissionChange = (key: string, value: boolean) => {
        setPermissions(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateDoc(doc(db, "users", userId), permissions)
            onUpdate(permissions)
            toast({
                title: "Success",
                description: "Permissions updated successfully.",
            })
        } catch (error) {
            console.error("Error updating permissions:", error)
            toast({
                title: "Error",
                description: "Failed to update permissions.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Product Permissions</h3>
                <p className="text-sm text-muted-foreground">Manage access to specific platform products and features.</p>
            </div>

            <div className="grid gap-6">
                {/* Standard Products */}
                {products.map((product) => {
                    const key = `enable${product.id.charAt(0).toUpperCase() + product.id.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}` as keyof typeof permissions
                    // e.g. enableChatbot, enableLeadFinder

                    return (
                        <div key={product.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <product.icon className={`h-4 w-4 ${product.color}`} />
                                    <Label className="text-base">{product.title}</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {permissions[key] ? `${product.title} is enabled.` : `${product.title} is disabled.`}
                                </p>
                            </div>
                            <Switch
                                checked={permissions[key] as boolean}
                                onCheckedChange={(checked) => handlePermissionChange(key, checked)}
                            />
                        </div>
                    )
                })}

                {/* Special Features */}
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <Label className="text-base">Personal Shopper</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {permissions.enablePersonalShopper ? "AI Personal Shopper features are enabled." : "Personal Shopper features are disabled."}
                        </p>
                    </div>
                    <Switch
                        checked={permissions.enablePersonalShopper}
                        onCheckedChange={(checked) => handlePermissionChange("enablePersonalShopper", checked)}
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
