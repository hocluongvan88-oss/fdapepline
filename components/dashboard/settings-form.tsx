'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import type { Profile, NotificationSettings } from '@/lib/types'
import {
  Building2,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
} from 'lucide-react'

export function SettingsForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [emailNotifications, setEmailNotifications] = useState({
    statusUpdates: true,
    documentRequests: true,
    expiryReminders: true,
  })
  const [reminderDays, setReminderDays] = useState(30)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        const p = profileData as Profile
        setProfile(p)
        setCompanyName(p.company_name || '')
        setFullName(p.full_name || '')
        setPhone(p.phone || '')
      }

      // Fetch notification settings
      const { data: settingsData } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settingsData) {
        const s = settingsData as NotificationSettings
        setNotificationSettings(s)
        setEmailNotifications({
          statusUpdates: s.email_service_updates,
          documentRequests: s.email_document_requests,
          expiryReminders: s.email_renewal_reminders,
        })
        setReminderDays(s.reminder_days_before)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  const saveProfile = async () => {
    if (!profile) return
    setIsSaving(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        company_name: companyName,
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)

    if (error) {
      console.error('[v0] Error saving profile:', error)
    }
    setIsSaving(false)
  }

  const saveNotificationSettings = async () => {
    if (!profile) return
    setIsSaving(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('notification_settings')
      .update({
        email_service_updates: emailNotifications.statusUpdates,
        email_document_requests: emailNotifications.documentRequests,
        email_renewal_reminders: emailNotifications.expiryReminders,
        reminder_days_before: reminderDays,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', profile.id)

    if (error) {
      console.error('[v0] Error saving notification settings:', error)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="company" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="company" className="gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Công ty</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Tài khoản</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Thông báo</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Bảo mật</span>
        </TabsTrigger>
      </TabsList>

      {/* Company Information */}
      <TabsContent value="company">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Thông tin Công ty</CardTitle>
            <CardDescription>
              Cập nhật thông tin công ty của bạn để sử dụng trong các dịch vụ đăng ký FDA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Tên công ty</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="pl-10 bg-secondary border-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="gap-2" onClick={saveProfile} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Thông tin Tài khoản</CardTitle>
            <CardDescription>
              Quản lý thông tin đăng nhập và liên hệ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-secondary border-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="accountEmail"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="pl-10 bg-secondary border-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Input
                value={
                  profile?.role === 'admin' ? 'Quản trị viên' : 
                  profile?.role === 'staff' ? 'Nhân viên' : 
                  'Khách hàng'
                }
                disabled
                className="bg-secondary border-0"
              />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="gap-2" onClick={saveProfile} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Cài đặt Thông báo</CardTitle>
            <CardDescription>
              Tùy chỉnh các loại thông báo bạn muốn nhận qua email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Cập nhật trạng thái</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo khi dịch vụ của bạn chuyển sang giai đoạn mới
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.statusUpdates}
                  onCheckedChange={(checked) =>
                    setEmailNotifications(prev => ({ ...prev, statusUpdates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Yêu cầu tài liệu</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo khi cần bổ sung tài liệu cho dịch vụ
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.documentRequests}
                  onCheckedChange={(checked) =>
                    setEmailNotifications(prev => ({ ...prev, documentRequests: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Nhắc nhở gia hạn</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo trước khi mã FDA hoặc US Agent hết hạn
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.expiryReminders}
                  onCheckedChange={(checked) =>
                    setEmailNotifications(prev => ({ ...prev, expiryReminders: checked }))
                  }
                />
              </div>

              <div className="p-4 rounded-lg bg-secondary">
                <div className="space-y-2">
                  <Label className="text-foreground">Số ngày nhắc nhở trước khi hết hạn</Label>
                  <Input
                    type="number"
                    value={reminderDays}
                    onChange={(e) => setReminderDays(parseInt(e.target.value) || 30)}
                    min={7}
                    max={90}
                    className="bg-input border-0 w-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Bạn sẽ nhận thông báo {reminderDays} ngày trước khi FDA/US Agent hết hạn
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="gap-2" onClick={saveNotificationSettings} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Bảo mật</CardTitle>
            <CardDescription>
              Quản lý mật khẩu và các tùy chọn bảo mật tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-secondary border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="bg-secondary border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-secondary border-0"
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Đổi mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
