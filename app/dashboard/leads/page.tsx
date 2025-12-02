"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Download, User, Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx';

interface Lead {
    id: string
    name: string
    email: string
    phone: string
    source: string
    createdAt: string
}

export default function LeadsPage() {
    const { user } = useAuth()
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLeads = async () => {
            if (!user) return
            try {
                const res = await fetch(`/api/leads?chatbotId=${user.uid}`)
                if (res.ok) {
                    const data = await res.json()
                    setLeads(data.leads || [])
                }
            } catch (error) {
                console.error("Failed to fetch leads", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeads()
    }, [user])

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(leads.map(l => ({
            Name: l.name,
            Email: l.email,
            Phone: l.phone,
            Source: l.source,
            Date: new Date(l.createdAt).toLocaleString()
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
        XLSX.writeFile(workbook, "leads_export.xlsx");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                    <p className="text-muted-foreground">
                        Manage and view potential customers captured by your chatbot.
                    </p>
                </div>
                <Button onClick={exportToExcel} disabled={leads.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Captured Leads</CardTitle>
                    <CardDescription>
                        List of users who provided their contact information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {leads.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No leads captured yet. Enable the "Pre-chat Form" in Branding settings to start collecting leads.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            {lead.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                {lead.email || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {lead.phone || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell>{lead.source}</TableCell>
                                        <TableCell className="text-right text-muted-foreground text-xs">
                                            {new Date(lead.createdAt).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
