"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MessageSquare, Save, Globe, Trash2, Send, Bot, LogOut, Sparkles, X } from "lucide-react"
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
import { INDUSTRY_CONFIG, IndustryType } from "@/lib/industry-config"

interface EngagementMessage {
    text: string;
    delay: number; // Seconds
    isActive: boolean;
}


interface WidgetSettingsProps {
    userId?: string
}

export default function WidgetSettings({ userId: propUserId }: WidgetSettingsProps) {
    const { user } = useAuth()
    const userId = propUserId || user?.uid
    const { toast } = useToast()
    const { t } = useLanguage()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Combined settings state (branding + widget)
    const [settings, setSettings] = useState({
        // Branding settings
        companyName: "Acme Corp",
        welcomeMessage: "Merhaba! Bugün size nasıl yardımcı olabilirim?",
        brandColor: "#000000",
        brandLogo: "",
        suggestedQuestions: ["Fiyatlandırma planlarınız neler?", "Nasıl başlayabilirim?", "Destek ile iletişime geç"],
        enableLeadCollection: false,
        enableVoiceAssistant: false,
        enablePersonalShopper: false,
        initialLanguage: "auto",
        industry: "ecommerce" as IndustryType,
        enableIndustryGreeting: false, // Default to false if not present
        // Theme
        theme: "classic" as "classic" | "modern",
        // Widget settings
        position: "bottom-right",
        viewMode: "classic",
        modalSize: "half",
        launcherStyle: "circle",
        launcherText: "Sohbet",
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
        // Triggers
        autoOpenDelay: 0,
        openOnExitIntent: false,
        openOnScroll: 0,
        // Engagement (Proactive Bubbles)
        engagement: {
            enabled: false,
            triggers: {
                timeOnPage: null as number | null,
                scrollDepth: null as number | null,
                exitIntent: false,
                pageRevisit: null as number | null,
                inactivity: null as number | null,
            },
            bubble: {
                messages: [
                    { text: "Yardıma ihtiyacınız var mı? 👋", delay: 0, isActive: true },
                    { text: "Size özel tekliflerimizi gördünüz mü?", delay: 5, isActive: true }
                ] as EngagementMessage[],
                position: "top" as "top" | "left" | "right",
                style: {
                    backgroundColor: "#000000",
                    textColor: "#FFFFFF",
                    borderRadius: 12,
                    shadow: "medium" as "none" | "small" | "medium" | "large"
                },
                animation: "bounce" as "bounce" | "pulse" | "shake" | "none",
                autoDismiss: true,
                autoDismissDelay: 10,
                showCloseButton: true,
                maxShowCount: 3
            }
        },

        // Availability
        enableBusinessHours: false,
        timezone: "UTC",
        businessHoursStart: "09:00",
        businessHoursEnd: "17:00",
        offlineMessage: "Şu anda çevrimdışıyız.",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("branding")

    // Sync active tab with URL parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab')
        if (tabParam && ['branding', 'appearance', 'behavior', 'engagement', 'availability'].includes(tabParam)) {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams)
        params.set('tab', value)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

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
                        enableVoiceAssistant: data.enableVoiceAssistant || false,
                        enablePersonalShopper: data.enablePersonalShopper || false,
                        initialLanguage: data.initialLanguage || "auto",
                        enableIndustryGreeting: data.enableIndustryGreeting !== undefined ? data.enableIndustryGreeting : false,
                        // Theme
                        theme: data.theme || "classic",
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
                        // Triggers
                        autoOpenDelay: data.autoOpenDelay || 0,
                        openOnExitIntent: data.openOnExitIntent || false,
                        openOnScroll: data.openOnScroll || 0,
                        // Engagement
                        engagement: data.engagement || {
                            enabled: false,
                            triggers: {
                                timeOnPage: data.engagement?.triggers?.timeOnPage || null,
                                scrollDepth: data.engagement?.triggers?.scrollDepth || null,
                                exitIntent: data.engagement?.triggers?.exitIntent || false,
                                pageRevisit: data.engagement?.triggers?.pageRevisit || null,
                                inactivity: data.engagement?.triggers?.inactivity || null,
                            },
                            bubble: {
                                messages: (data.engagement?.bubble?.messages || []).map((m: any) =>
                                    typeof m === 'string'
                                        ? { text: m, delay: 0, isActive: true }
                                        : m
                                ),
                                position: data.engagement?.bubble?.position || "top",
                                style: {
                                    backgroundColor: data.engagement?.bubble?.style?.backgroundColor || "#000000",

                                    textColor: "#FFFFFF",
                                    borderRadius: 12,
                                    shadow: "medium"
                                },
                                animation: "bounce",
                                autoDismiss: true,
                                autoDismissDelay: 10,
                                showCloseButton: true,
                                maxShowCount: 3
                            }
                        },
                        // Availability
                        enableBusinessHours: data.enableBusinessHours || false,
                        timezone: data.timezone || "UTC",
                        businessHoursStart: data.businessHoursStart || "09:00",
                        businessHoursEnd: data.businessHoursEnd || "17:00",
                        offlineMessage: data.offlineMessage || "We are currently offline.",
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

    // Engagement Message Helpers
    const addEngagementMessage = () => {
        if (settings.engagement.bubble.messages.length >= 5) {
            toast({
                title: "Limit Reached",
                description: "You can add up to 5 bubble messages.",
                variant: "destructive",
            })
            return
        }
        setSettings(prev => ({
            ...prev,
            engagement: {
                ...prev.engagement,
                bubble: {
                    ...prev.engagement.bubble,
                    messages: [...prev.engagement.bubble.messages, { text: "", delay: 0, isActive: true }]
                }
            }
        }))
    }


    const updateEngagementMessage = (index: number, field: keyof EngagementMessage, value: any) => {
        const newMessages = [...settings.engagement.bubble.messages]
        newMessages[index] = { ...newMessages[index], [field]: value }
        setSettings(prev => ({
            ...prev,
            engagement: {
                ...prev.engagement,
                bubble: {
                    ...prev.engagement.bubble,
                    messages: newMessages
                }
            }
        }))
    }


    const removeEngagementMessage = (index: number) => {
        const newMessages = settings.engagement.bubble.messages.filter((_, i) => i !== index)
        setSettings(prev => ({
            ...prev,
            engagement: {
                ...prev.engagement,
                bubble: {
                    ...prev.engagement.bubble,
                    messages: newMessages
                }
            }
        }))
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


    const getHeaderInfo = (tab: string) => {
        switch (tab) {
            case 'branding':
                return { title: t('brandingTitle'), desc: t('brandingDesc') }
            case 'appearance':
                return { title: t('appearanceTitle'), desc: t('appearanceDesc') }
            case 'behavior':
                return { title: t('behaviorTitle'), desc: t('behaviorDesc') }
            case 'engagement':
                return { title: t('engagementTitle'), desc: t('engagementDesc') }
            case 'availability':
                return { title: t('availabilityTitle'), desc: t('availabilityDesc') }
            default:
                return { title: t('chatbotConfiguration'), desc: t('configureChatbotDesc') }
        }
    }

    const { title: headerTitle, desc: headerDesc } = getHeaderInfo(activeTab)

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Panel: Settings with Tabs */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight">{headerTitle}</h3>
                        <p className="text-sm text-muted-foreground">{headerDesc}</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">


                    {/* Branding Tab */}
                    <TabsContent value="branding" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('branding')}</h4>
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

                    {/* Appearance Tab (Consolidated Display & Launcher) */}
                    <TabsContent value="appearance" className="space-y-6 mt-6">

                        {/* Theme Selection */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('themeDesignMode')}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${settings.theme === 'classic' ? 'border-primary bg-primary/5' : 'border-muted bg-card'}`}
                                    onClick={() => setSettings(prev => ({ ...prev, theme: 'classic' }))}
                                >
                                    <div className="mb-3 rounded-lg bg-white border p-2 shadow-sm w-full aspect-video flex items-center justify-center">
                                        <div className="flex gap-2 items-end">
                                            <div className="w-6 h-8 bg-gray-100 rounded-lg"></div>
                                            <div className="w-6 h-12 bg-gray-200 rounded-lg"></div>
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="font-medium text-sm">{t('modeClassic')}</h5>
                                        <p className="text-xs text-muted-foreground">{t('modeClassicDesc')}</p>
                                    </div>
                                </div>

                                <div
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${settings.theme === 'modern' ? 'border-primary bg-primary/5' : 'border-muted bg-card'}`}
                                    onClick={() => setSettings(prev => ({ ...prev, theme: 'modern', launcherStyle: 'circle' }))}
                                >
                                    <div className="mb-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border p-2 shadow-sm w-full aspect-video flex items-center justify-center overflow-hidden relative">
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-50 absolute"></div>
                                        <div className="w-10 h-10 rounded-full bg-white relative z-10 flex items-center justify-center shadow-lg">
                                            <Bot className="w-5 h-5 text-indigo-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="font-medium text-sm">{t('modeModern')}</h5>
                                        <p className="text-xs text-muted-foreground">{t('modeModernDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Position & View */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('positionLayout')}</h4>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>{t('widgetPosition')}</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                                            <Button
                                                key={pos}
                                                variant={settings.position === pos ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, position: pos }))}
                                                className="w-full justify-center text-xs"
                                            >
                                                {pos === 'bottom-left' && t('bottomLeft')}
                                                {pos === 'bottom-center' && t('bottomCenter')}
                                                {pos === 'bottom-right' && t('bottomRight')}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {settings.theme === 'classic' && (
                                    <div className="grid gap-2">
                                        <Label>{t('viewMode')}</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant={settings.viewMode === "classic" ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, viewMode: "classic" }))}
                                            >
                                                {t('classicSmall')}
                                            </Button>
                                            <Button
                                                variant={settings.viewMode === "wide" ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, viewMode: "wide" }))}
                                            >
                                                {t('wideModal')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Launcher Settings */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('launcherAppearance')}</h4>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>{t('launcherStyle')}</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={settings.launcherStyle === "circle" ? "secondary" : "outline"}
                                            onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "circle", launcherRadius: 50, launcherWidth: 60, launcherHeight: 60 }))}
                                        >
                                            {t('circleIcon')}
                                        </Button>
                                        <Button
                                            variant={settings.launcherStyle === "square" ? "secondary" : "outline"}
                                            onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "square", launcherRadius: 12, launcherWidth: 60, launcherHeight: 60 }))}
                                        >
                                            {t('squareIcon')}
                                        </Button>
                                        <Button
                                            variant={settings.launcherStyle === "text" ? "secondary" : "outline"}
                                            onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "text", launcherRadius: 30, launcherWidth: 100, launcherHeight: 50 }))}
                                        >
                                            {t('textOnly')}
                                        </Button>
                                        <Button
                                            variant={settings.launcherStyle === "icon_text" ? "secondary" : "outline"}
                                            onClick={() => setSettings(prev => ({ ...prev, launcherStyle: "icon_text", launcherRadius: 30, launcherWidth: 140, launcherHeight: 50 }))}
                                        >
                                            {t('iconText')}
                                        </Button>
                                    </div>
                                </div>

                                {(settings.launcherStyle === "text" || settings.launcherStyle === "icon_text") && (
                                    <div className="grid gap-2">
                                        <Label>{t('buttonText')}</Label>
                                        <Input
                                            value={settings.launcherText}
                                            onChange={(e) => setSettings(prev => ({ ...prev, launcherText: e.target.value }))}
                                            placeholder="e.g. Chat with us"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs">{t('backgroundColor')}</Label>
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
                                        <Label className="text-xs">{t('iconColor')}</Label>
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

                                {(settings.launcherStyle === "circle" || settings.launcherStyle === "square" || settings.launcherStyle === "icon_text") && (
                                    <div className="grid gap-2">
                                        <Label>{t('launcherIcon')}</Label>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <Button
                                                size="sm"
                                                variant={settings.launcherIcon === "library" ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "library" }))}
                                            >
                                                {t('library')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={settings.launcherIcon === "custom" ? "secondary" : "outline"}
                                                onClick={() => setSettings(prev => ({ ...prev, launcherIcon: "custom" }))}
                                            >
                                                {t('custom')}
                                            </Button>
                                        </div>

                                        {settings.launcherIcon === "library" ? (
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder={t('searchIcons')}
                                                    className="h-8 text-xs"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <div className="border rounded-md p-2 h-32 overflow-y-auto grid grid-cols-6 gap-2">
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
                                                    {settings.launcherIconUrl ? (
                                                        <img src={settings.launcherIconUrl} alt="Icon" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleLauncherIconUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Effects & Spacing */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('effectsSpacing')}</h4>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs">{t('verticalSpacing')}</Label>
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
                                        <Label className="text-xs">{t('sideSpacing')}</Label>
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
                                    <Label>Animation Loop</Label>
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
                        </div>
                    </TabsContent>


                    {/* Behavior Tab */}
                    <TabsContent value="behavior" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('chatBehavior')}</h4>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label>{t('industry')}</Label>
                                    <Select
                                        value={settings.industry}
                                        onValueChange={(value) => setSettings(prev => ({ ...prev, industry: value as IndustryType }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectIndustry')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ecommerce">{t('industryEcommerce')}</SelectItem>
                                            <SelectItem value="booking">{t('industryBooking')}</SelectItem>
                                            <SelectItem value="saas">{t('industrySaas')}</SelectItem>
                                            <SelectItem value="real_estate">{t('industryRealEstate')}</SelectItem>
                                            <SelectItem value="healthcare">{t('industryHealthcare')}</SelectItem>
                                            <SelectItem value="education">{t('industryEducation')}</SelectItem>
                                            <SelectItem value="finance">{t('industryFinance')}</SelectItem>
                                            <SelectItem value="service">{t('industryService')}</SelectItem>
                                            <SelectItem value="other">{t('industryOther')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">{t('industryDesc')}</p>
                                </div>

                                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">{t('leadCollection')}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t('leadCollectionDesc')}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.enableLeadCollection}
                                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableLeadCollection: checked }))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('chatbotLanguage')}</Label>
                                    <Select
                                        value={settings.initialLanguage}
                                        onValueChange={(value) => setSettings(prev => ({ ...prev, initialLanguage: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectLanguage')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="auto">{t('langAuto')}</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="tr">Turkish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">{t('langDesc')}</p>
                                </div>


                            </div>
                        </div>
                    </TabsContent>



                    {/* Engagement Tab */}
                    <TabsContent value="engagement" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('proactiveEngagement')}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{t('proactiveEngagementDescription')}</p>
                                </div>
                                <Switch
                                    checked={settings.engagement.enabled}
                                    onCheckedChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        engagement: { ...prev.engagement, enabled: checked }
                                    }))}
                                />
                            </div>

                            {/* Industry Greeting Toggle */}
                            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Industry Specific Greetings</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Use industry-specific welcome messages instead of the standard greeting.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enableIndustryGreeting ?? false}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableIndustryGreeting: checked }))}
                                />
                            </div>

                            {settings.engagement.enabled && (
                                <>
                                    {/* Trigger Conditions */}
                                    <div className="space-y-4 border-t pt-4">
                                        <h5 className="text-sm font-medium">{t('triggerConditions')}</h5>
                                        <p className="text-xs text-muted-foreground">{t('triggerConditionsDescription')}</p>

                                        <div className="grid gap-4">
                                            {/* Time on Page */}
                                            <div className="space-y-2">
                                                <Label>{t('showAfterTimeOnPage')}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="w-24"
                                                        placeholder="0"
                                                        value={settings.engagement.triggers.timeOnPage || ""}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                triggers: {
                                                                    ...prev.engagement.triggers,
                                                                    timeOnPage: e.target.value ? parseInt(e.target.value) : null
                                                                }
                                                            }
                                                        }))}
                                                    />
                                                    <span className="text-sm">seconds</span>
                                                </div>
                                            </div>

                                            {/* Scroll Depth */}
                                            <div className="space-y-2">
                                                <Label>{t('showAtScrollDepth')}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="w-24"
                                                        placeholder="0"
                                                        value={settings.engagement.triggers.scrollDepth || ""}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                triggers: {
                                                                    ...prev.engagement.triggers,
                                                                    scrollDepth: e.target.value ? parseInt(e.target.value) : null
                                                                }
                                                            }
                                                        }))}
                                                    />
                                                    <span className="text-sm">{t('percent')}</span>
                                                </div>
                                            </div>

                                            {/* Exit Intent */}
                                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                                                <div className="space-y-0.5">
                                                    <Label className="text-sm">{t('exitIntent')}</Label>
                                                    <p className="text-xs text-muted-foreground">{t('exitIntentDescription')}</p>
                                                </div>
                                                <Switch
                                                    checked={settings.engagement.triggers.exitIntent}
                                                    onCheckedChange={(checked) => setSettings(prev => ({
                                                        ...prev,
                                                        engagement: {
                                                            ...prev.engagement,
                                                            triggers: {
                                                                ...prev.engagement.triggers,
                                                                exitIntent: checked
                                                            }
                                                        }
                                                    }))}
                                                />
                                            </div>

                                            {/* Page Revisit */}
                                            <div className="space-y-2">
                                                <Label>{t('showOnPageVisit')}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className="w-24"
                                                        placeholder="0"
                                                        value={settings.engagement.triggers.pageRevisit || ""}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                triggers: {
                                                                    ...prev.engagement.triggers,
                                                                    pageRevisit: e.target.value ? parseInt(e.target.value) : null
                                                                }
                                                            }
                                                        }))}
                                                    />
                                                    <span className="text-sm">{t('visits')}</span>
                                                </div>
                                            </div>

                                            {/* Inactivity */}
                                            <div className="space-y-2">
                                                <Label>{t('showAfterInactivity')}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="w-24"
                                                        placeholder="0"
                                                        value={settings.engagement.triggers.inactivity || ""}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                triggers: {
                                                                    ...prev.engagement.triggers,
                                                                    inactivity: e.target.value ? parseInt(e.target.value) : null
                                                                }
                                                            }
                                                        }))}
                                                    />
                                                    <span className="text-sm">seconds</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bubble Messages */}
                                    <div className="space-y-4 border-t pt-4">
                                        <h5 className="text-sm font-medium">{t('bubbleMessages')}</h5>
                                        <p className="text-xs text-muted-foreground">{t('bubbleMessagesDescription')}</p>

                                        <div className="space-y-4">
                                            {settings.engagement.bubble.messages.map((message, index) => (
                                                <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50/50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Label className="text-sm font-medium">{t('message')} {index + 1}</Label>
                                                            <Switch
                                                                checked={message.isActive}
                                                                onCheckedChange={(checked) => updateEngagementMessage(index, 'isActive', checked)}
                                                                className="scale-75"
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeEngagementMessage(index)}
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <div className="grid gap-1.5">
                                                            <Label className="text-xs text-muted-foreground">{t('messageText')}</Label>
                                                            <Input
                                                                value={message.text}
                                                                onChange={(e) => updateEngagementMessage(index, 'text', e.target.value)}
                                                                placeholder={t('enterMessage')}
                                                                className="bg-white"
                                                            />
                                                        </div>

                                                        <div className="grid gap-1.5">
                                                            <Label className="text-xs text-muted-foreground">{t('triggerDelay')}</Label>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={message.delay}
                                                                    onChange={(e) => updateEngagementMessage(index, 'delay', parseInt(e.target.value) || 0)}
                                                                    className="w-24 bg-white"
                                                                />
                                                                <span className="text-xs text-muted-foreground">{t('waitBeforeShowing')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {settings.engagement.bubble.messages.length < 5 && (
                                                <Button variant="outline" size="sm" onClick={addEngagementMessage} className="w-full border-dashed">
                                                    {t('addMessage') || "+ Add Message"}
                                                </Button>
                                            )}
                                        </div>

                                    </div>

                                    {/* Bubble Appearance */}
                                    <div className="space-y-4 border-t pt-4">
                                        <h5 className="text-sm font-medium">{t('bubbleAppearance')}</h5>

                                        {/* Position */}
                                        <div className="space-y-2">
                                            <Label>{t('position')}</Label>
                                            <Select
                                                value={settings.engagement.bubble.position}
                                                onValueChange={(value: "top" | "left" | "right") => setSettings(prev => ({
                                                    ...prev,
                                                    engagement: {
                                                        ...prev.engagement,
                                                        bubble: {
                                                            ...prev.engagement.bubble,
                                                            position: value
                                                        }
                                                    }
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="top">{t('aboveLauncher')}</SelectItem>
                                                    <SelectItem value="left">{t('leftOfLauncher')}</SelectItem>
                                                    <SelectItem value="right">{t('rightOfLauncher')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Colors */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>{t('backgroundColor')}</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="color"
                                                        value={settings.engagement.bubble.style.backgroundColor}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                bubble: {
                                                                    ...prev.engagement.bubble,
                                                                    style: {
                                                                        ...prev.engagement.bubble.style,
                                                                        backgroundColor: e.target.value
                                                                    }
                                                                }
                                                            }
                                                        }))}
                                                        className="h-10 w-20 p-1 cursor-pointer"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={settings.engagement.bubble.style.backgroundColor}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                bubble: {
                                                                    ...prev.engagement.bubble,
                                                                    style: {
                                                                        ...prev.engagement.bubble.style,
                                                                        backgroundColor: e.target.value
                                                                    }
                                                                }
                                                            }
                                                        }))}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>{t('textColor')}</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="color"
                                                        value={settings.engagement.bubble.style.textColor}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                bubble: {
                                                                    ...prev.engagement.bubble,
                                                                    style: {
                                                                        ...prev.engagement.bubble.style,
                                                                        textColor: e.target.value
                                                                    }
                                                                }
                                                            }
                                                        }))}
                                                        className="h-10 w-20 p-1 cursor-pointer"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={settings.engagement.bubble.style.textColor}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                bubble: {
                                                                    ...prev.engagement.bubble,
                                                                    style: {
                                                                        ...prev.engagement.bubble.style,
                                                                        textColor: e.target.value
                                                                    }
                                                                }
                                                            }
                                                        }))}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Border Radius */}
                                        <div className="space-y-2">
                                            <Label>{t('borderRadius')}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="range"
                                                    min="0"
                                                    max="24"
                                                    value={settings.engagement.bubble.style.borderRadius}
                                                    onChange={(e) => setSettings(prev => ({
                                                        ...prev,
                                                        engagement: {
                                                            ...prev.engagement,
                                                            bubble: {
                                                                ...prev.engagement.bubble,
                                                                style: {
                                                                    ...prev.engagement.bubble.style,
                                                                    borderRadius: parseInt(e.target.value)
                                                                }
                                                            }
                                                        }
                                                    }))}
                                                    className="flex-1"
                                                />
                                                <span className="text-sm w-12">{settings.engagement.bubble.style.borderRadius}px</span>
                                            </div>
                                        </div>

                                        {/* Shadow */}
                                        <div className="space-y-2">
                                            <Label>{t('shadow')}</Label>
                                            <Select
                                                value={settings.engagement.bubble.style.shadow}
                                                onValueChange={(value: "none" | "small" | "medium" | "large") => setSettings(prev => ({
                                                    ...prev,
                                                    engagement: {
                                                        ...prev.engagement,
                                                        bubble: {
                                                            ...prev.engagement.bubble,
                                                            style: {
                                                                ...prev.engagement.bubble.style,
                                                                shadow: value
                                                            }
                                                        }
                                                    }
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">{t('shadowNone')}</SelectItem>
                                                    <SelectItem value="small">{t('shadowSmall')}</SelectItem>
                                                    <SelectItem value="medium">{t('shadowMedium')}</SelectItem>
                                                    <SelectItem value="large">{t('shadowLarge')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Animation */}
                                        <div className="space-y-2">
                                            <Label>{t('animation')}</Label>
                                            <Select
                                                value={settings.engagement.bubble.animation}
                                                onValueChange={(value: "bounce" | "pulse" | "shake" | "none") => setSettings(prev => ({
                                                    ...prev,
                                                    engagement: {
                                                        ...prev.engagement,
                                                        bubble: {
                                                            ...prev.engagement.bubble,
                                                            animation: value
                                                        }
                                                    }
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bounce">{t('animationBounce')}</SelectItem>
                                                    <SelectItem value="pulse">{t('animationPulse')}</SelectItem>
                                                    <SelectItem value="shake">{t('animationShake')}</SelectItem>
                                                    <SelectItem value="none">{t('animationNone')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Behavior Settings */}
                                    <div className="space-y-4 border-t pt-4">
                                        <h5 className="text-sm font-medium">{t('behavior')}</h5>

                                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm">{t('autoDismiss')}</Label>
                                                <p className="text- xs text-muted-foreground">{t('autoDismissDescription')}</p>
                                            </div>
                                            <Switch
                                                checked={settings.engagement.bubble.autoDismiss}
                                                onCheckedChange={(checked) => setSettings(prev => ({
                                                    ...prev,
                                                    engagement: {
                                                        ...prev.engagement,
                                                        bubble: {
                                                            ...prev.engagement.bubble,
                                                            autoDismiss: checked
                                                        }
                                                    }
                                                }))}
                                            />
                                        </div>

                                        {settings.engagement.bubble.autoDismiss && (
                                            <div className="space-y-2">
                                                <Label>{t('autoDismissDelay')}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="3"
                                                        max="60"
                                                        className="w-24"
                                                        value={settings.engagement.bubble.autoDismissDelay}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            engagement: {
                                                                ...prev.engagement,
                                                                bubble: {
                                                                    ...prev.engagement.bubble,
                                                                    autoDismissDelay: parseInt(e.target.value) || 10
                                                                }
                                                            }
                                                        }))}
                                                    />
                                                    <span className="text-sm">seconds</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm">{t('showCloseButton')}</Label>
                                                <p className="text-xs text-muted-foreground">{t('showCloseButtonDescription')}</p>
                                            </div>
                                            <Switch
                                                checked={settings.engagement.bubble.showCloseButton}
                                                onCheckedChange={(checked) => setSettings(prev => ({
                                                    ...prev,
                                                    engagement: {
                                                        ...prev.engagement,
                                                        bubble: {
                                                            ...prev.engagement.bubble,
                                                            showCloseButton: checked
                                                        }
                                                    }
                                                }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>{t('maxShowsPerSession')}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    className="w-24"
                                                    value={settings.engagement.bubble.maxShowCount}
                                                    onChange={(e) => setSettings(prev => ({
                                                        ...prev,
                                                        engagement: {
                                                            ...prev.engagement,
                                                            bubble: {
                                                                ...prev.engagement.bubble,
                                                                maxShowCount: parseInt(e.target.value) || 3
                                                            }
                                                        }
                                                    }))}
                                                />
                                                <span className="text-sm">{t('times')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Availability Tab */}
                    <TabsContent value="availability" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('availability')}</h4>

                            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">{t('enableBusinessHours')}</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {t('enableBusinessHoursDesc')}
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enableBusinessHours}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableBusinessHours: checked }))}
                                />
                            </div>

                            {settings.enableBusinessHours && (
                                <div className="grid gap-4 pl-4 border-l-2 ml-2 animate-in slide-in-from-left-2">
                                    <div className="grid gap-2">
                                        <Label>{t('timezone')}</Label>
                                        <Select
                                            value={settings.timezone}
                                            onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('selectTimezone')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UTC">UTC</SelectItem>
                                                <SelectItem value="America/New_York">New York (EST)</SelectItem>
                                                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                                <SelectItem value="Europe/Istanbul">Istanbul (TRT)</SelectItem>
                                                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                                {/* Add more common timezones here */}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>{t('startTime')}</Label>
                                            <Input
                                                type="time"
                                                value={settings.businessHoursStart}
                                                onChange={(e) => setSettings(prev => ({ ...prev, businessHoursStart: e.target.value }))}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>{t('endTime')}</Label>
                                            <Input
                                                type="time"
                                                value={settings.businessHoursEnd}
                                                onChange={(e) => setSettings(prev => ({ ...prev, businessHoursEnd: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>{t('offlineMessage')}</Label>
                                        <Textarea
                                            placeholder={t('offlineMessagePlaceholder')}
                                            value={settings.offlineMessage}
                                            onChange={(e) => setSettings(prev => ({ ...prev, offlineMessage: e.target.value }))}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t('offlineMessageDesc')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex items-center gap-3 pt-4 border-t">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {t('saveChanges')}
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/widget-test?id=${userId}`, '_blank')}>
                        {t('testWidget')}
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
                        {t('mobile')}
                    </Button>
                    <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                    >
                        {t('desktop')}
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
                                    settings.theme === 'modern' ? (
                                        // MODERN THEME PREVIEW
                                        <div className="flex flex-col h-full bg-[#F8F9FC] animate-in zoom-in-95 duration-300 relative overflow-hidden font-sans">
                                            {/* Header */}
                                            <div className="p-5 flex items-center justify-between z-20 relative">
                                                <div className="flex items-center gap-2">
                                                    {settings.brandLogo ? (
                                                        <img src={settings.brandLogo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" />
                                                    )}
                                                    <span className="font-semibold text-gray-800 text-base">{settings.companyName || "AI Assist"}</span>
                                                </div>
                                                <button onClick={() => setIsPreviewOpen(false)}>
                                                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                                </button>
                                            </div>

                                            {/* Glowing Orb Animation Container */}
                                            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full flex justify-center z-0 pointer-events-none">
                                                <div className="relative w-64 h-64">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-[60px] animate-pulse"></div>
                                                    <div className="absolute inset-10 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-[40px]"></div>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 blur-[50px] rounded-full mix-blend-overlay"></div>
                                                </div>
                                            </div>

                                            {/* Main Content Area */}
                                            <div className="flex-1 flex flex-col relative z-10 px-6 pt-32 pb-4">

                                                {/* Welcome Text */}
                                                <div className="text-center mb-auto">
                                                    <h3 className="text-xl md:text-2xl font-medium text-slate-700 leading-tight">
                                                        {settings.welcomeMessage || "What do you want to know about AI?"}
                                                    </h3>
                                                </div>

                                                {/* Suggested Questions (Right Aligned Chips) */}
                                                <div className="flex flex-col items-end gap-3 mb-6">
                                                    {settings.suggestedQuestions.slice(0, 3).map((q, i) => (
                                                        <button
                                                            key={i}
                                                            className="bg-white hover:bg-gray-50 text-gray-700 text-sm py-2.5 px-4 rounded-2xl shadow-sm border border-gray-100 transition-all hover:scale-105 active:scale-95 max-w-[90%] text-left"
                                                        >
                                                            {q}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Show More Link */}
                                                <div className="w-full text-right mb-4 pr-1">
                                                    <button className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">
                                                        Show more
                                                    </button>
                                                </div>

                                                {/* Input Area */}
                                                <div className="bg-white rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-1.5 flex items-center">
                                                    <input
                                                        placeholder="Ask me anything..."
                                                        className="flex-1 bg-transparent border-0 focus:ring-0 text-sm px-4 py-2 text-gray-700 placeholder:text-gray-400"
                                                        disabled
                                                    />
                                                    <button className="p-2 rounded-full hover:bg-gray-50 text-blue-500 transition-colors">
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // CLASSIC THEME PREVIEW
                                        <div className="flex flex-col h-full animate-in slide-in-from-bottom-5 duration-300">
                                            <div
                                                className="p-4 pt-8 text-white flex items-center justify-between shadow-sm"
                                                style={{ backgroundColor: settings.brandColor }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                                                        {settings.brandLogo ? (
                                                            <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <MessageSquare className="w-5 h-5 text-white" />
                                                        )}
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
                                    )
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
                                                    // Removed artificial 80px limit to allow user setting to take effect
                                                    width: (settings.launcherStyle === 'icon_text' || settings.launcherStyle === 'text') ? 'auto' : `${settings.launcherWidth}px`,
                                                    minWidth: (settings.launcherStyle === 'icon_text' || settings.launcherStyle === 'text') ? `${settings.launcherWidth}px` : undefined,
                                                    height: `${settings.launcherHeight}px`,
                                                    borderRadius: `${settings.launcherRadius}px`,
                                                    backgroundColor: settings.launcherBackgroundColor || settings.brandColor,
                                                    boxShadow: settings.launcherShadow === 'none' ? 'none' :
                                                        settings.launcherShadow === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' :
                                                            settings.launcherShadow === 'medium' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.3)',
                                                }}
                                                className={`flex items-center justify-center gap-2 text-white font-medium transition-transform hover:scale-105 ${(settings.launcherStyle === 'icon_text' || settings.launcherStyle === 'text') ? 'px-6' : ''
                                                    } ${settings.launcherAnimation === 'pulse' ? 'animate-pulse' :
                                                        settings.launcherAnimation === 'bounce' ? 'animate-bounce' : ''
                                                    } ${settings.theme === 'modern' ? 'shadow-[0_0_20px_rgba(79,70,229,0.5)]' : ''}`}
                                            >
                                                {(settings.launcherStyle === 'circle' || settings.launcherStyle === 'square' || settings.launcherStyle === 'icon_text') && (
                                                    settings.launcherIcon === "custom" && settings.launcherIconUrl ? (
                                                        <img src={settings.launcherIconUrl} alt="Icon" className="w-6 h-6 object-cover rounded-sm" />
                                                    ) : (
                                                        renderIcon(settings.launcherLibraryIcon || "MessageSquare", "w-6 h-6")
                                                    )
                                                )}
                                                {(settings.launcherStyle === 'text' || settings.launcherStyle === 'icon_text') && (
                                                    <span className="text-sm" style={{ color: settings.launcherIconColor }}>{settings.launcherText}</span>
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
                                            settings.launcherIcon === "custom" && settings.launcherIconUrl ? (
                                                <img src={settings.launcherIconUrl} alt="Icon" className="w-6 h-6 object-cover rounded-sm" />
                                            ) : (
                                                renderIcon(settings.launcherLibraryIcon || "MessageSquare", "w-6 h-6")
                                            )
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
