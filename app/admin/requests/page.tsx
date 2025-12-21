"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"

interface ModuleRequest {
    id: string
    userId: string
    userEmail: string
    moduleKey: string
    moduleName: string
    status: 'pending' | 'approved' | 'rejected'
    requestedAt: any
}

export default function AdminRequestsPage() {
    const { t } = useLanguage()
    const [requests, setRequests] = useState<ModuleRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    const fetchRequests = async () => {
        setIsLoading(true)
        try {
            const q = query(collection(db, "module_requests"), where("status", "==", "pending"))
            const querySnapshot = await getDocs(q)
            const requestsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ModuleRequest[]

            // Sort by date manually since we didn't add an index yet
            requestsData.sort((a, b) => b.requestedAt?.seconds - a.requestedAt?.seconds)

            setRequests(requestsData)
        } catch (error) {
            console.error("Error fetching requests:", error)
            toast({
                title: "Error",
                description: "Failed to load requests.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleApprove = async (request: ModuleRequest) => {
        try {
            // 1. Update Request Status
            await updateDoc(doc(db, "module_requests", request.id), {
                status: 'approved',
                processedAt: new Date()
            })

            // 2. Update User Profile (for enable* flags)
            const userRef = doc(db, "users", request.userId)
            const enableKey = `enable${request.moduleKey.charAt(0).toUpperCase() + request.moduleKey.slice(1)}` // e.g. enableVoiceAssistant
            // Also ensure it's visible
            const visibleKey = `visible${request.moduleKey.charAt(0).toUpperCase() + request.moduleKey.slice(1)}`

            await updateDoc(userRef, {
                [enableKey]: true,
                [visibleKey]: true
            })

            // 3. Update Chatbot Document (if exists, same flags often mirrored)
            // Note: In some architectures, flags are only on user profile. 
            // Checking implementation: flags seem to be primarily on User profile in AuthContext.
            // But we might want to update chatbot doc too if it stores config.
            // For now, User profile is the Single Source of Truth for access.

            toast({
                title: "Success",
                description: `Request for ${request.moduleName} approved.`,
            })

            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== request.id))

        } catch (error) {
            console.error("Error approving request:", error)
            toast({
                title: "Error",
                description: "Failed to approve request.",
                variant: "destructive",
            })
        }
    }

    const handleReject = async (request: ModuleRequest) => {
        try {
            await updateDoc(doc(db, "module_requests", request.id), {
                status: 'rejected',
                processedAt: new Date()
            })

            toast({
                title: "Rejected",
                description: "Request has been denied.",
            })

            setRequests(prev => prev.filter(r => r.id !== request.id))
        } catch (error) {
            console.error("Error rejecting request:", error)
            toast({
                title: "Error",
                description: "Failed to reject request.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('moduleRequests') || "Module Requests"}</h2>
                <p className="text-muted-foreground">{t('moduleRequestsDesc') || "Manage user requests for premium modules."}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('pendingRequests') || "Pending Requests"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Module</TableHead>
                                    <TableHead>Requested</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{request.userEmail}</span>
                                                <span className="text-xs text-muted-foreground">{request.userId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-indigo-500 border-indigo-200 bg-indigo-50">
                                                {request.moduleName || request.moduleKey}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-muted-foreground text-sm">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {request.requestedAt?.toDate().toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApprove(request)}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleReject(request)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Deny
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {requests.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No pending requests found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
