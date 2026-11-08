import React, { createContext, useState, useCallback } from 'react'

interface SidebarContextValue {
  collapsed: boolean
  toggleCollapsed: () => void
  mobileOpen: boolean
  openMobile: () => void
  closeMobile: () => void
}

const ManagerSidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function ManagerSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <ManagerSidebarContext.Provider
      value={{ collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile }}
    >
      {children}
    </ManagerSidebarContext.Provider>
  )
}

export default ManagerSidebarContext

