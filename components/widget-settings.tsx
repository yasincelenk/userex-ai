"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, MessageSquare, Save } from "lucide-react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"

interface WidgetSettingsProps {
    userId?: string
}

export default function WidgetSettings({ userId: propUserId }: WidgetSettingsProps) {
    const { user } = useAuth()
    const userId = propUserId || user?.uid
    const { toast } = useToast()

    const [settings, setSettings] = useState({
        position: "bottom-right",
        viewMode: "classic", // 'classic' | 'wide'
        modalSize: "half", // 'half' | 'full' (only for wide mode)
        launcherStyle: "circle", // 'circle' | 'square' | 'text' | 'icon_text'
        launcherText: "Chat",
        launcherRadius: 50,
        launcherHeight: 60,
        launcherWidth: 60,
        launcherIcon: "message", // 'message' | 'sparkles'
        launcherIconUrl: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        const loadSettings = async () => {
            if (!userId) return
            setIsLoading(true)
            try {
                const docRef = doc(db, "chatbots", userId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setSettings(prev => ({
                        ...prev,
                        position: data.position || "bottom-right",
                        viewMode: data.viewMode || "classic",
                        modalSize: data.modalSize || "half",
                        launcherStyle: data.launcherStyle || "circle",
                        launcherText: data.launcherText || "Chat",
                        launcherRadius: data.launcherRadius !== undefined ? data.launcherRadius : 50,
                        launcherHeight: data.launcherHeight || 60,
                        launcherWidth: data.launcherWidth || 60,
                        launcherIcon: data.launcherIcon || "message",
                        launcherIconUrl: data.launcherIconUrl || "",
                    }))
                }
            } catch (error) {
                console.error("Error loading widget settings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [userId])

    const handleSave = async () => {
        if (!userId) return
        setIsSaving(true)
        try {
            await setDoc(doc(db, "chatbots", userId), {
                ...settings,
                updatedAt: new Date().toISOString(),
            }, { merge: true })

            toast({
                title: "Success",
                description: "Widget settings saved successfully.",
            })
        } catch (error) {
            console.error("Error saving settings:", error)
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleLauncherIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !userId) return

        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size exceeds 2MB limit.",
                variant: "destructive",
            })
            return
        }

        setIsUploading(true)
        try {
            const storageRef = ref(storage, `launcher_icons/${userId}/${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(storageRef)

            setSettings(prev => ({ ...prev, launcherIconUrl: downloadURL }))
            toast({
                title: "Success",
                description: "Launcher icon uploaded successfully.",
            })
        } catch (error) {
            console.error("Error uploading launcher icon:", error)
            toast({
                title: "Error",
                description: "Failed to upload launcher icon.",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Widget Configuration</h3>
                    <p className="text-sm text-muted-foreground">Control how the widget appears and behaves on your site.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/widget-test?id=${userId}`, '_blank')}>
                        Test Widget
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Display Settings */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Display Settings</h4>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Position</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={settings.position === "bottom-right" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "bottom-right" }))}
                                        className="w-full justify-start"
                                    >
                                        Bottom Right
                                    </Button>
                                    <Button
                                        variant={settings.position === "bottom-left" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "bottom-left" }))}
                                        className="w-full justify-start"
                                    >
                                        Bottom Left
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>View Mode</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={settings.viewMode === "classic" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, viewMode: "classic" }))}
                                        className="w-full justify-start"
                                    >
                                        Classic (Small)
                                    </Button>
                                    <Button
                                        variant={settings.viewMode === "wide" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, viewMode: "wide" }))}
                                        className="w-full justify-start"
                                    >
                                        Wide Modal
                                    </Button>
                                </div>
                            </div>

                            {settings.viewMode === "wide" && (
                                <div className="grid gap-2">
                                    <Label>Modal Size</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={settings.modalSize === "half" ? "secondary" : "outline"}
                                            onClick={() => setSettings(prev => ({ ...prev, modalSize: "half" }))}
                                            className="w-full justify-start"
                                        >
                                            Half Screen
                                        </Button>
                                        <Button
                                            variant={settings.modalSize === "full" ? "secondary" : "outline"}
                                            onClick={() => setSettings(prev => ({ ...prev, modalSize: "full" }))}
                                            className="w-full justify-start"
                                        >
                                            Full Screen
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Launcher Appearance */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Launcher Appearance</h4>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Style</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={settings.launcherStyle === "circle" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "circle", launcherRadius: 50, launcherWidth: 60, launcherHeight: 60 }))}
                                        className="w-full justify-start"
                                    >
                                        Circle (Icon)
                                    </Button>
                                    <Button
                                        variant={settings.launcherStyle === "square" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "square", launcherRadius: 12, launcherWidth: 60, launcherHeight: 60 }))}
                                        className="w-full justify-start"
                                    >
                                        Square (Icon)
                                    </Button>
                                    <Button
                                        variant={settings.launcherStyle === "text" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "text", launcherRadius: 30, launcherWidth: 100, launcherHeight: 50 }))}
                                        className="w-full justify-start"
                                    >
                                        Text Only
                                    </Button>
                                    <Button
                                        variant={settings.launcherStyle === "icon_text" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "icon_text", launcherRadius: 30, launcherWidth: 140, launcherHeight: 50 }))}
                                        className="w-full justify-start"
                                    >
                                        Icon + Text
                                    </Button>
                                </div>
                            </div>

                            {(settings.launcherStyle === "circle" || settings.launcherStyle === "square" || settings.launcherStyle === "icon_text") && (
                                <div className="grid gap-2">
                                    <Label>Launcher Icon</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden group hover:border-primary transition-colors">
                                            {isUploading ? (
                                                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                                            ) : settings.launcherIconUrl ? (
                                                <img src={settings.launcherIconUrl} alt="Icon" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLauncherIconUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <p>Upload custom icon</p>
                                            <p>Max 2MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(settings.launcherStyle === "text" || settings.launcherStyle === "icon_text") && (
                                <div className="grid gap-2">
                                    <Label>Button Text</Label>
                                    <Input
                                        value={settings.launcherText}
                                        onChange={(e) => setSettings(prev => ({ ...prev, launcherText: e.target.value }))}
                                        placeholder="e.g. Chat with us"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs">Height (px)</Label>
                                    <Input
                                        type="number"
                                        value={settings.launcherHeight}
                                        onChange={(e) => setSettings(prev => ({ ...prev, launcherHeight: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs">Width (px)</Label>
                                    <Input
                                        type="number"
                                        value={settings.launcherWidth}
                                        onChange={(e) => setSettings(prev => ({ ...prev, launcherWidth: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs">Radius (px)</Label>
                                    <Input
                                        type="number"
                                        value={settings.launcherRadius}
                                        onChange={(e) => setSettings(prev => ({ ...prev, launcherRadius: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
