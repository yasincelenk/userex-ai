"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ShopperSettingsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [salesTone, setSalesTone] = useState("friendly")
    const [recommendationStrategy, setRecommendationStrategy] = useState("best_match")

    useEffect(() => {
        if (user) {
            fetchSettings()
        }
    }, [user])

    const fetchSettings = async () => {
        setIsLoading(true)
        try {
            const docRef = doc(db, "chatbots", user!.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.shopperConfig) {
                    setSalesTone(data.shopperConfig.salesTone || "friendly")
                    setRecommendationStrategy(data.shopperConfig.recommendationStrategy || "best_match")
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error)
            toast({
                title: "Error",
                description: "Failed to load settings.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const docRef = doc(db, "chatbots", user!.uid)
            await updateDoc(docRef, {
                shopperConfig: {
                    salesTone,
                    recommendationStrategy
                }
            })

            toast({
                title: "Success",
                description: "Settings saved successfully."
            })
        } catch (error) {
            console.error("Error saving settings:", error)
            toast({
                title: "Error",
                description: "Failed to save settings.",
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
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Assistant Settings</h1>
                <p className="text-muted-foreground">Configure how your AI Personal Shopper interacts with customers.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Behavior Configuration</CardTitle>
                    <CardDescription>Customize the personality and logic of your AI assistant.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Sales Tone</Label>
                        <Select value={salesTone} onValueChange={setSalesTone}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="friendly">Friendly & Helpful (Recommended)</SelectItem>
                                <SelectItem value="professional">Professional & Formal</SelectItem>
                                <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                                <SelectItem value="direct">Direct & Concise</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            Determines the style of language the AI uses when talking to customers.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Recommendation Strategy</Label>
                        <Select value={recommendationStrategy} onValueChange={setRecommendationStrategy}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="best_match">Best Match (Relevance)</SelectItem>
                                <SelectItem value="lowest_price">Price: Low to High</SelectItem>
                                <SelectItem value="highest_rated">Highest Rated</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            How the AI prioritizes which products to suggest first.
                        </p>
                    </div>

                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
