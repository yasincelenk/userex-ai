"use client"

import { AppointmentsContent } from "@/components/appointments-content"

export default function AdminTenantAppointmentsPage({ params }: { params: { userId: string } }) {
    return <AppointmentsContent targetUserId={params.userId} />
}
