"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function ShopperSettings() {
    const [config, setConfig] = useState({
        salesTone: "friendly",
        strategy: "relevance",
        strictMode: false
    })

    const handleSave = () => {
        // TODO: Save to backend
        console.log("Saving config:", config)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Davranış Yapılandırması</CardTitle>
                <CardDescription>
                    AI asistanınızın kişiliğini ve mantığını özelleştirin.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="tone">Satış Tonu</Label>
                    <Select
                        value={config.salesTone}
                        onValueChange={(val) => setConfig({ ...config, salesTone: val })}
                    >
                        <SelectTrigger id="tone">
                            <SelectValue placeholder="Bir ton seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="friendly">Dostça & Yardımsever (Önerilen)</SelectItem>
                            <SelectItem value="professional">Profesyonel & Resmi</SelectItem>
                            <SelectItem value="enthusiastic">Enerjik & İkna Edici</SelectItem>
                            <SelectItem value="empathetic">Empatik & Dinleyici</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        AI'nın müşterilerle konuşurken kullandığı dil tarzını belirler.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="strategy">Öneri Stratejisi</Label>
                    <Select
                        value={config.strategy}
                        onValueChange={(val) => setConfig({ ...config, strategy: val })}
                    >
                        <SelectTrigger id="strategy">
                            <SelectValue placeholder="Bir strateji seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">En İyi Eşleşme (Alaka Düzeyi)</SelectItem>
                            <SelectItem value="bestsellers">Çok Satanları Öne Çıkar</SelectItem>
                            <SelectItem value="margin">Yüksek Kârlılık Öncelikli</SelectItem>
                            <SelectItem value="inventory">Stok Eritme Odaklı</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        AI'nın hangi ürünleri önce önereceğini nasıl önceliklendirdiği.
                    </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Katı Mod</Label>
                        <p className="text-sm text-muted-foreground">
                            AI'yı yalnızca şirketiniz ve ürünlerinizle ilgili soruları yanıtlaması için kısıtlayın. Yaratıcı yazıları (örn. şiirler) ve konu dışı tartışmaları engeller.
                        </p>
                    </div>
                    <Switch
                        checked={config.strictMode}
                        onCheckedChange={(checked) => setConfig({ ...config, strictMode: checked })}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Değişiklikleri Kaydet
                </Button>
            </CardFooter>
        </Card>
    )
}
