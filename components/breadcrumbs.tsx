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
    const segments = pathname.split("/").filter((segment) => segment !== "")

    // Don't show breadcrumbs on the home page
    if (pathname === "/") return null

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, index) => {
                    // Skip "dashboard" since we added it manually as the root
                    if (segment === "dashboard") return null

                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1
                    const title = segment.charAt(0).toUpperCase() + segment.slice(1)

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
