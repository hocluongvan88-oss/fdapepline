import { NotificationsList } from '@/components/dashboard/notifications-list'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Thông báo</h1>
        <p className="text-muted-foreground">
          Quản lý các thông báo và cảnh báo từ hệ thống
        </p>
      </div>
      <NotificationsList />
    </div>
  )
}
