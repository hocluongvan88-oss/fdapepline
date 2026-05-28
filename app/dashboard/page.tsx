import { DashboardOverview } from '@/components/dashboard/overview'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Theo dõi tiến độ đăng ký FDA và quản lý dịch vụ của bạn
        </p>
      </div>
      <DashboardOverview />
    </div>
  )
}
