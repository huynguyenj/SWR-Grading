import type { IconType } from 'react-icons'
import Button from '@/components/ui/button'

interface DocumentCardProps {
  icon: IconType
  title: string
  description: string
  buttonLabel: string
  onView: () => void
  disabled?: boolean
}

export default function DocumentCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onView,
  disabled,
}: DocumentCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border-default bg-bg-primary p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          <p className="mt-0.5 truncate text-xs text-text-muted">{description}</p>
        </div>
      </div>
      <Button onClick={onView} disabled={disabled} variant="basic" className="shrink-0">
        {buttonLabel}
      </Button>
    </div>
  )
}