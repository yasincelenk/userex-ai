import TenantDetailClient from "./tenant-detail-client"

export default function TenantDetailPage({ params }: { params: { userId: string } }) {
    return <TenantDetailClient userId={params.userId} />
}
