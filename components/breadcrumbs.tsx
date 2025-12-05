"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

export function Breadcrumbs() {
    const pathname = usePathname()
    const segments = (pathname || "").split("/").filter((segment) => segment !== "")

    // Don't show breadcrumbs on the home page or platform page
    if (pathname === "/" || pathname === "/platform") return null

    // Segments to skip in breadcrumbs (they are redundant in the UI)
    const skipSegments = ["console", "dashboard", "platform"]

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/platform">Platform</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, index) => {
                    // Skip redundant segments
                    if (skipSegments.includes(segment)) return null

                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1

                    // Better labels for common routes
                    const labelMap: Record<string, string> = {
                        "chatbot": "AI Chatbot",
                        "shopper": "AI Personal Shopper",
                        "copywriter": "AI Copywriter",
                        "analytics": "Analytics",
                        "knowledge": "Knowledge Base",
                        "branding": "Branding",
                        "integration": "Integrations",
                        "chats": "Chats",
                        "leads": "Leads",
                        "tenants": "Tenants",
                        "profile": "Profile",
                        "widget": "Widget",
                        "catalog": "Catalog",
                        "settings": "Settings"
                    }

                    const title = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
