import { MessageSquare, ShoppingBag, PenTool, Search } from "lucide-react"

export interface ProductItem {
    id: string
    title: string
    description: string
    icon: any
    status: "active" | "coming_soon"
    href: string
    color: string
    bgColor: string
}

export const products: ProductItem[] = [
    {
        id: "chatbot",
        title: "AI Chatbot",
        description: "Automate customer support with a custom-trained AI assistant.",
        icon: MessageSquare,
        status: "active",
        href: "/console/chatbot",
        color: "text-blue-500",
        bgColor: "bg-blue-50"
    },

    {
        id: "copywriter",
        title: "AI Copywriter",
        description: "Generate SEO-optimized blog posts and marketing copy in seconds.",
        icon: PenTool,
        status: "active",
        href: "/console/copywriter",
        color: "text-orange-500",
        bgColor: "bg-orange-50"
    },
    {
        id: "lead-finder",
        title: "AI Lead Finder",
        description: "Find B2B leads with contact info from Google Maps in seconds.",
        icon: Search,
        status: "active",
        href: "/console/lead-finder",
        color: "text-purple-500",
        bgColor: "bg-purple-50"
    },

]
