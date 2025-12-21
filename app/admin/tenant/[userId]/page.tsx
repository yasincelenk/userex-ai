import { redirect } from "next/navigation"

export default function TenantDetailPage({ params }: { params: { userId: string } }) {
    // Redirect to the new tenant console dashboard
    redirect(`/admin/tenant/${params.userId}/chatbot`)
}
