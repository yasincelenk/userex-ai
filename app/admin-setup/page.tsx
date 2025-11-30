"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"

export default function AdminSetupPage() {
    const { user } = useAuth()
    const [status, setStatus] = useState("")

    const makeMeSuperAdmin = async () => {
        if (!user) return
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: "SUPER_ADMIN",
                createdAt: new Date().toISOString(),
                isActive: true
            }, { merge: true })
            setStatus("Success! You are now a Super Admin.")
        } catch (e: any) {
            setStatus("Error: " + e.message)
        }
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
            <p className="mb-4">Current User: {user?.email}</p>
            <Button onClick={makeMeSuperAdmin}>Make Me Super Admin</Button>
            {status && <p className="mt-4">{status}</p>}
        </div>
    )
}
