import useContextValid from '@/hooks/useValidContext'
import React from 'react'
import SidebarContext, { SidebarProvider } from './context/AdminSidebarContext'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router'
import Topbar from './AdminTopbar'

interface AdminLayoutProps {
  title?: string
  children?: React.ReactNode
}

function AdminLayoutContent({ title, children }: AdminLayoutProps) {
  const { collapsed } = useContextValid(SidebarContext)

  return (
    <div className="min-h-screen bg-bg-primary">
      <AdminSidebar />

      <div
        className={[
          'flex flex-col min-h-screen transition-all duration-200',
          collapsed ? 'lg:pl-19' : 'lg:pl-64',
        ].join(' ')}
      >
        <Topbar title={title} />
        <main className="flex-1 p-4 sm:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminLayoutContent {...props} />
    </SidebarProvider>
  )
}