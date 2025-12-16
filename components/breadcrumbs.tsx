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

import { useLanguage } from "@/context/LanguageContext"

export function Breadcrumbs() {
    const pathname = usePathname()
    const { t } = useLanguage()
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

                    // Special case: Inject "Modules" before "shopper"
                    const showModulesLink = segment === "shopper" || segment === "copywriter" || segment === "lead-finder"

                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1

                    // Better labels for common routes
                    const labelMap: Record<string, string> = {
                        "chatbot": "AI Chatbot",
                        "shopper": "AI Personal Shopper",
                        "copywriter": "AI Copywriter",
                        "analytics": "Analytics",
                        "knowledge": t('knowledgeBase'),
                        "branding": t('branding'),
                        "integration": "Integrations",
                        "chats": t('chats'),
                        "leads": t('leads'),
                        "tenants": t('tenants'),
                        "admin": t('tenants'), // Map /admin to Tenants
                        "profile": t('profile'),
                        "widget": "Widget",
                        "catalog": t('productCatalog'),
                        "settings": t('settings'),
                        "modules": t('modules') || "Modules"
                    }

                    const title = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

                    return (
                        <React.Fragment key={href}>
                            {showModulesLink && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/console/modules">{t('modules') || "Modules"}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
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
