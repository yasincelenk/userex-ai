"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function BrandKnowledge() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        companyName: "",
        brandVoice: "",
        targetAudience: "",
        brandDescription: ""
    })

    // Load existing brand info
    useState(() => {
        const loadBrandInfo = async () => {
            if (!user?.uid) return
            try {
                const docRef = doc(db, "brand_info", user.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setFormData(docSnap.data() as any)
                }
            } catch (error) {
                console.error("Error loading brand info:", error)
            }
        }
        loadBrandInfo()
    })

    const handleSave = async () => {
        if (!user?.uid) return
        setIsLoading(true)
        try {
            await setDoc(doc(db, "brand_info", user.uid), {
                ...formData,
                updatedAt: new Date().toISOString()
            })
            toast({
                title: "Success",
                description: "Brand information saved successfully."
            })
        } catch (error) {
            console.error("Error saving brand info:", error)
            toast({
                title: "Error",
                description: "Failed to save brand information.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label>Company Name</Label>
                <Input
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
            </div>
            <div className="grid gap-2">
                <Label>Brand Voice</Label>
                <Select
                    value={formData.brandVoice}
                    onValueChange={(val) => setFormData({ ...formData, brandVoice: val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="witty">Witty</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>Target Audience</Label>
                <Input
                    placeholder="e.g. Small business owners, Millennials"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
            </div>
            <div className="grid gap-2">
                <Label>Brand Description</Label>
                <Textarea
                    placeholder="Tell us about your brand, values, and what makes you unique..."
                    rows={4}
                    value={formData.brandDescription}
                    onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
                />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Brand Information
            </Button>
        </div>
    )
}
