"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MessageSquare, Save, Globe, Trash2, Send } from "lucide-react"
import { Image as ImageIcon } from "lucide-react"
import { icons } from "lucide-react"
import * as LucideIcons from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

interface WidgetSettingsProps {
    userId?: string
}

export default function WidgetSettings({ userId: propUserId }: WidgetSettingsProps) {
    const { user } = useAuth()
    const userId = propUserId || user?.uid
    const { toast } = useToast()
    const { t } = useLanguage()

    // Combined settings state (branding + widget)
    const [settings, setSettings] = useState({
        // Branding settings
        companyName: "Acme Corp",
        welcomeMessage: "Hello! How can I help you today?",
        brandColor: "#000000",
        brandLogo: "",
        suggestedQuestions: ["What are your pricing plans?", "How do I get started?", "Contact support"],
        enableLeadCollection: false,
        initialLanguage: "auto",
        // Widget settings
        position: "bottom-right",
        viewMode: "classic",
        modalSize: "half",
        launcherStyle: "circle",
        launcherText: "Chat",
        launcherRadius: 50,
        launcherHeight: 60,
        launcherWidth: 60,
        launcherIcon: "library",
        launcherIconUrl: "",
        launcherLibraryIcon: "MessageSquare",
        launcherIconColor: "#FFFFFF",
        launcherBackgroundColor: "",
        bottomSpacing: 20,
        sideSpacing: 20,
        launcherShadow: "medium",
        launcherAnimation: "none",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("branding")

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
                        // Branding
                        companyName: data.companyName || "Acme Corp",
                        welcomeMessage: data.welcomeMessage || "Hello! How can I help you today?",
                        brandColor: data.brandColor || "#000000",
                        brandLogo: data.brandLogo || "",
                        suggestedQuestions: data.suggestedQuestions || ["What are your pricing plans?", "How do I get started?", "Contact support"],
                        enableLeadCollection: data.enableLeadCollection || false,
                        initialLanguage: data.initialLanguage || "auto",
                        // Widget
                        position: data.position || "bottom-right",
                        viewMode: data.viewMode || "classic",
                        modalSize: data.modalSize || "half",
                        launcherStyle: data.launcherStyle || "circle",
                        launcherText: data.launcherText || "Chat",
                        launcherRadius: data.launcherRadius !== undefined ? data.launcherRadius : 50,
                        launcherHeight: data.launcherHeight || 60,
                        launcherWidth: data.launcherWidth || 60,
                        launcherIcon: "library",
                        launcherIconUrl: data.launcherIconUrl || "",
                        launcherLibraryIcon: data.launcherLibraryIcon || "MessageSquare",
                        launcherIconColor: data.launcherIconColor || "#FFFFFF",
                        launcherBackgroundColor: data.launcherBackgroundColor || "",
                        bottomSpacing: data.bottomSpacing !== undefined ? data.bottomSpacing : 20,
                        sideSpacing: data.sideSpacing !== undefined ? data.sideSpacing : 20,
                        launcherShadow: data.launcherShadow || "medium",
                        launcherAnimation: data.launcherAnimation || "none",
                    }))
                }
            } catch (error) {
                console.error("Error loading settings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [userId])

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const storageRef = ref(storage, `logos/${userId}/${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(storageRef)
            setSettings(prev => ({ ...prev, brandLogo: downloadURL }))
            toast({
                title: "Success",
                description: "Logo uploaded successfully.",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to upload logo: ${error.message}`,
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
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
            setSettings(prev => ({ ...prev, launcherIcon: "custom", launcherIconUrl: downloadURL }))
            toast({
                title: "Success",
                description: "Icon uploaded successfully.",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to upload icon: ${error.message}`,
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
            await setDoc(doc(db, "chatbots", userId), {
                ...settings,
                updatedAt: new Date().toISOString(),
            }, { merge: true })

            toast({
                title: "Success",
                description: "Settings saved successfully.",
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

    const addSuggestedQuestion = () => {
        if (settings.suggestedQuestions.length >= 4) {
            toast({
                title: "Limit Reached",
                description: "You can add up to 4 suggested questions.",
                variant: "destructive",
            })
            return
        }
        setSettings(prev => ({
            ...prev,
            suggestedQuestions: [...prev.suggestedQuestions, ""]
        }))
    }

    const updateSuggestedQuestion = (index: number, value: string) => {
        const newQuestions = [...settings.suggestedQuestions]
        newQuestions[index] = value
        setSettings(prev => ({ ...prev, suggestedQuestions: newQuestions }))
    }

    const removeSuggestedQuestion = (index: number) => {
        const newQuestions = settings.suggestedQuestions.filter((_, i) => i !== index)
        setSettings(prev => ({ ...prev, suggestedQuestions: newQuestions }))
    }

    const renderIcon = (iconName: string, className?: string) => {
        const IconComponent = (icons as any)[iconName] || (LucideIcons as any)[iconName]
        return IconComponent ? <IconComponent className={className} /> : <MessageSquare className={className} />
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Panel: Settings with Tabs */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight">Chatbot Configuration</h3>
                        <p className="text-sm text-muted-foreground">Configure your chatbot's appearance and behavior.</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full">
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                        <TabsTrigger value="display">Display</TabsTrigger>
                        <TabsTrigger value="behavior">Behavior</TabsTrigger>
                        <TabsTrigger value="launcher">Launcher</TabsTrigger>
                    </TabsList>

                    {/* Branding Tab */}
                    <TabsContent value="branding" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">General</h4>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="company-name">{t('companyName')}</Label>
                                    <Input
                                        id="company-name"
                                        placeholder="Enter your company name"
                                        value={settings.companyName}
                                        onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="welcome-message">{t('welcomeMessage')}</Label>
                                    <Textarea
                                        id="welcome-message"
                                        placeholder="Enter the first message the user sees..."
                                        value={settings.welcomeMessage}
                                        onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                                        className="resize-none min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('appearance')}</h4>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="brand-color">{t('brandColor')}</Label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-10 w-10 rounded-full border shadow-sm"
                                            style={{ backgroundColor: settings.brandColor }}
                                        />
                                        <Input
                                            id="brand-color"
                                            type="color"
                                            value={settings.brandColor}
                                            onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                                            className="w-20 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={settings.brandColor}
                                            onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                                            className="w-28"
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('brandLogo')}</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden group">
                                            {isUploading ? (
                                                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                                            ) : settings.brandLogo ? (
                                                <img
                                                    src={settings.brandLogo}
                                                    alt="Logo"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <p>Max size: 2MB</p>
                                            <p>Recommended: 128x128px</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('suggestedQuestions')}</h4>
                            <div className="space-y-2">
                                {settings.suggestedQuestions.map((question, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={question}
                                            onChange={(e) => updateSuggestedQuestion(index, e.target.value)}
                                            placeholder={`Question ${index + 1}`}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeSuggestedQuestion(index)}
                                            className="shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {settings.suggestedQuestions.length < 4 && (
                                    <Button variant="outline" size="sm" onClick={addSuggestedQuestion}>
                                        + Add Question
                                    </Button>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Display Tab */}
                    <TabsContent value="display" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Position</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                                    <Button
                                        key={pos}
                                        variant={settings.position === pos ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, position: pos }))}
                                        className="w-full justify-center text-xs"
                                    >
                                        {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">View Mode</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={settings.viewMode === "classic" ? "secondary" : "outline"}
                                    onClick={() => setSettings(prev => ({ ...prev, viewMode: "classic" }))}
                                >
                                    Classic (Small)
                                </Button>
                                <Button
                                    variant={settings.viewMode === "wide" ? "secondary" : "outline"}
                                    onClick={() => setSettings(prev => ({ ...prev, viewMode: "wide" }))}
                                >
                                    Wide Modal
                                </Button>
                            </div>
                            {settings.viewMode === "wide" && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Button
                                        variant={settings.modalSize === "half" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, modalSize: "half" }))}
                                    >
                                        Half Screen
                                    </Button>
                                    <Button
                                        variant={settings.modalSize === "full" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, modalSize: "full" }))}
                                    >
                                        Full Screen
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Spacing</h4>
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
                        </div>
                    </TabsContent>

                    {/* Behavior Tab */}
                    <TabsContent value="behavior" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Lead Collection</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Ask users for their contact information during the chat.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enableLeadCollection}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableLeadCollection: checked }))}
                                />
                            </div>

                            <div className="grid gap-2 border p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <Label className="text-base">Chatbot Language</Label>
                                </div>
                                <Select
                                    value={settings.initialLanguage}
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, initialLanguage: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">Auto-detect (Browser Language)</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="tr">Türkçe</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Set the default language for your chatbot.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Effects</h4>
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
                                    {['none', 'pulse', 'bounce', 'wiggle', 'float', 'spin'].map((anim) => (
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
                    </TabsContent>

                    {/* Launcher Tab */}
                    <TabsContent value="launcher" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Style</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={settings.launcherStyle === "circle" ? "secondary" : "outline"}
                                    onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "circle", launcherRadius: 50, launcherWidth: 60, launcherHeight: 60 }))}
                                >
                                    Circle (Icon)
                                </Button>
                                <Button
                                    variant={settings.launcherStyle === "square" ? "secondary" : "outline"}
                                    onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "square", launcherRadius: 12, launcherWidth: 60, launcherHeight: 60 }))}
                                >
                                    Square (Icon)
                                </Button>
                                <Button
                                    variant={settings.launcherStyle === "text" ? "secondary" : "outline"}
                                    onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "text", launcherRadius: 30, launcherWidth: 100, launcherHeight: 50 }))}
                                >
                                    Text Only
                                </Button>
                                <Button
                                    variant={settings.launcherStyle === "icon_text" ? "secondary" : "outline"}
                                    onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "icon_text", launcherRadius: 30, launcherWidth: 140, launcherHeight: 50 }))}
                                >
                                    Icon + Text
                                </Button>
                            </div>
                        </div>

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

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Colors</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs">Background Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-8 w-8 rounded-full border shadow-sm"
                                            style={{ backgroundColor: settings.launcherBackgroundColor || settings.brandColor }}
                                        />
                                        <Input
                                            type="color"
                                            value={settings.launcherBackgroundColor || settings.brandColor}
                                            onChange={(e) => setSettings(prev => ({ ...prev, launcherBackgroundColor: e.target.value }))}
                                            className="h-8 w-16 p-0.5 cursor-pointer border-0"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs">Icon Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-8 w-8 rounded-full border shadow-sm"
                                            style={{ backgroundColor: settings.launcherIconColor }}
                                        />
                                        <Input
                                            type="color"
                                            value={settings.launcherIconColor}
                                            onChange={(e) => setSettings(prev => ({ ...prev, launcherIconColor: e.target.value }))}
                                            className="h-8 w-16 p-0.5 cursor-pointer border-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(settings.launcherStyle === "circle" || settings.launcherStyle === "square" || settings.launcherStyle === "icon_text") && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Icon</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={settings.launcherIcon === "library" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "library" }))}
                                    >
                                        Library
                                    </Button>
                                    <Button
                                        variant={settings.launcherIcon === "custom" ? "secondary" : "outline"}
                                        onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "custom" }))}
                                    >
                                        Custom
                                    </Button>
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
                                            {Object.keys(icons)
                                                .filter(key => {
                                                    if (searchTerm && !key.toLowerCase().includes(searchTerm.toLowerCase())) return false
                                                    return true
                                                })
                                                .slice(0, 100)
                                                .map((iconName) => {
                                                    const Icon = (icons as any)[iconName]
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
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
                                            {isUploading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : settings.launcherIconUrl ? (
                                                <img src={settings.launcherIconUrl} alt="Icon" className="w-full h-full object-cover" />
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
                                            <p>Max: 2MB</p>
                                            <p>128×128px</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dimensions</h4>
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
                    </TabsContent>
                </Tabs>

                <div className="flex items-center gap-3 pt-4 border-t">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/widget-test?id=${userId}`, '_blank')}>
                        Test Widget
                    </Button>
                </div>
            </div>

            {/* Right Panel: Live Preview */}
            <div className="flex-1 flex flex-col items-center bg-muted/30 rounded-xl border border-dashed border-border/50 p-6 min-h-[600px]">
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                    >
                        Mobile
                    </Button>
                    <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                    >
                        Desktop
                    </Button>
                </div>

                <div className="sticky top-8">
                    {previewMode === 'mobile' ? (
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

                            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-950 flex flex-col relative">
                                {isPreviewOpen ? (
                                    <div className="flex flex-col h-full animate-in slide-in-from-bottom-5 duration-300">
                                        <div
                                            className="p-4 pt-8 text-white flex items-center justify-between shadow-sm"
                                            style={{ backgroundColor: settings.brandColor }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                    <MessageSquare className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm">{settings.companyName}</h3>
                                                    <p className="text-xs text-white/80">Online</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setIsPreviewOpen(false)} className="text-white/80 hover:text-white">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6L18 18" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                                            <div className="flex gap-2 max-w-[85%]">
                                                <div
                                                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white"
                                                    style={{ backgroundColor: settings.brandColor }}
                                                >
                                                    AI
                                                </div>
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border">
                                                    {settings.welcomeMessage}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 w-full max-w-xs ml-8">
                                                {settings.suggestedQuestions?.filter(q => q && q.trim() !== "").map((q, i) => (
                                                    <button
                                                        key={i}
                                                        className="text-xs text-left px-4 py-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all shadow-sm text-gray-600 truncate"
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3 border-t bg-white dark:bg-gray-950">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Type a message..."
                                                    className="flex-1 text-xs bg-gray-100 dark:bg-gray-900 rounded-full px-3 py-2 focus:outline-none"
                                                    disabled
                                                />
                                                <button
                                                    className="p-2 rounded-full text-white"
                                                    style={{ backgroundColor: settings.brandColor }}
                                                >
                                                    <Send className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50 flex items-end justify-end p-4">
                                        <div
                                            className="absolute"
                                            style={{
                                                ...(settings.position.includes('bottom') ? { bottom: `${settings.bottomSpacing}px` } : {}),
                                                ...(settings.position.includes('top') ? { top: `${settings.bottomSpacing + 30}px` } : {}),
                                                ...(settings.position.includes('right') ? { right: `${settings.sideSpacing}px` } : {}),
                                                ...(settings.position.includes('left') ? { left: `${settings.sideSpacing}px` } : {}),
                                                ...(settings.position.includes('center') ? { left: '50%', transform: 'translateX(-50%)' } : {}),
                                            }}
                                        >
                                            <button
                                                onClick={() => setIsPreviewOpen(true)}
                                                style={{
                                                    width: `${Math.min(settings.launcherWidth, 80)}px`,
                                                    height: `${Math.min(settings.launcherHeight, 80)}px`,
                                                    borderRadius: `${settings.launcherRadius}px`,
                                                    backgroundColor: settings.launcherBackgroundColor || settings.brandColor,
                                                    boxShadow: settings.launcherShadow === 'none' ? 'none' :
                                                        settings.launcherShadow === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' :
                                                            settings.launcherShadow === 'medium' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.3)',
                                                }}
                                                className={`flex items-center justify-center gap-2 text-white font-medium transition-transform hover:scale-105 ${settings.launcherAnimation === 'pulse' ? 'animate-pulse' :
                                                    settings.launcherAnimation === 'bounce' ? 'animate-bounce' : ''
                                                    }`}
                                            >
                                                {(settings.launcherStyle === 'circle' || settings.launcherStyle === 'square' || settings.launcherStyle === 'icon_text') && (
                                                    <MessageSquare className="w-5 h-5" style={{ color: settings.launcherIconColor }} />
                                                )}
                                                {(settings.launcherStyle === 'text' || settings.launcherStyle === 'icon_text') && (
                                                    <span className="text-xs" style={{ color: settings.launcherIconColor }}>{settings.launcherText}</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-[500px] bg-white dark:bg-gray-950 rounded-lg shadow-2xl border overflow-hidden">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 flex items-center gap-2 border-b">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 bg-white dark:bg-gray-700 rounded px-3 py-1 text-xs text-gray-500 text-center">
                                    yourwebsite.com
                                </div>
                            </div>

                            <div className="h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative p-6">
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>

                                <div
                                    className="absolute"
                                    style={{
                                        ...(settings.position.includes('bottom') ? { bottom: `${settings.bottomSpacing}px` } : {}),
                                        ...(settings.position.includes('top') ? { top: `${settings.bottomSpacing}px` } : {}),
                                        ...(settings.position.includes('right') ? { right: `${settings.sideSpacing}px` } : {}),
                                        ...(settings.position.includes('left') ? { left: `${settings.sideSpacing}px` } : {}),
                                        ...(settings.position.includes('center') ? { left: '50%', transform: 'translateX(-50%)' } : {}),
                                    }}
                                >
                                    <button
                                        style={{
                                            width: `${settings.launcherWidth}px`,
                                            height: `${settings.launcherHeight}px`,
                                            borderRadius: `${settings.launcherRadius}px`,
                                            backgroundColor: settings.launcherBackgroundColor || settings.brandColor,
                                            boxShadow: settings.launcherShadow === 'none' ? 'none' :
                                                settings.launcherShadow === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' :
                                                    settings.launcherShadow === 'medium' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.3)',
                                        }}
                                        className={`flex items-center justify-center gap-2 text-white font-medium transition-transform hover:scale-105 ${settings.launcherAnimation === 'pulse' ? 'animate-pulse' :
                                            settings.launcherAnimation === 'bounce' ? 'animate-bounce' : ''
                                            }`}
                                    >
                                        {(settings.launcherStyle === 'circle' || settings.launcherStyle === 'square' || settings.launcherStyle === 'icon_text') && (
                                            <MessageSquare className="w-6 h-6" style={{ color: settings.launcherIconColor }} />
                                        )}
                                        {(settings.launcherStyle === 'text' || settings.launcherStyle === 'icon_text') && (
                                            <span className="text-sm" style={{ color: settings.launcherIconColor }}>{settings.launcherText}</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
