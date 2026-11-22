
import Button from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'

import useGetApplicationList from '@/features/student/application/hooks/useGetStudentApplication'

import StudentApplicationTable from '@/features/student/application/components/StudentApplicationTable'

export default function ApplicationPage() {
    const {
        applicationDataList,
        loading,
        currentApplicationPage,
        pageApplicationSize,
        setPageApplicationSize,
        setCurrentApplicationPage,
        refresh,
    } = useGetApplicationList()

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary">
                        Đơn phúc khảo
                    </h1>

                    <p className="mt-1 text-sm text-text-secondary">
                        Quản lí và theo dõi đơn phúc khảo của bạn.
                    </p>
                </div>

                <Button
                    variant="basic"
                    onClick={refresh}
                    disabled={loading}
                >
                    Làm mới
                </Button>
            </div>

            {/* Application Table */}
            <StudentApplicationTable
                applications={applicationDataList?.items}
                loading={loading}
            />

            {/* Pagination */}
            {applicationDataList &&
                applicationDataList.totalPages > 0 && (
                    <Pagination
                        currentPage={currentApplicationPage}
                        onPageChange={setCurrentApplicationPage}
                        totalPages={applicationDataList.totalPages}
                        onPageSizeChange={(size) => {
                            setPageApplicationSize(size)
                            setCurrentApplicationPage(1)
                        }}
                        pageSize={pageApplicationSize}
                    />
                )}
        </div>
    )
}
