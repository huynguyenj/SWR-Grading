
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'group w-full flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-orange text-white hover:bg-brand-rust active:bg-brand-wine',
        basic: 'border border-border-default text-text-secondary hover:bg-bg-muted',
      //   success: 'bg-green-accent text-white hover:bg-green-hover',
      //   outline: 'border bg-white text-secondary border-secondary hover:bg-blue/90 hover:text-black',
      //   basic: 'border bg-white text-black border-gray-300 hover:bg-gray-100',
        danger: 'border-[#FF5B5B]'

      },
      size: {
        basic: 'p-2',
        default: 'py-2.5',
        sm: 'py-2.7',
        lg: 'py-2.9'
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
