import { cn } from "@/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  {
      variants: {
         variant: {
            default: 'bg-bg-muted text-text-secondary',
            danger: 'bg-brand-rust/10 text-brand-rust',
            success: 'bg-success/10 text-success',
         },
         size: {
            default: 'px-2.5 py-1',
            sm: 'px-2 py-1',
            md: 'px-3 py-1.5',
            xl: 'px-5 py-2'
         }
      },
      defaultVariants: {
            variant: 'default',
            size: 'default'
      }
  }
)

type BadgeType = {
      content: string
} & VariantProps<typeof badgeVariants> & ComponentProps<'span'>

export default function Badge({ content, size='default', variant='default', className }: BadgeType) {
  return (
    <span
      className={cn(badgeVariants({ variant, size}), className )}
    >
      {content}
    </span>
  )
}
