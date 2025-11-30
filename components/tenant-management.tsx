"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
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
import { Loader2, Plus, Trash2, ShieldCheck, Search } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"

interface UserData {
    id: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
}

export function TenantManagement() {
    const [users, setUsers] = useState<UserData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()
    const { t } = useLanguage()

    // Add Tenant State
    const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)
    const [newTenantEmail, setNewTenantEmail] = useState("")
    const [newTenantPassword, setNewTenantPassword] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"))
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[]
            setUsers(usersData)
        } catch (error) {
            console.error("Error fetching users:", error)
            toast({
                title: t('error'),
                description: t('failedToLoadUsers'),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, "users", userId), {
                isActive: !currentStatus
            })

            const updatedUsers = users.map(u =>
                u.id === userId ? { ...u, isActive: !currentStatus } : u
            )
            setUsers(updatedUsers)

            toast({
                title: t('success'),
                description: t('userStatusUpdated'),
            })
        } catch (error) {
            console.error("Error updating user:", error)
            toast({
                title: t('error'),
                description: t('failedToUpdateUserStatus'),
                variant: "destructive",
            })
        }
    }

    const handleCreateTenant = async () => {
        if (!newTenantEmail || !newTenantPassword) {
            toast({
                title: t('error'),
                description: t('enterEmailPassword'),
                variant: "destructive",
            })
            return
        }

        setIsCreating(true)
        try {
            const response = await fetch("/api/admin/create-tenant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newTenantEmail, password: newTenantPassword })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to create tenant")
            }

            toast({
                title: t('success'),
                description: t('tenantCreated'),
            })
            setIsAddTenantOpen(false)
            setNewTenantEmail("")
            setNewTenantPassword("")
            fetchUsers()
        } catch (error: any) {
            console.error("Error creating tenant:", error)
            toast({
                title: t('error'),
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteTenant = async (userId: string) => {
        if (!confirm(t('deleteTenantConfirm'))) return

        try {
            const response = await fetch("/api/admin/delete-tenant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to delete tenant data")
            }

            const updatedUsers = users.filter(u => u.id !== userId)
            setUsers(updatedUsers)

            toast({
                title: t('success'),
                description: t('tenantDeleted'),
            })
        } catch (error: any) {
            console.error("Error deleting tenant:", error)
            toast({
                title: t('error'),
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('tenants')}</h2>
                    <p className="text-muted-foreground">{t('manageTenantsDescription')}</p>
                </div>
                <Button onClick={() => setIsAddTenantOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('addTenant')}
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('allTenants')}</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('searchTenants')}
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('email')}</TableHead>
                                    <TableHead>{t('role')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('createdAt')}</TableHead>
                                    <TableHead className="text-right">{t('actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                                    {user.email.substring(0, 2).toUpperCase()}
                                                </div>
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
                                                {user.role === 'SUPER_ADMIN' ? <ShieldCheck className="w-3 h-3 mr-1" /> : null}
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? 'outline' : 'destructive'} className={user.isActive ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                                {user.isActive ? t('active') : t('inactive')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {user.role !== 'SUPER_ADMIN' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.location.href = `/admin/tenant/${user.id}`}
                                                    >
                                                        {t('manage')}
                                                    </Button>
                                                    <Button
                                                        variant={user.isActive ? "destructive" : "default"}
                                                        size="sm"
                                                        onClick={() => toggleStatus(user.id, user.isActive)}
                                                    >
                                                        {user.isActive ? t('deactivate') : t('activate')}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteTenant(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            {t('noResults')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('addNewTenant')}</DialogTitle>
                        <DialogDescription>
                            {t('addNewTenantDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" type="email" value={newTenantEmail} onChange={(e) => setNewTenantEmail(e.target.value)} placeholder="tenant@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('password')}</Label>
                            <Input id="password" type="password" value={newTenantPassword} onChange={(e) => setNewTenantPassword(e.target.value)} placeholder="******" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>{t('cancel')}</Button>
                        <Button onClick={handleCreateTenant} disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('createTenant')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
