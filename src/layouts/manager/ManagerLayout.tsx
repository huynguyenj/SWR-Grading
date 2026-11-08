import useContextValid from '@/hooks/useValidContext'
import React from 'react'
import { Outlet } from 'react-router'
import ManagerSidebar from './ManagerSidebar'
import ManagerTopbar from './ManagerTopbar'
import ManagerSidebarContext, { ManagerSidebarProvider } from './context/ManagerSidebarContext'

interface ManagerLayoutProps {
  title?: string
  children?: React.ReactNode
}

function ManagerLayoutContent({ title, children }: ManagerLayoutProps) {
  const { collapsed } = useContextValid(ManagerSidebarContext)

  return (
    <div className="min-h-screen bg-bg-primary">
      <ManagerSidebar />

      <div
        className={[
          'flex flex-col min-h-screen transition-all duration-200',
          collapsed ? 'lg:pl-19' : 'lg:pl-64',
        ].join(' ')}
      >
        <ManagerTopbar title={title} />
        <main className="flex-1 p-4 sm:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}

export default function ManagerLayout(props: ManagerLayoutProps) {
  return (
    <ManagerSidebarProvider>
      <ManagerLayoutContent {...props} />
    </ManagerSidebarProvider>
  )
}