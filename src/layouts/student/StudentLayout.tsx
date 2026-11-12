import React from 'react'
import { Outlet } from 'react-router'
import StudentNavbar from './StudentNavbar'

interface StudentLayoutProps {
  children?: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <StudentNavbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children ?? <Outlet />}</main>
    </div>
  )
}