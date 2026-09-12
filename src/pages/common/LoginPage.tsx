import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import FPTLogo from '@/assets/fptulogo.jpg'
import Input from '@/components/ui/input'
import useLogin from '@/features/authentication/hooks/useLogin'
export default function LoginPage() {
 const { handleSubmit, onSubmit, register, loading } = useLogin()
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-bg-primary">
      {/* ============ LEFT — Branding panel ============ */}
      <div className="hidden lg:flex lg:col-span-2 relative flex-col justify-between bg-brand-maroon p-12 overflow-hidden">
        {/* subtle background accent shapes */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-wine/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-px bg-white/10" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-12 h-12 rounded-md">
            <img src={FPTLogo} alt="Fpt logo" className='rounded-full w-12 aspect-square'/>
          </div>
          <span className="text-2xl font-semibold text-white tracking-tight">FPT University</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="text-2xl font-medium text-white leading-snug">
            Nơi quản lí kì thi và các tài liệu 1 cách nhanh chóng, an toàn dành cho tập thể giáo viên.
          </p>
          <p className="mt-4 text-sm text-white/60 leading-relaxed">
            Quản lí hiệu quả và hỗ trợ việc chấm bài thi 1 cách nhanh chóng bằng AI.
          </p>

          {/* <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['A', 'H', 'M'].map((initial) => (
                <div
                  key={initial}
                  className="w-8 h-8 rounded-full bg-brand-rust ring-2 ring-brand-maroon flex items-center justify-center text-xs font-medium text-white"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-xs text-white/50">
              Hơn 12.000 đội nhóm đang tin dùng
            </span>
          </div> */}
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} FPT University. All rights reserved.
        </p>
      </div>

      {/* ============ RIGHT — Form panel ============ */}
      <div className="lg:col-span-3 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-brand-orange">
              <img src={FPTLogo} alt='Logo' className='w-[90%] aspect-square rounded-full'/>
            </div>
            <span className="text-lg font-semibold text-text-primary tracking-tight">
              FPT University
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Đăng nhập để tiếp tục vào không gian làm việc của bạn.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Email
              </label>
              <Input {...register('email')} icon={FiMail} id="email" type="text" placeholder="you@company.com"/>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Mật khẩu
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-brand-rust hover:text-brand-orange transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <Input {...register('password')} type='password' icon={FiLock}/>
            </div>

            {/* Remember me */}
            {/* <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border-default text-brand-orange focus:ring-brand-orange/30"
              />
              <label htmlFor="remember" className="text-sm text-text-secondary">
                Ghi nhớ đăng nhập trong 30 ngày
              </label>
            </div> */}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 rounded-md bg-brand-orange py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-rust active:bg-brand-wine disabled:bg-gray-300 disabled:text-black"
            >
              {loading ? '...':
              <>
               Đăng nhập
               <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border-default" />
            <span className="text-xs text-text-muted">hoặc tiếp tục với</span>
            <div className="h-px flex-1 bg-border-default" />
          </div> */}

          {/* Social login */}
          <div className="grid grid-cols-1 gap-3">
            {/* <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md border border-border-default py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-muted"
            >
              <FcGoogle className="w-4 h-4" />
              Google
            </button> */}
            {/* <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md border border-border-default py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-muted"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </button> */}
          </div>

          {/* <p className="mt-8 text-center text-sm text-text-secondary">
            Chưa có tài khoản?{' '}
            <a
              href="#"
              className="font-medium text-brand-rust hover:text-brand-orange transition-colors"
            >
              Đăng ký ngay
            </a>
          </p> */}
        </div>
      </div>
    </div>
  )
}