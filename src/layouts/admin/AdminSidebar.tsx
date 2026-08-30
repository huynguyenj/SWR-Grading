import useContextValid from '@/hooks/useValidContext'
import { FiChevronsLeft, FiChevronsRight, FiLogOut, FiX } from 'react-icons/fi'
import SidebarContext from './context/AdminSidebarContext'
import { navSections } from './constants/Nav.config'
import SidebarNavItem from './AdminSidebarItems'
import FPTLogo from '@/assets/fptulogo.jpg'
export default function AdminSidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useContextValid(SidebarContext)

  return (
    <>
      {/* Backdrop cho mobile drawer */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-bg-primary border-r border-border-default transition-all duration-200',
          collapsed ? 'lg:w-19' : 'lg:w-64',
          mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo + close (mobile) */}
        <div className="flex h-16 shrink-0 items-center justify-between bg-brand-orange px-4 border-b border-border-default">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-md shrink-0">
              <img src={FPTLogo} alt="fptlogo" className='w-full aspect-square rounded-full'/>
            </div>
            {!collapsed && (
              <span className="text-base font-semibold text-text-on-brand tracking-tight truncate">
                FPT University
              </span>
            )}
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden text-text-muted hover:text-text-primary"
            aria-label="Đóng menu"
          >
            <FiX className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarNavItem key={item.href} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: user + logout */}
        <div className="shrink-0 border-t border-border-default p-3">
          <div
            className={[
              'flex items-center gap-2.5 rounded-md px-2 py-2',
              collapsed ? 'justify-center' : '',
            ].join(' ')}
          >
            <div className="w-8 h-8 rounded-full bg-brand-wine shrink-0 flex items-center justify-center text-xs font-medium text-white">
              A
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">Admin</p>
                <p className="text-xs text-text-muted truncate">admin@omnichat.io</p>
              </div>
            )}
            {!collapsed && (
              <button
                className="text-text-muted hover:text-danger shrink-0"
                aria-label="Đăng xuất"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex items-center justify-center gap-2 w-full mt-2 rounded-md py-2 text-xs font-medium text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
          >
            {collapsed ? <FiChevronsRight className="w-4 h-4" /> : <FiChevronsLeft className="w-4 h-4" />}
            {!collapsed && 'Thu gọn'}
          </button>
        </div>
      </aside>
    </>
  )
}