"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Info } from "lucide-react"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Switch } from "@/components/ui/switch"

interface ShopperSettingsPageProps {
    userId?: string
}

export default function ShopperSettingsPage({ userId }: ShopperSettingsPageProps) {
    const { user, role } = useAuth()
    const { t } = useLanguage()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const targetUserId = userId || user?.uid

    const [salesTone, setSalesTone] = useState("friendly")
    const [recommendationStrategy, setRecommendationStrategy] = useState("best_match")
    const [strictMode, setStrictMode] = useState(false)

    useEffect(() => {
        if (targetUserId) {
            fetchSettings()
        }
    }, [targetUserId])

    const fetchSettings = async () => {
        if (!targetUserId) return
        setIsLoading(true)
        try {
            const docRef = doc(db, "chatbots", targetUserId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.shopperConfig) {
                    setSalesTone(data.shopperConfig.salesTone || "friendly")
                    setRecommendationStrategy(data.shopperConfig.recommendationStrategy || "best_match")
                    setStrictMode(data.shopperConfig.strictMode || false)
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error)
            toast({
                title: t('error'),
                description: t('failedToLoadProfile'), // Using closest generic error
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!targetUserId) return
        setIsSaving(true)
        try {
            const docRef = doc(db, "chatbots", targetUserId)
            await updateDoc(docRef, {
                shopperConfig: {
                    salesTone,
                    recommendationStrategy,
                    strictMode
                }
            })

            toast({
                title: t('success'),
                description: t('saveChanges') + " " + t('success'), // Generic "Save Changes Success"
            })
        } catch (error) {
            console.error("Error saving settings:", error)
            toast({
                title: t('error'),
                description: t('error'),
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('assistantSettings')}</h1>
                <p className="text-muted-foreground">{t('assistantSettingsDescription')}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('behaviorConfiguration')}</CardTitle>
                    <CardDescription>{t('behaviorConfigurationDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>{t('salesTone')}</Label>
                        <Select value={salesTone} onValueChange={setSalesTone}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="friendly">{t('friendlyHelpful')}</SelectItem>
                                <SelectItem value="professional">{t('professionalFormal')}</SelectItem>
                                <SelectItem value="enthusiastic">{t('enthusiasticEnergetic')}</SelectItem>
                                <SelectItem value="direct">{t('directConcise')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {t('salesToneDescription')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('recommendationStrategy')}</Label>
                        <Select value={recommendationStrategy} onValueChange={setRecommendationStrategy}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="best_match">{t('bestMatch')}</SelectItem>
                                <SelectItem value="lowest_price">{t('lowestPrice')}</SelectItem>
                                <SelectItem value="highest_rated">{t('highestRated')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {t('recommendationStrategyDescription')}
                        </p>
                    </div>

                    {role === 'SUPER_ADMIN' && (
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">{t('strictMode')}</Label>
                                <CardDescription>
                                    {t('strictModeDescription')}
                                </CardDescription>
                            </div>
                            <Switch
                                checked={strictMode}
                                onCheckedChange={setStrictMode}
                            />
                        </div>
                    )}

                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {t('saveChanges')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
