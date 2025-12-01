"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, MessageSquare, Save } from "lucide-react"
import { Image as ImageIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
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
        launcherIcon: "message", // 'message' | 'sparkles' | 'custom' | 'library'
        launcherIconUrl: "",
        launcherLibraryIcon: "MessageSquare", // Default icon from library
        launcherIconColor: "#FFFFFF", // Default icon color
        launcherBackgroundColor: "", // Default background color (empty = use brand color)
        brandColor: "#000000", // Need brand color for preview
        bottomSpacing: 20,
        sideSpacing: 20,
        launcherShadow: "medium", // 'none' | 'light' | 'medium' | 'heavy'
        launcherAnimation: "none", // 'none' | 'pulse' | 'bounce'
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

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
                        launcherIcon: "library", // Force library mode
                        launcherIconUrl: data.launcherIconUrl || "",
                        launcherLibraryIcon: data.launcherLibraryIcon || "MessageSquare",
                        launcherIconColor: data.launcherIconColor || "#FFFFFF",
                        launcherBackgroundColor: data.launcherBackgroundColor || "",
                        brandColor: data.brandColor || "#000000",
                        bottomSpacing: data.bottomSpacing !== undefined ? data.bottomSpacing : 20,
                        sideSpacing: data.sideSpacing !== undefined ? data.sideSpacing : 20,
                        launcherShadow: data.launcherShadow || "medium",
                        launcherAnimation: data.launcherAnimation || "none",
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

    const handleLauncherIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !userId) return

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
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

            setSettings(prev => ({ ...prev, launcherIcon: "custom", launcherIconUrl: downloadURL }))
            toast({
                title: "Success",
                description: "Icon uploaded successfully. Remember to save changes.",
            })
        } catch (error: any) {
            console.error("Error uploading icon:", error)
            toast({
                title: "Error",
                description: `Failed to upload icon: ${error.message || "Unknown error"}`,
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        if (!userId) return
        setIsSaving(true)
        try {
            // Exclude brandColor from save as it's managed by BrandingSettings
            const { brandColor, ...widgetSettings } = settings

            await setDoc(doc(db, "chatbots", userId), {
                ...widgetSettings,
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


    // Helper to render dynamic icon
    const renderIcon = (iconName: string, className?: string) => {
        const IconComponent = (LucideIcons as any)[iconName]
        return IconComponent ? <IconComponent className={className} /> : <MessageSquare className={className} />
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
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Display Settings */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Display Settings</h4>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Position</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={settings.position === "top-left" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "top-left" }))}
                                        className="w-full justify-center"
                                    >
                                        Top Left
                                    </Button>
                                    <Button
                                        variant={settings.position === "top-center" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "top-center" }))}
                                        className="w-full justify-center"
                                    >
                                        Top Center
                                    </Button>
                                    <Button
                                        variant={settings.position === "top-right" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "top-right" }))}
                                        className="w-full justify-center"
                                    >
                                        Top Right
                                    </Button>
                                    <Button
                                        variant={settings.position === "middle-left" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "middle-left" }))}
                                        className="w-full justify-center"
                                    >
                                        Middle Left
                                    </Button>
                                    <Button
                                        variant={settings.position === "middle-center" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "middle-center" }))}
                                        className="w-full justify-center"
                                    >
                                        Middle Center
                                    </Button>
                                    <Button
                                        variant={settings.position === "middle-right" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "middle-right" }))}
                                        className="w-full justify-center"
                                    >
                                        Middle Right
                                    </Button>
                                    <Button
                                        variant={settings.position === "bottom-left" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "bottom-left" }))}
                                        className="w-full justify-center"
                                    >
                                        Bottom Left
                                    </Button>
                                    <Button
                                        variant={settings.position === "bottom-center" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "bottom-center" }))}
                                        className="w-full justify-center"
                                    >
                                        Bottom Center
                                    </Button>
                                    <Button
                                        variant={settings.position === "bottom-right" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: "bottom-right" }))}
                                        className="w-full justify-center"
                                    >
                                        Bottom Right
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

                {/* Positioning & Design */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Positioning & Effects</h4>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs">Vertical Spacing (px)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={settings.bottomSpacing}
                                            onChange={(e) => setSettings(prev => ({ ...prev, bottomSpacing: parseInt(e.target.value) }))}
                                            className="flex-1"
                                        />
                                        <span className="text-xs w-8 text-right">{settings.bottomSpacing}</span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs">Side Spacing (px)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={settings.sideSpacing}
                                            onChange={(e) => setSettings(prev => ({ ...prev, sideSpacing: parseInt(e.target.value) }))}
                                            className="flex-1"
                                        />
                                        <span className="text-xs w-8 text-right">{settings.sideSpacing}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Shadow Intensity</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['none', 'light', 'medium', 'heavy'].map((shadow) => (
                                        <button
                                            key={shadow}
                                            onClick={() => setSettings(prev => ({ ...prev, launcherShadow: shadow }))}
                                            className={`p-2 rounded-md border text-xs capitalize transition-all ${settings.launcherShadow === shadow ? 'border-primary bg-primary/5 font-medium' : 'border-muted hover:bg-muted'}`}
                                        >
                                            {shadow}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Animation</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['none', 'pulse', 'bounce'].map((anim) => (
                                        <button
                                            key={anim}
                                            onClick={() => setSettings(prev => ({ ...prev, launcherAnimation: anim }))}
                                            className={`p-2 rounded-md border text-xs capitalize transition-all ${settings.launcherAnimation === anim ? 'border-primary bg-primary/5 font-medium' : 'border-muted hover:bg-muted'}`}
                                        >
                                            {anim}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                                    <div className="flex items-center justify-between">
                                        <Label>Launcher Icon</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs text-muted-foreground">Bg Color</Label>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-6 w-6 rounded-full border shadow-sm"
                                                        style={{ backgroundColor: settings.launcherBackgroundColor || settings.brandColor }}
                                                    />
                                                    <Input
                                                        type="color"
                                                        value={settings.launcherBackgroundColor || settings.brandColor}
                                                        onChange={(e) => setSettings(prev => ({ ...prev, launcherBackgroundColor: e.target.value }))}
                                                        className="h-6 w-12 p-0.5 cursor-pointer border-0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs text-muted-foreground">Icon Color</Label>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-6 w-6 rounded-full border shadow-sm"
                                                        style={{ backgroundColor: settings.launcherIconColor }}
                                                    />
                                                    <Input
                                                        type="color"
                                                        value={settings.launcherIconColor}
                                                        onChange={(e) => setSettings(prev => ({ ...prev, launcherIconColor: e.target.value }))}
                                                        className="h-6 w-12 p-0.5 cursor-pointer border-0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs">Icon Type</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant={settings.launcherIcon === "library" ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "library" }))}
                                                className="w-full justify-start"
                                            >
                                                Library
                                            </Button>
                                            <Button
                                                variant={settings.launcherIcon === "custom" ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "custom" }))}
                                                className="w-full justify-start"
                                            >
                                                Custom
                                            </Button>
                                        </div>
                                    </div>

                                    {settings.launcherIcon === "library" ? (
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Search icons..."
                                                className="h-8 text-xs"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <div className="border rounded-md p-2 h-48 overflow-y-auto grid grid-cols-6 gap-2">
                                                {Object.keys(LucideIcons)
                                                    .filter(key => {
                                                        // Filter out non-component exports and internal utilities
                                                        if (key === "createLucideIcon" || key === "icons" || key === "default") return false;
                                                        // Ensure it starts with uppercase (Component convention)
                                                        if (!/^[A-Z]/.test(key)) return false;
                                                        // Filter out keys ending with 'Icon' (aliases)
                                                        if (key.endsWith('Icon') && key !== 'Icon') return false;
                                                        // Filter out keys starting with 'Lucide' (aliases)
                                                        if (key.startsWith('Lucide') && key !== 'Lucide') return false;
                                                        // Filter by search term
                                                        if (searchTerm && !key.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                                                        return true;
                                                    })
                                                    .slice(0, 100) // Limit to 100 icons for performance
                                                    .map((iconName) => {
                                                        const Icon = (LucideIcons as any)[iconName]
                                                        // Double check it's a valid component
                                                        if (typeof Icon !== 'function' && typeof Icon !== 'object') return null

                                                        return (
                                                            <button
                                                                key={iconName}
                                                                onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "library", launcherLibraryIcon: iconName }))}
                                                                className={`p-2 rounded hover:bg-muted flex items-center justify-center ${settings.launcherLibraryIcon === iconName ? 'bg-primary/10 text-primary' : ''}`}
                                                                title={iconName}
                                                            >
                                                                <Icon className="w-5 h-5" />
                                                            </button>
                                                        )
                                                    })}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground text-center">
                                                Showing top 100 matches. Search to find more.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden group hover:border-primary transition-colors">
                                                    {isUploading ? (
                                                        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                                                    ) : settings.launcherIconUrl ? (
                                                        <img
                                                            src={settings.launcherIconUrl}
                                                            alt="Icon"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                console.error("Error loading icon image")
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
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
                                                    <p>Recommended: 128×128px</p>
                                                    <p>Max size: 2MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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


            <div className="flex items-center gap-3 pt-4 border-t">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
                <Button variant="outline" onClick={() => window.open(`/widget-test?id=${userId}`, '_blank')}>
                    Test Widget
                </Button>
            </div>
        </div >
    )
}
