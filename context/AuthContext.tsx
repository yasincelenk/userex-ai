"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface AuthContextType {
    user: User | null
    role: string | null
    enablePersonalShopper: boolean
    enableChatbot: boolean
    enableCopywriter: boolean
    enableLeadFinder: boolean
    enableVoiceAssistant?: boolean
    canManageModules: boolean
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    enablePersonalShopper: false,
    enableChatbot: true,
    enableCopywriter: true,
    enableLeadFinder: true,
    enableVoiceAssistant: false,
    canManageModules: false,
    loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [enablePersonalShopper, setEnablePersonalShopper] = useState(false)
    const [enableChatbot, setEnableChatbot] = useState(true)
    const [enableCopywriter, setEnableCopywriter] = useState(true)
    const [enableLeadFinder, setEnableLeadFinder] = useState(true)
    const [enableVoiceAssistant, setEnableVoiceAssistant] = useState(false)
    const [canManageModules, setCanManageModules] = useState(false)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        // Skip auth for public widget routes - they don't need user context
        if (pathname?.startsWith('/chatbot-view') || pathname?.startsWith('/widget-test')) {
            console.log("AuthProvider: Skipping auth for widget view")
            setLoading(false)
            return
        }

        console.log("AuthProvider: Setting up auth listener")

        // Subscribe to Firebase auth state changes
        // NO setPersistence here - Firebase uses browserLocalPersistence by default
        // setPersistence should ONLY be called in login page before signIn
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("AuthProvider: Auth State Changed. User:", currentUser?.uid)

            try {
                if (currentUser) {
                    // User is signed in - fetch additional data from Firestore
                    const userDocRef = doc(db, "users", currentUser.uid)

                    try {
                        const docSnap = await getDoc(userDocRef)

                        if (docSnap.exists()) {
                            const userData = docSnap.data()
                            let userRole = userData.role || 'user'

                            // Super admin override
                            if (currentUser.email === 'yasincelenkk@gmail.com') {
                                userRole = 'SUPER_ADMIN'
                            }

                            setUser(currentUser)
                            setRole(userRole)
                            setEnableChatbot(userData.enableChatbot !== false)
                            setEnablePersonalShopper(userData.enablePersonalShopper === true)
                            setEnableVoiceAssistant(userData.enableVoiceAssistant === true)
                            setCanManageModules(userData.canManageModules === true)
                        } else {
                            // User doc doesn't exist but Firebase user does
                            console.warn("AuthProvider: No user doc found. Defaulting to USER role.")
                            setUser(currentUser)
                            setRole('USER')
                        }
                    } catch (docErr) {
                        console.error("AuthProvider: Firestore error", docErr)
                        // Still set user even if Firestore fails
                        setUser(currentUser)
                        setRole('USER')
                    }
                } else {
                    // No user signed in
                    setUser(null)
                    setRole(null)
                }
            } catch (err) {
                console.error("AuthProvider: Critical error", err)
                setUser(null)
                setRole(null)
            } finally {
                setLoading(false)
            }
        })

        // Cleanup on unmount
        return () => {
            console.log("AuthProvider: Cleanup")
            unsubscribe()
        }
    }, []) // Empty dependency - run once on mount

    return (
        <AuthContext.Provider value={{
            user,
            role,
            enablePersonalShopper,
            enableChatbot,
            enableCopywriter,
            enableLeadFinder,
            enableVoiceAssistant,
            canManageModules,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
