"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, doc, updateDoc, getCountFromServer } from "firebase/firestore"
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
import { Loader2, Plus, Trash2, Users, Activity, MessageSquare, ShieldCheck, Search } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserData {
    id: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
}

export default function AdminPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    // Dashboard Stats
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeTenants: 0,
        totalChatbots: 0
    })

    // Add Tenant State
    const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)
    const [newTenantEmail, setNewTenantEmail] = useState("")
    const [newTenantPassword, setNewTenantPassword] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchDashboardData = async () => {
        try {
            // Fetch Users
            const usersSnapshot = await getDocs(collection(db, "users"))
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[]

            // Filter for tenants (excluding super admin if needed, but usually good to show all)
            // For stats, we might want to count only TENANT_ADMIN
            const tenants = usersData.filter(u => u.role === 'TENANT_ADMIN')
            const active = tenants.filter(u => u.isActive).length

            // Fetch Chatbots Count
            const chatbotsSnapshot = await getCountFromServer(collection(db, "chatbots"))

            setUsers(usersData)
            setStats({
                totalTenants: tenants.length,
                activeTenants: active,
                totalChatbots: chatbotsSnapshot.data().count
            })

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            toast({
                title: "Error",
                description: "Failed to load dashboard data.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, "users", userId), {
                isActive: !currentStatus
            })

            // Update local state
            const updatedUsers = users.map(u =>
                u.id === userId ? { ...u, isActive: !currentStatus } : u
            )
            setUsers(updatedUsers)

            // Update stats locally
            const tenants = updatedUsers.filter(u => u.role === 'TENANT_ADMIN')
            const active = tenants.filter(u => u.isActive).length
            setStats(prev => ({ ...prev, activeTenants: active }))

            toast({
                title: "Success",
                description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
            })
        } catch (error) {
            console.error("Error updating user:", error)
            toast({
                title: "Error",
                description: "Failed to update user status.",
                variant: "destructive",
            })
        }
    }

    const handleCreateTenant = async () => {
        if (!newTenantEmail || !newTenantPassword) {
            toast({
                title: "Error",
                description: "Please enter both email and password.",
                variant: "destructive",
            })
            return
        }

        setIsCreating(true)
        try {
            // Call our new API route to create user
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
                title: "Success",
                description: "Tenant created successfully.",
            })
            setIsAddTenantOpen(false)
            setNewTenantEmail("")
            setNewTenantPassword("")
            fetchDashboardData()
        } catch (error: any) {
            console.error("Error creating tenant:", error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteTenant = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this tenant? This will delete all their data (Chatbots, Knowledge Base, History). This action cannot be undone.")) return

        try {
            // Call our new API route to delete user data
            const response = await fetch("/api/admin/delete-tenant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to delete tenant data")
            }

            // Update local state
            const updatedUsers = users.filter(u => u.id !== userId)
            setUsers(updatedUsers)

            // Update stats locally
            const tenants = updatedUsers.filter(u => u.role === 'TENANT_ADMIN')
            const active = tenants.filter(u => u.isActive).length
            setStats(prev => ({ ...prev, totalTenants: tenants.length, activeTenants: active }))

            toast({
                title: "Success",
                description: "Tenant data deleted successfully. (Note: Auth user may still exist if not using Admin SDK)",
            })
        } catch (error: any) {
            console.error("Error deleting tenant:", error)
            toast({
                title: "Error",
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
        <div className="space-y-8">
            {/* Header & Stats */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
                        <p className="text-muted-foreground">Overview of system performance and tenant management.</p>
                    </div>
                    <Button onClick={() => setIsAddTenantOpen(true)} className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tenant
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTenants}</div>
                            <p className="text-xs text-muted-foreground">Registered tenant accounts</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activeTenants}</div>
                            <p className="text-xs text-muted-foreground">Currently active accounts</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Chatbots</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalChatbots}</div>
                            <p className="text-xs text-muted-foreground">Deployed across all tenants</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tenant Management */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Tenant Management</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Manage users, roles, and access.</p>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tenants..."
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
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
                                                {user.isActive ? 'Active' : 'Inactive'}
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
                                                        Manage
                                                    </Button>
                                                    <Button
                                                        variant={user.isActive ? "destructive" : "default"}
                                                        size="sm"
                                                        onClick={() => toggleStatus(user.id, user.isActive)}
                                                    >
                                                        {user.isActive ? "Deactivate" : "Activate"}
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
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add Tenant Dialog */}
            <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Tenant</DialogTitle>
                        <DialogDescription>
                            Create a new tenant account. They will be assigned the TENANT_ADMIN role.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={newTenantEmail} onChange={(e) => setNewTenantEmail(e.target.value)} placeholder="tenant@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={newTenantPassword} onChange={(e) => setNewTenantPassword(e.target.value)} placeholder="******" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTenant} disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Tenant
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
