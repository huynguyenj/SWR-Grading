
import Button from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import StudentExamSessionTable from '@/features/student/student_exam_session/components/StudentExamSessionTable'
import useGetStudentExamSession from '@/features/student/student_exam_session/hooks/useGetStudentExamSession'


export default function StudentExamSessionPage() {
    const {
        examinationSessionDataList,
        loading,
        currentExaminationSessionPage,
        pageExaminationSessionSize,
        setPageExaminationSessionSize,
        setCurrentExaminationSessionPage,
        refresh,
    } = useGetStudentExamSession()

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary">
                        Examination Sessions
                    </h1>

                    <p className="mt-1 text-sm text-text-secondary">
                        View and track your examination sessions.
                    </p>
                </div>

                <Button
                    variant="basic"
                    onClick={refresh}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </div>

            {/* Examination Session Table */}
            <StudentExamSessionTable
                examinationSessions={examinationSessionDataList?.items}
                loading={loading}
            />

            {/* Pagination */}
            {examinationSessionDataList &&
                examinationSessionDataList.totalPages > 0 && (
                    <Pagination
                        currentPage={currentExaminationSessionPage}
                        onPageChange={setCurrentExaminationSessionPage}
                        totalPages={examinationSessionDataList.totalPages}
                        onPageSizeChange={(size) => {
                            setPageExaminationSessionSize(size)
                            setCurrentExaminationSessionPage(1)
                        }}
                        pageSize={pageExaminationSessionSize}
                    />
                )}
        </div>
    )
}
