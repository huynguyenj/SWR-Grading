
export default function Loading_Circle() {
  return (
            <div className="flex min-h-60 items-center justify-center rounded-lg border border-border-default bg-bg-primary">
                <div className="flex flex-col items-center gap-3 text-text-secondary">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                    <p className="text-sm">Đang tải...</p>
                </div>
            </div>
  )
}
