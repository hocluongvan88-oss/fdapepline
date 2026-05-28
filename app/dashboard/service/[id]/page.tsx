import { ServiceDetail } from '@/components/dashboard/service-detail'

interface ServicePageProps {
  params: Promise<{ id: string }>
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params
  return <ServiceDetail serviceId={id} />
}
