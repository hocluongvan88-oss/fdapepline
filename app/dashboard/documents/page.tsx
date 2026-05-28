import { DocumentsManager } from '@/components/dashboard/documents-manager'

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý Tài liệu</h1>
        <p className="text-muted-foreground">
          Xem, tải lên và tải xuống các tài liệu liên quan đến dịch vụ đăng ký FDA
        </p>
      </div>
      <DocumentsManager />
    </div>
  )
}
