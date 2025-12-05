"use client"

import { createContext, useContext, useEffect, useState } from "react"
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
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    enablePersonalShopper: false,
    enableChatbot: true,
    enableCopywriter: true,
    enableLeadFinder: true,
    loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [enablePersonalShopper, setEnablePersonalShopper] = useState(false)
    const [enableChatbot, setEnableChatbot] = useState(true)
    const [enableCopywriter, setEnableCopywriter] = useState(true)
    const [enableLeadFinder, setEnableLeadFinder] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("AuthProvider: Mounting")
        // Safety timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.log("AuthProvider: Timeout triggered, forcing loading=false")
            setLoading(false)
        }, 5000)

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("AuthProvider: Auth state changed", user?.uid)
            setUser(user)
            if (user) {
                try {
                    console.log("AuthProvider: Fetching user role")
                    const userDoc = await getDoc(doc(db, "users", user.uid))
                    if (userDoc.exists()) {
                        const data = userDoc.data()
                        console.log("AuthProvider: Role found", data.role)
                        setRole(data.role)
                        setEnablePersonalShopper(data.enablePersonalShopper || false)
                        setEnableChatbot(data.enableChatbot ?? true)
                        setEnableCopywriter(data.enableCopywriter ?? true)
                        setEnableLeadFinder(data.enableLeadFinder ?? true)
                    } else {
                        console.log("AuthProvider: No user doc found")
                        setRole(null)
                        setEnablePersonalShopper(false)
                        setEnableChatbot(true)
                        setEnableCopywriter(true)
                        setEnableLeadFinder(true)
                    }
                } catch (error) {
                    console.error("AuthProvider: Error fetching user role:", error)
                    setRole(null)
                    setEnablePersonalShopper(false)
                    setEnableChatbot(true)
                    setEnableCopywriter(true)
                    setEnableLeadFinder(true)
                }
            } else {
                setRole(null)
                setEnablePersonalShopper(false)
                setEnableChatbot(true)
                setEnableCopywriter(true)
                setEnableLeadFinder(true)
            }
            console.log("AuthProvider: Clearing timeout and setting loading=false")
            clearTimeout(timeoutId)
            setLoading(false)
        })

        return () => {
            console.log("AuthProvider: Unmounting")
            unsubscribe()
            clearTimeout(timeoutId)
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            role,
            enablePersonalShopper,
            enableChatbot,
            enableCopywriter,
            enableLeadFinder,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
