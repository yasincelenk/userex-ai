"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ShoppingBag, ArrowRight, Mic, MessageSquare, Calendar, Users, BookOpen, Share2, Mail, Lock, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { MODULES, ModuleId, ORDERED_MODULES } from "@/lib/module-config"
import { INDUSTRY_CONFIG, IndustryType, DEFAULT_INDUSTRY } from "@/lib/industry-config"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Lucide Icon Mapping
const ICON_MAP = {
    ShoppingBag,
    Mic,
    MessageSquare,
    Calendar,
    Users,
    BookOpen,
    Share2,
    Mail,

    TrendingUp
}

// Map ModuleId to Firestore Field
const MODULE_FIRESTORE_MAP: Record<ModuleId, string> = {
    generalChatbot: 'enableChatbot',
    productCatalog: 'enablePersonalShopper',
    voiceAssistant: 'enableVoiceAssistant',
    appointments: 'enableAppointments',
    leadCollection: 'enableLeadCollection',
    knowledgeBase: 'enableKnowledgeBase',
    socialMedia: 'enableSocialMedia',
    emailMarketing: 'enableEmailMarketing',
    salesOptimization: 'enableSalesOptimization'
}

interface ModulesContentProps {
    targetUserId?: string
}

export function ModulesContent({ targetUserId }: ModulesContentProps) {
    const { t, language } = useLanguage()
    const router = useRouter()
    const {
        user,
        role,
        enablePersonalShopper,
        enableChatbot,
        enableVoiceAssistant,
        enableKnowledgeBase,
        enableLeadFinder
    } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<ModuleId | null>(null)
    const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({})

    // Use targetUserId if provided, otherwise use current user's uid
    const effectiveUserId = targetUserId || user?.uid
    const isSuperAdminViewingTenant = !!targetUserId

    // Determine User Industry - Default to ecommerce if not set
    const userIndustry: IndustryType = (user as any)?.industry || DEFAULT_INDUSTRY
    const industryConfig = INDUSTRY_CONFIG[userIndustry]

    useEffect(() => {
        const loadModuleStates = async () => {
            if (!effectiveUserId) return
            try {
                // Fetch module states directly from chatbots collection for accurate data
                const chatbotRef = doc(db, "chatbots", effectiveUserId)
                const chatbotSnap = await getDoc(chatbotRef)

                if (chatbotSnap.exists()) {
                    const data = chatbotSnap.data()
                    setModuleStates({
                        generalChatbot: data.enableChatbot === true,
                        productCatalog: data.enablePersonalShopper === true,
                        voiceAssistant: data.enableVoiceAssistant === true,
                        knowledgeBase: data.enableKnowledgeBase === true,
                        leadCollection: data.enableLeadCollection === true,
                        appointments: data.enableAppointments === true,
                        socialMedia: data.enableSocialMedia === true,
                        emailMarketing: data.enableEmailMarketing === true,
                        salesOptimization: data.enableSalesOptimization === true,
                    })
                } else {
                    // Fallback to AuthContext values
                    setModuleStates({
                        generalChatbot: enableChatbot,
                        productCatalog: enablePersonalShopper,
                        voiceAssistant: enableVoiceAssistant,
                        knowledgeBase: enableKnowledgeBase,
                        leadCollection: false,
                        appointments: false,
                        socialMedia: false,
                        emailMarketing: false,

                    })
                }
            } catch (error) {
                console.error("Error loading module states:", error)
            }
        }
        loadModuleStates()
    }, [effectiveUserId, enableChatbot, enablePersonalShopper, enableVoiceAssistant, enableKnowledgeBase])

    const handleToggle = async (moduleId: ModuleId, checked: boolean) => {
        if (!effectiveUserId) return
        setIsLoading(moduleId)
        try {
            const userRef = doc(db, "users", effectiveUserId)
            const chatbotRef = doc(db, "chatbots", effectiveUserId)
            const fieldName = MODULE_FIRESTORE_MAP[moduleId]

            if (!fieldName) throw new Error("Field mapping not found")

            const updates = { [fieldName]: checked }

            await Promise.all([
                updateDoc(userRef, updates),
                updateDoc(chatbotRef, updates)
            ])

            setModuleStates(prev => ({ ...prev, [moduleId]: checked }))

            toast({
                title: checked ? (t('moduleEnabled') || "Modül Aktif Edildi") : (t('moduleDisabled') || "Modül Pasif Edildi"),
                description: t('settingsSavedDesc') || "Ayarlarınız güncellendi."
            })
        } catch (error) {
            console.error("Error updating module:", error)
            toast({
                title: "Error",
                description: "Failed to update module status.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(null)
        }
    }

    const handleManage = (moduleId: ModuleId) => {
        // Build base path based on whether viewing tenant or own console
        const basePath = isSuperAdminViewingTenant
            ? `/admin/tenant/${targetUserId}`
            : '/console'

        // Route to specific module management pages
        switch (moduleId) {
            case 'generalChatbot':
                router.push(`${basePath}/chatbot`)
                break
            case 'productCatalog':
                router.push(`${basePath}/chatbot/shopper`)
                break
            case 'voiceAssistant':
                router.push(isSuperAdminViewingTenant ? `${basePath}/modules` : "/console/modules/voice/settings")
                break
            case 'knowledgeBase':
                router.push(`${basePath}/knowledge`)
                break
            case 'leadCollection':
                router.push(isSuperAdminViewingTenant ? `${basePath}/modules` : "/console/modules/leads/settings")
                break
            case 'salesOptimization':
                router.push(isSuperAdminViewingTenant ? `${basePath}/modules` : "/console/modules/sales-optimization")
                break
            // Add other routes as they are implemented
            default:
                toast({
                    title: t('comingSoon'),
                    description: t('moduleUnderDevelopment')
                })
        }
    }

    const handleRequest = async (moduleId: ModuleId) => {
        if (!effectiveUserId) return
        setIsLoading(moduleId)

        try {
            await addDoc(collection(db, "module_requests"), {
                userId: effectiveUserId,
                userEmail: user?.email,
                moduleId,
                status: 'pending',
                createdAt: serverTimestamp(),
                industry: userIndustry
            })

            toast({
                title: t('requestSent') || "Talep Gönderildi",
                description: t('requestSentDesc') || "Modül talebiniz yöneticiye iletildi. En kısa sürede sizinle iletişime geçeceğiz.",
            })
        } catch (error) {
            console.error("Error sending request:", error)
            toast({
                title: "Error",
                description: "Failed to send request. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(null)
        }
    }

    const isModuleIncluded = (moduleId: ModuleId) => {
        if (moduleId === 'generalChatbot') return true // Always included
        return !!(industryConfig.defaultModules as any)?.[moduleId]
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('modules') || "Modüller"}</h2>
                    <p className="text-muted-foreground">
                        {t('modulesDescription') || "Yapay zeka asistanlarını ve araçlarını yönetin."}
                    </p>
                    {!isSuperAdminViewingTenant && (
                        <div className="mt-2 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            {t('industry')}: {(industryConfig as any).names?.[language] || industryConfig.label}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {ORDERED_MODULES.map((module) => {
                    const isIncluded = isModuleIncluded(module.id)
                    const isActive = module.isCore ? true : (moduleStates[module.id] || false) // Core modules always active
                    const isSuperAdmin = role === 'SUPER_ADMIN'
                    const isCoreModule = module.isCore
                    const isRecommended = module.recommendedFor.includes(userIndustry)

                    // Access is granted if:
                    // 1. User is Super Admin (Can toggle anything)
                    // 2. It is included in the industry package
                    // 3. It is explicitly enabled for the user (Admin Override)
                    const isAccessGranted = isSuperAdmin || isIncluded || isActive

                    const IconComponent = ICON_MAP[module.icon as keyof typeof ICON_MAP] || MessageSquare

                    return (
                        <Card key={module.id} className={`flex flex-col border transition-all hover:shadow-md ${!isAccessGranted ? 'opacity-90 bg-gray-50/50 dark:bg-zinc-900/50' : ''}`}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                {isCoreModule ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                                    {t('coreModule') || 'Temel'}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('coreModuleTooltip') || 'Bu temel bir modüldür ve kapatılamaz.'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : isAccessGranted ? (
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={(checked) => handleToggle(module.id, checked)}
                                        disabled={isLoading === module.id}
                                    />
                                ) : (
                                    <Lock className="w-5 h-5 text-muted-foreground" />
                                )}
                            </CardHeader>
                            <CardContent className="pt-0 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-lg font-semibold">{t(module.nameKey) || module.nameKey}</CardTitle>
                                    {!isCoreModule && (
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-amber-100 text-amber-800">
                                            Premium
                                        </span>
                                    )}
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {t(module.descriptionKey) || module.descriptionKey}
                                </CardDescription>

                                <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={isActive ? 'text-green-600' : 'text-gray-500'}>
                                        {isActive ? t('active') : t('inactive')}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 mt-auto">
                                {isAccessGranted ? (
                                    <Button
                                        className="w-full gap-2"
                                        variant={isActive ? "default" : "outline"}
                                        disabled={!isActive}
                                        onClick={() => handleManage(module.id)}
                                    >
                                        {t('manageModule') || "Modülü Yönet"} <ArrowRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full gap-2"
                                        variant="secondary"
                                        onClick={() => handleRequest(module.id)}
                                        disabled={isLoading === module.id}
                                    >
                                        {isLoading === module.id ? "..." : (t('requestAccess') || "Talep Oluştur")}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
