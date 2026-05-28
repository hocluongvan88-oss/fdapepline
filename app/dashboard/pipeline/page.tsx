import { KanbanBoard } from '@/components/dashboard/kanban-board'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pipeline Dịch vụ</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý tiến độ các dịch vụ đăng ký FDA theo từng giai đoạn
        </p>
      </div>
      <KanbanBoard />
    </div>
  )
}
