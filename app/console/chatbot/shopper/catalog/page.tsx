"use client"

import { ProductKnowledge } from "@/components/product-knowledge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CatalogPage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/console/chatbot/shopper">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
                    <p className="text-muted-foreground">Manage your inventory for the AI Personal Shopper.</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border p-6 shadow-sm">
                <ProductKnowledge />
            </div>
        </div>
    )
}
