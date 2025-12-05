"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, AlertCircle, DollarSign, Plus, Settings, List, Loader2, ArrowRight, Database } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export function ShopperDashboard() {
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Personal Shopper Overview</h2>
                    <p className="text-muted-foreground">Monitor your product catalog and AI performance.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/console/chatbot/shopper/catalog">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                        <p className="text-xs text-muted-foreground">Items in your catalog</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <Package className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.inStock || 0}</div>
                        <p className="text-xs text-muted-foreground">Available for recommendation</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.outOfStock || 0}</div>
                        <p className="text-xs text-muted-foreground">Currently unavailable</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Catalog Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats?.totalValue || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Approximate total value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Product Knowledge Base Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Knowledge Base</CardTitle>
                    <CardDescription>
                        Add products to train your AI Personal Shopper for better recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="catalog" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
                            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                        </TabsList>
                        <TabsContent value="catalog" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Manage your products and inventory
                                </p>
                                <Link href="/console/chatbot/shopper/catalog">
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Products
                                    </Button>
                                </Link>
                            </div>
                        </TabsContent>
                        <TabsContent value="knowledge" className="space-y-4">
                            <div className="rounded-lg border bg-card p-6 text-center">
                                <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-2">Product Data Training</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Products you add are automatically indexed in the knowledge base for AI recommendations.
                                </p>
                                <Link href="/console/knowledge">
                                    <Button variant="outline" size="sm">
                                        View Knowledge Base
                                    </Button>
                                </Link>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Products */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Products</CardTitle>
                        <CardDescription>
                            The latest items added to your catalog.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.price} {product.currency}</TableCell>
                                            <TableCell>
                                                <Badge variant={product.inStock ? "outline" : "destructive"} className={product.inStock ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                                    {product.inStock ? "In Stock" : "Out of Stock"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Link href="/console/chatbot/shopper/catalog">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Manage your Personal Shopper settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link href="/console/chatbot/shopper/catalog">
                            <Button variant="outline" className="w-full justify-start h-auto py-4 px-4">
                                <List className="mr-4 h-5 w-5 text-blue-500" />
                                <div className="text-left">
                                    <div className="font-semibold">Manage Catalog</div>
                                    <div className="text-xs text-muted-foreground">Add, edit, or remove products</div>
                                </div>
                            </Button>
                        </Link>
                        <Link href="/console/chatbot/shopper/settings">
                            <Button variant="outline" className="w-full justify-start h-auto py-4 px-4">
                                <Settings className="mr-4 h-5 w-5 text-purple-500" />
                                <div className="text-left">
                                    <div className="font-semibold">Shopper Settings</div>
                                    <div className="text-xs text-muted-foreground">Configure AI tone and strategy</div>
                                </div>
                            </Button>
                        </Link>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-semibold text-blue-900 mb-1 text-sm">Did you know?</h4>
                            <p className="text-xs text-blue-700">
                                Your AI Personal Shopper automatically learns from your product descriptions. Make sure they are detailed and accurate for the best recommendations!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
