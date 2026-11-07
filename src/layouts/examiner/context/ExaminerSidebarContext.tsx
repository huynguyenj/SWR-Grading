import React, { createContext, useState, useCallback } from 'react'

interface SidebarContextValue {
  collapsed: boolean
  toggleCollapsed: () => void
  mobileOpen: boolean
  openMobile: () => void
  closeMobile: () => void
}

const ExaminerSidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function ExaminerSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <ExaminerSidebarContext.Provider
      value={{ collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile }}
    >
      {children}
    </ExaminerSidebarContext.Provider>
  )
}

export default ExaminerSidebarContext

