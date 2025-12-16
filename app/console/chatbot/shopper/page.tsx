"use client"

import { useState } from "react"
import { ShopperDashboard } from "@/components/shopper-dashboard"
import { ShopperSettings } from "@/components/shopper-settings"
import { ProductKnowledge } from "@/components/product-knowledge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Loader2, RefreshCw, Rss } from "lucide-react"

export default function ShopperPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("overview")
    const [feedUrl, setFeedUrl] = useState("")
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = async () => {
        if (!feedUrl) {
            toast({
                title: "Hata",
                description: "Lütfen geçerli bir XML Feed URL girin.",
                variant: "destructive"
            })
            return
        }

        setIsSyncing(true)
        try {
            const response = await fetch("/api/chatbot/shopper/feed-sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await user?.getIdToken()}`
                },
                body: JSON.stringify({
                    feedUrl,
                    chatbotId: user?.uid
                })
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Başarılı",
                    description: `Feed başarıyla senkronize edildi. ${data.count} ürün işlendi.`
                })
            } else {
                throw new Error(data.error || "Feed senkronize edilemedi")
            }
        } catch (error: any) {
            console.error("Sync error:", error)
            toast({
                title: "Senkronizasyon Hatası",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Kişisel Alışveriş Asistanı</h1>
                <p className="text-muted-foreground">
                    Yapay zeka satış asistanınızı, ürün kataloğunuzu ve veri kaynaklarınızı yönetin.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                    <TabsTrigger value="catalog">Ürün Kataloğu</TabsTrigger>
                    <TabsTrigger value="datasources">Veri Kaynakları</TabsTrigger>
                    <TabsTrigger value="settings">Asistan Ayarları</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <ShopperDashboard onNavigateToCatalog={() => setActiveTab("catalog")} />
                </TabsContent>

                <TabsContent value="catalog" className="space-y-4">
                    <div className="bg-white rounded-lg border p-6 shadow-sm">
                        <ProductKnowledge />
                    </div>
                </TabsContent>

                <TabsContent value="datasources" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <Rss className="w-5 h-5" />
                                    </div>
                                    <CardTitle>XML Ürün Beslemesi</CardTitle>
                                </div>
                                <CardDescription>
                                    Ürün kataloğunuzu XML feed URL ile bağlayın.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="feed-url">Feed URL</Label>
                                    <Input
                                        id="feed-url"
                                        placeholder="https://ornek.com/products.xml"
                                        value={feedUrl}
                                        onChange={(e) => setFeedUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Genel XML, RSS 2.0 ve Google Merchant feedlerini destekler.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSync} disabled={isSyncing} className="w-full">
                                    {isSyncing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Senkronize Ediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Şimdi Senkronize Et
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <ShopperSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}
