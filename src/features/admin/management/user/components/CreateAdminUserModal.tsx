import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import useCreateAdminUser from '../hooks/useCreateAdminUser'

interface CreateAdminUserModalProps {
    open: boolean
    onClose: () => void
    onRefresh: () => void
}

const ROLE_OPTIONS = [
    { value: 0, label: 'Học sinh' },
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Giám khảo' },
    { value: 3, label: 'Khảo thí' },
    { value: 4, label: 'Quản lý bộ môn' },
]

export default function CreateAdminUserModal({
    open,
    onClose,
    onRefresh,
}: CreateAdminUserModalProps) {
    const {
        register,
        handleSubmit,
        errors,
        loading,
        onSubmit,
        selectedRole,
    } = useCreateAdminUser({
        onRefresh,
        onSuccess: onClose,
    })

    if (!open) return null

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Tạo tài khoản mới"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 px-5 py-4"
            >
                {/* Full Name */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Họ và tên
                    </label>

                    <Input
                        {...register('fullName')}
                        size="basic"
                        placeholder="Nhập họ và tên"
                        error={errors.fullName?.message}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Email
                    </label>

                    <Input
                        {...register('email')}
                        size="basic"
                        type="email"
                        placeholder="example@gmail.com"
                        error={errors.email?.message}
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Mật khẩu
                    </label>

                    <Input
                        {...register('password')}
                        size="basic"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        error={errors.password?.message}
                    />
                </div>

                {/* Birthday */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Ngày sinh
                    </label>

                    <input
                        {...register('birthday')}
                        type="date"
                        className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
                    />

                    {errors.birthday?.message && (
                        <p className="mt-1 text-xs text-danger">
                            {errors.birthday.message}
                        </p>
                    )}
                </div>

                {/* Role */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Vai trò
                    </label>

                    <select
                        {...register('role', { valueAsNumber: true })}
                        className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
                    >
                        {ROLE_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Student Information */}
                {selectedRole === 0 && (
                    <>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-text-primary">
                                Mã sinh viên
                            </label>

                            <Input
                                {...register('studentCode')}
                                size="basic"
                                placeholder="Nhập mã sinh viên"
                                error={errors.studentCode?.message}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-text-primary">
                                Chuyên ngành
                            </label>

                            <Input
                                {...register('major')}
                                size="basic"
                                placeholder="Nhập chuyên ngành"
                                error={errors.major?.message}
                            />
                        </div>
                    </>
                )}

                {/* Staff Information */}
                {selectedRole !== 0 && (
                    <>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-text-primary">
                                Mã nhân viên
                            </label>

                            <Input
                                {...register('staffCode')}
                                size="basic"
                                placeholder="VD: AD01"
                                error={errors.staffCode?.message}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-text-primary">
                                Bộ môn
                            </label>

                            <Input
                                {...register('subject')}
                                size="basic"
                                placeholder="Nhập bộ môn"
                                error={errors.subject?.message}
                            />
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="basic"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>

                    <Button
                        type="submit"
                        variant="default"
                        disabled={loading}
                    >
                        {loading
                            ? 'Đang tạo...'
                            : 'Tạo tài khoản'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}