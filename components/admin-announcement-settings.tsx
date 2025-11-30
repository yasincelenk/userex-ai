"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Megaphone } from "lucide-react"

export function AdminAnnouncementSettings() {
    const [message, setMessage] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "system_settings", "general")
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setMessage(data.announcementMessage || "")
                    setIsActive(data.announcementActive || false)
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await setDoc(doc(db, "system_settings", "general"), {
                announcementMessage: message,
                announcementActive: isActive,
                updatedAt: new Date().toISOString()
            }, { merge: true })

            toast({
                title: "Success",
                description: "Announcement settings updated.",
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

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <CardTitle>Global Announcement</CardTitle>
                </div>
                <CardDescription>
                    Broadcast a message to all tenant dashboards.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Switch id="active-mode" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="active-mode">Announcement Active</Label>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Input
                        id="message"
                        placeholder="e.g., System maintenance scheduled for tonight..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    )
}
