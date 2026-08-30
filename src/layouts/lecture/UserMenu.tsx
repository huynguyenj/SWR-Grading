import { useState } from 'react'
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'

export default function UserMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-bg-muted transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-wine flex items-center justify-center text-xs font-medium text-white">
          GV
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-text-primary leading-tight">Nguyễn Văn A</p>
          <p className="text-xs text-text-muted leading-tight">Giảng viên</p>
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* dropdown */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 z-40 mt-2 w-52 rounded-md border border-border-default bg-bg-primary py-1.5 shadow-lg">
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors">
              <FiUser className="w-4 h-4" />
              Hồ sơ cá nhân
            </button>
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors">
              <FiSettings className="w-4 h-4" />
              Cài đặt
            </button>
            <div className="my-1 h-px bg-border-default" />
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors">
              <FiLogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </div>
  )
}