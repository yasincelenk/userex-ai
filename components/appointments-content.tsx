"use client"

import { useEffect, useState } from "react"
import { collection, query, where, doc, updateDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Mail, Phone, CheckCircle2, XCircle, Clock3 } from "lucide-react"
import { format } from "date-fns"
import { tr, enUS } from 'date-fns/locale'
import { useToast } from "@/hooks/use-toast"

interface Appointment {
    id: string
    customerName: string
    customerEmail: string
    customerPhone: string
    date: string
    time: string
    type: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    notes?: string
    createdAt: any
}

interface AppointmentsContentProps {
    targetUserId?: string
}

export function AppointmentsContent({ targetUserId }: AppointmentsContentProps) {
    const { user } = useAuth()
    const { t, language } = useLanguage()
    const { toast } = useToast()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Use targetUserId if provided, otherwise use current user's uid
    const effectiveUserId = targetUserId || user?.uid

    useEffect(() => {
        if (!effectiveUserId) return

        const q = query(collection(db, "appointments"), where("chatbotId", "==", effectiveUserId))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Appointment[]

            // Sort by date and time
            data.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`)
                const dateB = new Date(`${b.date}T${b.time}`)
                return dateB.getTime() - dateA.getTime()
            })

            setAppointments(data)
            setIsLoading(false)
        }, (error) => {
            console.error("Error fetching appointments:", error)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [effectiveUserId])

    const updateStatus = async (id: string, newStatus: Appointment['status']) => {
        try {
            await updateDoc(doc(db, "appointments", id), {
                status: newStatus
            })
            toast({
                title: t('success') || "Success",
                description: t('statusUpdated') || "Appointment status updated successfully.",
            })
        } catch (error) {
            console.error("Error updating status:", error)
            toast({
                title: t('error') || "Error",
                description: t('statusUpdateFailed') || "Failed to update status.",
                variant: "destructive"
            })
        }
    }

    const getStatusBadge = (status: Appointment['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('confirmed') || "Confirmed"}</Badge>
            case 'cancelled':
                return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><XCircle className="w-3 h-3 mr-1" /> {t('cancelled') || "Cancelled"}</Badge>
            case 'completed':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('completed') || "Completed"}</Badge>
            default:
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200"><Clock3 className="w-3 h-3 mr-1" /> {t('pending') || "Pending"}</Badge>
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('appointments') || "Appointments"}</h2>
                <p className="text-muted-foreground">{t('manageAppointmentsDesc') || "View and manage your customer bookings."}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('upcomingAppointments') || "Upcoming Appointments"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">Loading...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>{t('noAppointmentsYet') || "No appointments booked yet."}</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('customer') || "Customer"}</TableHead>
                                        <TableHead>{t('dateTime') || "Date & Time"}</TableHead>
                                        <TableHead>{t('type') || "Type"}</TableHead>
                                        <TableHead>{t('status') || "Status"}</TableHead>
                                        <TableHead className="text-right">{t('actions') || "Actions"}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((appt) => (
                                        <TableRow key={appt.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{appt.customerName}</span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Mail className="w-3 h-3" /> {appt.customerEmail}
                                                    </div>
                                                    {appt.customerPhone && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Phone className="w-3 h-3" /> {appt.customerPhone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                                        {format(new Date(appt.date), 'dd MMMM yyyy', { locale: language === 'tr' ? tr : enUS })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        {appt.time}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{appt.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(appt.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {appt.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => updateStatus(appt.id, 'confirmed')}
                                                        >
                                                            {t('confirm') || "Confirm"}
                                                        </Button>
                                                    )}
                                                    {appt.status === 'confirmed' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => updateStatus(appt.id, 'completed')}
                                                        >
                                                            {t('complete') || "Complete"}
                                                        </Button>
                                                    )}
                                                    {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => updateStatus(appt.id, 'cancelled')}
                                                        >
                                                            {t('cancel') || "Cancel"}
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
