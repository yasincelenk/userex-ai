"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, AlertCircle, DollarSign, Plus, List, Loader2, ArrowRight, TrendingUp } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ShopperStats {
    totalProducts: number
    inStock: number
    outOfStock: number
    totalValue: number
}

interface Product {
    id: string
    name: string
    price: number
    currency: string
    inStock: boolean
    createdAt: any
}

interface ShopperDashboardProps {
    onNavigateToCatalog?: () => void
}

export function ShopperDashboard({ onNavigateToCatalog }: ShopperDashboardProps) {
    const { user } = useAuth()
    const [stats, setStats] = useState<ShopperStats | null>(null)
    const [recentProducts, setRecentProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchStats()
        }
    }, [user])

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/shopper/stats?chatbotId=${user?.uid}`)
            if (response.ok) {
                const data = await response.json()
                setStats(data.stats)
                setRecentProducts(data.recentProducts)
            }
        } catch (error) {
            console.error("Error fetching shopper stats:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                        <p className="text-xs text-muted-foreground">Kataloğunuzdaki ürünler</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stoktaki Ürünler</CardTitle>
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <Package className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.inStock || 0}</div>
                        <p className="text-xs text-muted-foreground">Öneriye uygun</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kritik Stok</CardTitle>
                        <div className="p-2 bg-red-100 text-red-600 rounded-full">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.outOfStock || 0}</div>
                        <p className="text-xs text-muted-foreground">Şu an mevcut değil</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Katalog Değeri</CardTitle>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY' }).format(stats?.totalValue || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Tahmini toplam değer</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Products */}
                <div className="col-span-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Son Eklenen Ürünler</h3>
                            <p className="text-sm text-muted-foreground">
                                Kataloğunuza en son eklenenler.
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1" onClick={onNavigateToCatalog}>
                            <Plus className="h-3.5 w-3.5" />
                            Ürün Ekle
                        </Button>
                    </div>

                    <div className="rounded-md border bg-background">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ürün Adı</TableHead>
                                    <TableHead>Fiyat</TableHead>
                                    <TableHead>Durum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground h-32 flex flex-col items-center justify-center border-none">
                                            <div className="mb-2 p-3 bg-muted rounded-full">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <p>Henüz ürün bulunmuyor.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.price} {product.currency}</TableCell>
                                            <TableCell>
                                                <Badge variant={product.inStock ? "outline" : "destructive"} className={product.inStock ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : ""}>
                                                    {product.inStock ? "Stokta" : "Tükendi"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary" onClick={onNavigateToCatalog}>
                            Tümünü Gör <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Quick Actions & Knowledge Context */}
                <div className="col-span-3 space-y-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-blue-900 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Hızlı İpuçları
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-blue-800 space-y-3">
                            <p>
                                🤖 <strong>Asistan Eğitimi:</strong> AI ürün açıklamalarınızı okuyarak öğrenir. Açıklamalar ne kadar detaylıysa öneriler o kadar isabetli olur.
                            </p>
                            <p>
                                🏷️ <strong>Stok Yönetimi:</strong> Stokta olmayan ürünler otomatik olarak önerilerden düşürülür.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Yönetim Paneli</CardTitle>
                            <CardDescription>
                                Asistanınızı ve kataloğunuzu yönetin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 hover:bg-muted/50 transition-colors" onClick={onNavigateToCatalog}>
                                <List className="mr-3 h-5 w-5 text-blue-500" />
                                <div className="text-left">
                                    <div className="font-semibold text-foreground">Katalog Yönetimi</div>
                                    <div className="text-xs text-muted-foreground">Ürün ekle, düzenle veya sil</div>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
