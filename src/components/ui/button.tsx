
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
    'group flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                default:
                    'bg-brand-orange text-white hover:bg-brand-rust active:bg-brand-wine disabled:bg-bg-muted disabled:text-text-muted',

                basic:
                    'border border-border-default text-text-secondary hover:bg-bg-muted disabled:border-border-default disabled:bg-bg-muted/50 disabled:text-text-muted',

                brand:
                    'border border-brand-orange/30 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 active:bg-brand-orange/30 disabled:border-border-default disabled:bg-bg-muted/50 disabled:text-text-muted',

                success:
                    'border border-success/30 bg-success/10 text-success hover:bg-success/20 active:bg-success/30 disabled:border-border-default disabled:bg-bg-muted/50 disabled:text-text-muted',

                danger:
                    'bg-[#FF5B5B] text-text-on-brand hover:bg-[#E94B4B] active:bg-[#D93D3D] disabled:bg-[#FF5B5B]/35 disabled:text-white/70',
            },

            size: {
                basic: 'p-2',
                default: 'px-3 py-2',
                sm: 'px-4 py-2',
                lg: 'px-6 py-2.5',
            },
        },

        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

interface ButtonProps
    extends React.ComponentProps<'button'>,
        VariantProps<typeof buttonVariants> {}

export default function Button({
    className,
    variant = 'default',
    size = 'default',
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                buttonVariants({ variant, size }),
                className
            )}
            {...props}
        />
    )
}
