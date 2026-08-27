import { useState } from 'react'
import {  FiMenu, FiX, FiBell } from 'react-icons/fi'
import UserMenu from '@/layouts/lecture/UserMenu'
import { lecturerNavItems } from './constant/lecture.config'
import { NavLink } from 'react-router'
import FptLogo from '@/assets/fptulogo.jpg'
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border-default bg-bg-primary/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-brand-orange">
            <img src={FptLogo} alt="fpt logo" className='w-[90%] aspect-square rounded-sm' />
          </div>
          <span className="hidden sm:block text-base font-semibold text-text-primary tracking-tight">
            FPT University
          </span>
        </div>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {lecturerNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/lecture'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            className="relative text-text-secondary hover:text-text-primary"
            aria-label="Thông báo"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-bg-primary" />
          </button>

          <UserMenu />

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden text-text-secondary hover:text-text-primary"
            aria-label="Mở menu"
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Nav links — mobile dropdown */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border-default bg-bg-primary px-4 py-3 space-y-1">
          {lecturerNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/lecturer'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      )}
    </header>
  )
}