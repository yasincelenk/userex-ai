"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ShoppingBag, ArrowRight, Mic, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export default function ModulesPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const { user, enablePersonalShopper, enableVoiceAssistant, enableChatbot } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [isVoiceActive, setIsVoiceActive] = useState(false)
    const [isChatbotActive, setIsChatbotActive] = useState(false)

    useEffect(() => {
        setIsActive(!!enablePersonalShopper)
        setIsVoiceActive(!!enableVoiceAssistant)
        setIsChatbotActive(!!enableChatbot)
    }, [enablePersonalShopper, enableVoiceAssistant, enableChatbot])

    const handleToggle = async (checked: boolean) => {
        if (!user) return
        setIsLoading(true)
        try {
            const userRef = doc(db, "users", user.uid)
            const chatbotRef = doc(db, "chatbots", user.uid)

            await Promise.all([
                updateDoc(userRef, {
                    enablePersonalShopper: checked
                }),
                updateDoc(chatbotRef, {
                    enablePersonalShopper: checked
                })
            ])
            setIsActive(checked)
            toast({
                title: checked ? (t('moduleEnabled') || "Modül Aktif Edildi") : (t('moduleDisabled') || "Modül Pasif Edildi"),
                description: checked ? t('moduleEnabledDesc') : t('moduleDisabledDesc'),
            })
            // window.location.reload()
        } catch (error) {
            console.error("Error updating module:", error)
            toast({
                title: "Error",
                description: "Failed to update module status.",
                variant: "destructive"
            })
            setIsActive(!checked)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChatbotToggle = async (checked: boolean) => {
        if (!user) return
        setIsLoading(true)
        try {
            const userRef = doc(db, "users", user.uid)
            // Chatbot enablement logic
            await updateDoc(userRef, {
                enableChatbot: checked
            })

            setIsChatbotActive(checked)
            toast({
                title: checked ? (t('moduleEnabled') || "Modül Aktif Edildi") : (t('moduleDisabled') || "Modül Pasif Edildi"),
                description: checked ? (t('chatbotModuleEnabledDesc') || "AI Chatbot active") : (t('chatbotModuleDisabledDesc') || "AI Chatbot disabled"),
            })
        } catch (error) {
            console.error("Error updating chatbot module:", error)
            toast({
                title: "Error",
                description: "Failed to update module status.",
                variant: "destructive"
            })
            setIsChatbotActive(!checked)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVoiceToggle = async (checked: boolean) => {
        if (!user) return
        setIsLoading(true)
        try {
            const userRef = doc(db, "users", user.uid)
            const chatbotRef = doc(db, "chatbots", user.uid)

            await Promise.all([
                updateDoc(userRef, {
                    enableVoiceAssistant: checked
                }),
                updateDoc(chatbotRef, {
                    enableVoiceAssistant: checked
                })
            ])
            setIsVoiceActive(checked)
            toast({
                title: checked ? (t('moduleEnabled') || "Modül Aktif Edildi") : (t('moduleDisabled') || "Modül Pasif Edildi"),
                description: checked ? (t('voiceModuleEnabledDesc') || "Voice Assistant active") : (t('voiceModuleDisabledDesc') || "Voice Assistant disabled"),
            })
            // window.location.reload()
        } catch (error) {
            console.error("Error updating voice module:", error)
            toast({
                title: "Error",
                description: "Failed to update module status.",
                variant: "destructive"
            })
            setIsVoiceActive(!checked)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('modules') || "Modüller"}</h2>
                    <p className="text-muted-foreground">
                        {t('modulesDescription') || "Yapay zeka asistanlarını ve araçlarını yönetin."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {/* AI Chatbot Card */}
                <Card className="flex flex-col border transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <Switch
                            checked={isChatbotActive}
                            onCheckedChange={handleChatbotToggle}
                            disabled={isLoading}
                        />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <CardTitle className="text-lg font-semibold mb-2">{t('aiChatbot') || "AI Chatbot"}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {t('aiChatbotDesc') || "Automate customer support and sales with a custom-trained AI assistant."}
                        </CardDescription>

                        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                            <span className={`w-2 h-2 rounded-full ${isChatbotActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className={isChatbotActive ? 'text-green-600' : 'text-gray-500'}>
                                {isChatbotActive ? (t('active') || "Active") : (t('inactive') || "Inactive")}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full gap-2"
                            variant={isChatbotActive ? "default" : "outline"}
                            disabled={!isChatbotActive}
                            onClick={() => router.push("/console/chatbot")}
                        >
                            {t('manageModule') || "Manage Module"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>

                {/* Personal Shopper Card */}
                <Card className="flex flex-col border transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={handleToggle}
                            disabled={isLoading}
                        />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <CardTitle className="text-lg font-semibold mb-2">{t('personalShopper') || "Kişisel Alışveriş Asistanı"}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {t('personalShopperDesc') || "Akıllı ürün önerileri ve katalog yönetimi."}
                        </CardDescription>

                        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className={isActive ? 'text-green-600' : 'text-gray-500'}>
                                {isActive ? (t('active') || "Aktif") : (t('inactive') || "Pasif")}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full gap-2"
                            variant={isActive ? "default" : "outline"}
                            disabled={!isActive}
                            onClick={() => router.push("/console/chatbot/shopper")}
                        >
                            {t('manageModule') || "Modülü Yönet"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
                {/* Voice Assistant Card */}
                <Card className="flex flex-col border transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Mic className="w-6 h-6" />
                        </div>
                        <Switch
                            checked={isVoiceActive}
                            onCheckedChange={handleVoiceToggle}
                            disabled={isLoading}
                        />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <CardTitle className="text-lg font-semibold mb-2">{t('voiceAssistant') || "Voice Assistant"}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {t('voiceAssistantDesc') || "Enable voice interactions with ElevenLabs integration."}
                        </CardDescription>

                        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                            <span className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className={isVoiceActive ? 'text-green-600' : 'text-gray-500'}>
                                {isVoiceActive ? (t('active') || "Active") : (t('inactive') || "Inactive")}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full gap-2"
                            variant={isVoiceActive ? "default" : "outline"}
                            disabled={!isVoiceActive}
                            onClick={() => router.push("/console/modules/voice/settings")}
                        >
                            {t('manageModule') || "Manage Module"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
