
import { useState } from 'react'

import Button from '@/components/ui/button'

import StudentSubmissionTable from '@/features/student/student_submission/components/StudentSubmissionTable'
import CreateApplicationModal from '@/features/student/application/components/CreateApplicationModal'

import useGetStudentSubmission from '@/features/student/student_submission/hooks/useGetStudentSubmissions'

import type { StudentSubmission } from '@/features/student/student_submission/types/student_submission'

export default function StudentSubmissionPage() {
    const {
        studentSubmissionList,
        loading,
        refresh,
    } = useGetStudentSubmission()

    // Selected submission for creating application
    const [selectedSubmission, setSelectedSubmission] =
        useState<StudentSubmission | null>(null)

    // Application modal state
    const [isApplicationModalOpen, setIsApplicationModalOpen] =
        useState(false)

    // Open application modal
    const handleCreateApplication = (
        submission: StudentSubmission,
    ) => {
        setSelectedSubmission(submission)
        setIsApplicationModalOpen(true)
    }

    // Close application modal
    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false)
        setSelectedSubmission(null)
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary">
                        Bài nộp của tôi
                    </h1>

                    <p className="mt-1 text-sm text-text-secondary">
                        Xem và theo dõi thông tin bài nộp của bạn
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

            {/* Submission Table */}
            <StudentSubmissionTable
                submissions={studentSubmissionList}
                loading={loading}
                onCreateApplication={handleCreateApplication}
            />

            {/* Create Application Modal */}
            {selectedSubmission && (
                <CreateApplicationModal
                    open={isApplicationModalOpen}
                    submission={selectedSubmission}
                    onClose={handleCloseApplicationModal}
                    onRefresh={refresh}
                />
            )}
        </div>
    )
}
