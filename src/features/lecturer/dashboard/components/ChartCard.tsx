import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export default function ChartCard({ title, description, children, className = '' }: ChartCardProps) {
  return (
    <div className={`rounded-lg border border-border-default bg-bg-primary p-5 ${className}`}>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}