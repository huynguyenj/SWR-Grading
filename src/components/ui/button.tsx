
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'group flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-brand-orange text-white hover:bg-brand-rust active:bg-brand-wine',
        basic: 'border border-border-default text-text-secondary hover:bg-bg-muted',
      //   success: 'bg-green-accent text-white hover:bg-green-hover',
      //   outline: 'border bg-white text-secondary border-secondary hover:bg-blue/90 hover:text-black',
      //   basic: 'border bg-white text-black border-gray-300 hover:bg-gray-100',
        danger: 'bg-[#FF5B5B] text-text-on-brand'

      },
      size: {
        basic: 'p-2',
        default: 'py-2 px-3',
        sm: 'py-2 px-4',
        lg: 'py-2.5 px-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)


export default function Button({ className, variant = 'default', size = 'default',  ...props }: 
      React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({variant, size}), className)} {...props}/>
  )
}
