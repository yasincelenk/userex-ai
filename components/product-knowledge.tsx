import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Search, Trash2, Upload, Globe, DollarSign, Package } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
    id: string
    name: string
    price: number
    currency: string
    description: string
    inStock: boolean
    imageUrl?: string
    createdAt: any
    tenantId?: string
}

export function ProductKnowledge() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false) // Renamed for clarity, was isOpen

    // Import / Feed State
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [feedUrl, setFeedUrl] = useState("")
    const [isSyncing, setIsSyncing] = useState(false)

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        currency: "USD",
        description: "",
        imageUrl: ""
    })

    const fetchProducts = async () => {
        if (!user?.uid) return
        setIsLoading(true)
        try {
            const q = query(
                collection(db, "products"),
                where("chatbotId", "==", user.uid)
            )
            const querySnapshot = await getDocs(q)
            const fetchedProducts: Product[] = []
            querySnapshot.forEach((doc) => {
                fetchedProducts.push({ id: doc.id, ...doc.data() } as Product)
            })
            setProducts(fetchedProducts)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [user])

    const handleAddProduct = async () => {
        if (!user?.uid || !newProduct.name || !newProduct.price) return
        setIsAdding(true)
        try {
            await addDoc(collection(db, "products"), {
                chatbotId: user.uid,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                currency: newProduct.currency,
                description: newProduct.description,
                imageUrl: newProduct.imageUrl,
                inStock: true,
                createdAt: serverTimestamp()
            })

            toast({
                title: "Success",
                description: "Product added to catalog."
            })
            setIsAddDialogOpen(false)
            setNewProduct({ name: "", price: "", currency: "USD", description: "", imageUrl: "" })
            fetchProducts()
        } catch (error) {
            console.error("Error adding product:", error)
            toast({
                title: "Error",
                description: "Failed to add product.",
                variant: "destructive"
            })
        } finally {
            setIsAdding(false)
        }
    }

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await deleteDoc(doc(db, "products", productId))
            toast({
                title: "Deleted",
                description: "Product removed from catalog."
            })
            fetchProducts()
        } catch (error) {
            console.error("Error deleting product:", error)
            toast({
                title: "Error",
                description: "Failed to delete product.",
                variant: "destructive"
            })
        }
    }

    const handleFeedSync = async () => {
        if (!feedUrl) return
        setIsSyncing(true)
        try {
            const token = await user?.getIdToken()
            const res = await fetch('/api/chatbot/shopper/feed-sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ feedUrl, chatbotId: user?.uid })
            })
            const data = await res.json()
            if (data.success) {
                toast({ title: "Success", description: `Synced ${data.count} products from feed.` })
                setFeedUrl("")
                setIsImportOpen(false) // Close the import dialog
                await fetchProducts()
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Feed sync failed", variant: "destructive" })
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium">Product Catalog</h2>
                    <p className="text-sm text-gray-500">
                        Manage your products for AI recommendations.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Upload className="h-4 w-4" />
                                Import Options
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Import Products</DialogTitle>
                                <DialogDescription>Choose a method to import your products.</DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="feed" className="w-full">
                                <TabsList className="grid w-full grid-cols-1">
                                    <TabsTrigger value="feed">XML Feed (Bulk)</TabsTrigger>
                                </TabsList>

                                <TabsContent value="feed" className="space-y-4 py-4">
                                    <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700 mb-4">
                                        <p className="font-semibold flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Auto-Sync Enabled
                                        </p>
                                        <p>Connect your Google Merchant or generic XML feed. The system will automatically update prices and stock levels daily.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>XML Feed URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://site.com/feed/google_merchant.xml"
                                                value={feedUrl}
                                                onChange={(e) => setFeedUrl(e.target.value)}
                                            />
                                            <Button onClick={handleFeedSync} disabled={isSyncing}>
                                                {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sync Feed"}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Supports RSS 2.0, Atom, Google Merchant Center formats.</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogDescription>
                                    Add a product to your catalog. The AI will use this information to make recommendations.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Product Name</Label>
                                    <Input
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g. Premium Wireless Headphones"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Price</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-8"
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                placeholder="99.99"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Currency</Label>
                                        <Input
                                            value={newProduct.currency}
                                            onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                                            placeholder="USD"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        placeholder="Detailed product description..."
                                        rows={3}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Image URL (Optional)</Label>
                                    <Input
                                        value={newProduct.imageUrl}
                                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleAddProduct} disabled={isAdding} className="w-full">
                                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Product
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No products found. Add your first product to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="h-8 w-8 rounded object-cover" />
                                            ) : (
                                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            {product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.price} {product.currency}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.inStock ? "outline" : "destructive"} className={product.inStock ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                            {product.inStock ? "In Stock" : "Out of Stock"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
