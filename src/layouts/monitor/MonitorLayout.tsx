import React from 'react'
import { Outlet } from 'react-router'
import Navbar from './MonitorNavbar'

interface MonitorLayoutProps {
  children?: React.ReactNode
}

export default function MonitorLayout({ children }: MonitorLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children ?? <Outlet />}</main>
    </div>
  )
}