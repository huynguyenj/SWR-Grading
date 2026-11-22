import useContextValid from '@/hooks/useValidContext'
import React from 'react'
import { Outlet } from 'react-router'
import ExaminerSidebarContext, { ExaminerSidebarProvider } from './context/ExaminerSidebarContext'
import ExaminerSidebar from './ExaminerSidebar'
import ExaminerTopbar from './ExaminerTopbar'

interface ExaminerLayoutProps {
  title?: string
  children?: React.ReactNode
}

function ExaminerLayoutContent({ title, children }: ExaminerLayoutProps) {
  const { collapsed } = useContextValid(ExaminerSidebarContext)

  return (
    <div className="min-h-screen bg-bg-primary">
      <ExaminerSidebar />

      <div
        className={[
          'flex flex-col min-h-screen transition-all duration-200',
          collapsed ? 'lg:pl-19' : 'lg:pl-64',
        ].join(' ')}
      >
        <ExaminerTopbar title={title} />
        <main className="flex-1 p-4 sm:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}

export default function ExaminerLayout(props: ExaminerLayoutProps) {
  return (
    <ExaminerSidebarProvider>
      <ExaminerLayoutContent {...props} />
    </ExaminerSidebarProvider>
  )
}