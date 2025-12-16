"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, onSnapshot } from "firebase/firestore"

interface AuthContextType {
    user: User | null
    role: string | null
    enablePersonalShopper: boolean
    enableChatbot: boolean
    enableCopywriter: boolean
    enableLeadFinder: boolean
    enableVoiceAssistant?: boolean;
    canManageModules: boolean;
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

    useEffect(() => {
        console.log("AuthProvider: Mounting")
        let unsubscribeSnapshot: () => void | undefined;

        // Ensure persistence is set to LOCAL
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log("AuthProvider: Persistence set to LOCAL")
            })
            .catch((error) => {
                console.error("AuthProvider: Error setting persistence:", error)
            })


        // Safety timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.log("AuthProvider: Timeout triggered, forcing loading=false")
            setLoading(false)
        }, 5000)

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            console.log("AuthProvider: Auth state changed", currentUser?.uid)
            setUser(currentUser)

            // Unsubscribe from previous snapshot listener if exists
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = undefined;
            }

            if (currentUser) {
                try {
                    console.log("AuthProvider: Setting up snapshot listener")
                    const userDocRef = doc(db, "users", currentUser.uid);

                    unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            console.log("AuthProvider: User data updated", data.role);

                            if (currentUser.email === 'yasincelenkk@gmail.com') {
                                setRole('SUPER_ADMIN');
                            } else {
                                setRole(data.role);
                            }

                            setEnablePersonalShopper(data.enablePersonalShopper || false);
                            setEnableChatbot(data.enableChatbot ?? true);
                            setEnableCopywriter(data.enableCopywriter ?? true);
                            setEnableLeadFinder(data.enableLeadFinder ?? true);
                            setEnableLeadFinder(data.enableLeadFinder ?? true);
                            setEnableVoiceAssistant(data.enableVoiceAssistant ?? false);
                            setCanManageModules(data.canManageModules || false);
                        } else {
                            // Doc doesn't exist yet OR was deleted
                            console.warn("AuthProvider: No user doc found. Possible deleted tenant or registration lag.");

                            if (currentUser.email === 'yasincelenkk@gmail.com') {
                                // Super Admin might not have a doc initially, or it was deleted by mistake
                                // Allow access as Super Admin to fix things
                                setRole('SUPER_ADMIN');
                            } else {
                                // Regular user with no doc -> Deleted Tenant -> Force Logout
                                console.error("AuthProvider: Force logging out deleted tenant.");
                                auth.signOut();
                                setRole(null);
                                setLoading(false);
                                return;
                            }

                            setEnablePersonalShopper(false);
                            setEnableChatbot(true);
                            setEnableCopywriter(true);
                            setEnableLeadFinder(true);
                            setEnableLeadFinder(true);
                            setEnableVoiceAssistant(false);
                            setCanManageModules(false);
                        }
                        setLoading(false); // Ensure loading is false after data fetch
                    }, (error) => {
                        console.error("AuthProvider: Snapshot error:", error);
                        setLoading(false);
                    });

                } catch (error) {
                    console.error("AuthProvider: Error ensuring user doc:", error)
                    setLoading(false);
                }
            } else {
                setRole(null)
                setEnablePersonalShopper(false)
                setEnableChatbot(true)
                setEnableCopywriter(true)
                setEnableLeadFinder(true)
                setEnableLeadFinder(true)
                setEnableVoiceAssistant(false)
                setCanManageModules(false)
                setLoading(false)
            }
            console.log("AuthProvider: Clearing timeout")
            clearTimeout(timeoutId)
        })

        return () => {
            console.log("AuthProvider: Unmounting")
            unsubscribeAuth()
            if (unsubscribeSnapshot) unsubscribeSnapshot();
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
