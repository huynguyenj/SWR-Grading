
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const inputVariants = cva(
  'w-full rounded-md border border-border-default text-sm text-text-primar placeholder:text-text-muted outline-none transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-bg-primary focus:ring-2 focus:ring-brand-orange/15 focus:border-brand-orange',
      //   success: 'bg-green-accent text-white hover:bg-green-hover',
      //   outline: 'border bg-white text-secondary border-secondary hover:bg-blue/90 hover:text-black',
      //   basic: 'border bg-white text-black border-gray-300 hover:bg-gray-100',
        danger: 'border-[#FF5B5B]'

      },
      size: {
        default: 'pl-10 pr-10 py-2.5',
        sm: 'pl-11 pr-11 py-2.7',
        lg: 'pl-13 pr-13 py-2.9',
        basic: 'px-3 py-2'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> & VariantProps<typeof inputVariants> & {
    icon?: React.ComponentType<{ className?:string }>
    error?: string
  }

export default function Input({ className, variant = 'default', size = 'default', icon: Icon, type = 'text', error,  ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className='relative'>
      { Icon && <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted'/> }
      { type != 'password' && 
      <input  
        className={cn(inputVariants({variant, size}), className)}
        {...props}
      />
      }
      { type === 'password' &&
        <>
            <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(inputVariants({variant, size}), className)}
                  {...props}
            />
        
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                              {showPassword ? (
                                <FiEyeOff className="w-4 h-4" />
                              ) : (
                                <FiEye className="w-4 h-4" />
                              )}
                            </button>
        </> 
      }
      { error && <span className='text-xs text-danger'>{error}</span>  }
    </div>
  )
}
