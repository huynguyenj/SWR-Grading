import useContextValid from '@/hooks/useValidContext'
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi'
import Input from '@/components/ui/input'
import SidebarContext from './context/AdminSidebarContext'

interface TopbarProps {
  title?: string
}

export default function Topbar({ title }: TopbarProps) {
  const { openMobile } = useContextValid(SidebarContext)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border-default bg-bg-primary/80 backdrop-blur px-4 sm:px-6">
      <button
        onClick={openMobile}
        className="lg:hidden text-text-secondary hover:text-text-primary"
        aria-label="Mở menu"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="text-base font-semibold text-text-primary shrink-0">{title}</h1>
      )}

      {/* Search */}
      <div className="relative hidden sm:block flex-1 max-w-sm ml-2">
        <Input type='text' placeholder='Tìm kiếm' icon={FiSearch}/>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="relative text-text-secondary hover:text-text-primary"
          aria-label="Thông báo"
        >
          <FiBell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-bg-primary" />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-wine flex items-center justify-center text-xs font-medium text-white cursor-pointer">
          A
        </div>
      </div>
    </header>
  )
}