import { cn } from "@/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

const textAreaVariants = cva('w-full rounded-md border border-border-default text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none', 
      {
            variants: {
                  variant: {
                        default: 'bg-bg-bg-primary'
                  },
                  size: {
                        default: 'px-3 py-2'
                  }
            },
            defaultVariants: {
                  variant: 'default',
                  size: 'default'
            }
      })
type TextAreaType = ComponentProps<'textarea'> & VariantProps<typeof textAreaVariants>
export default function TextArea({ variant='default', size='default', className, ...props }: TextAreaType) {
  return (
    <textarea className={cn(textAreaVariants({ variant, size }), className)} {...props}></textarea>
  )
}
