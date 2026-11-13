import type { ApplicationStatus } from "../types/application_type";

export const applicationStatusConfig: Record<
    ApplicationStatus,
    { label: string; className: string }
> = {
    0: {
        label: 'Chờ duyệt',
        className: 'bg-warning/10 text-warning',
    },
    1: {
        label: 'Chấp nhận',
        className: 'bg-success/10 text-success',
    },
    2: {
        label: 'Từ chối',
        className: 'bg-danger/10 text-danger',
    },
    3: {
        label: 'Đang xử lí',
        className: 'bg-brand-orange/10 text-brand-orange',
    },
    4: {
        label: 'Hoàn thành',
        className: 'bg-brand-wine/10 text-brand-wine',
    },
}
