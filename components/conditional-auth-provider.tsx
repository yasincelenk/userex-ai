"use client"

import { usePathname } from "next/navigation"
import dynamic from 'next/dynamic'

// Dynamically import AuthProvider so that firebase/auth is NOT initialized 
// when visiting public widget routes.
const AuthProvider = dynamic(
    () => import('@/context/AuthContext').then((mod) => mod.AuthProvider),
    { ssr: false }
)

// Public routes that should NOT use AuthProvider to prevent session conflicts
const PUBLIC_WIDGET_ROUTES = ['/chatbot-view', '/widget-test', '/test-widget']

export function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Check if current path is a public widget route
    const isPublicWidgetRoute = PUBLIC_WIDGET_ROUTES.some(route => pathname?.startsWith(route))

    if (isPublicWidgetRoute) {
        // Skip AuthProvider entirely for widget routes
        // This prevents any Firebase auth operations that could affect the main session
        return <>{children}</>
    }

    // Normal routes get AuthProvider
    return <AuthProvider>{children}</AuthProvider>
}
