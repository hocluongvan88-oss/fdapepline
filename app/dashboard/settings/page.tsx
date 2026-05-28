import { SettingsForm } from '@/components/dashboard/settings-form'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cài đặt</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin công ty, tài khoản và các tùy chọn hệ thống
        </p>
      </div>
      <SettingsForm />
    </div>
  )
}
