import Navbar from '@/layouts/lecture/LectureNavbar'
import React from 'react'
import { Outlet } from 'react-router'

interface LecturerLayoutProps {
  children?: React.ReactNode
}

export default function LecturerLayout({ children }: LecturerLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children ?? <Outlet />}</main>
    </div>
  )
}