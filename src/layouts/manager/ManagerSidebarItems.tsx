import useContextValid from '@/hooks/useValidContext'
import { NavLink } from 'react-router'
import type { NavItem } from '../admin/constants/Nav.config'
import ManagerSidebarContext from './context/ManagerSidebarContext'

interface SidebarNavItemProps {
  item: NavItem
}

export default function ManagerSidebarNavItem({ item }: SidebarNavItemProps) {
  const { collapsed, closeMobile } = useContextValid(ManagerSidebarContext)
  const Icon = item.icon

  return (
    <NavLink
      to={item.href}
      end={item.href === '/manager'}
      onClick={closeMobile}
      className={({ isActive }) =>
        [
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          collapsed ? 'justify-center' : '',
          isActive
            ? 'bg-brand-orange/10 text-brand-orange'
            : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary',
        ].join(' ')
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {/* active indicator bar */}
          <span
            className={[
              'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-brand-orange transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
          <Icon className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
          {!collapsed && item.badge != null && (
            <span className="ml-auto flex items-center justify-center rounded-full bg-brand-orange px-1.5 py-0.5 text-[11px] font-semibold text-white min-w-4.5">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}