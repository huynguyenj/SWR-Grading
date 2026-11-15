
import { useEffect } from 'react'
import { FiFileText, FiSend } from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'

import type { StudentSubmission } from
    '@/features/student/student_submission/types/student_submission'

import useCreateApplication from
    '../hooks/useCreateApplication'

interface CreateApplicationModalProps {
    open: boolean
    submission: StudentSubmission | null
    onClose: () => void
    onRefresh: () => void
}

export default function CreateApplicationModal({
    open,
    submission,
    onClose,
    onRefresh,
}: CreateApplicationModalProps) {
    if (!submission) return null

    return (
        <CreateApplicationModalContent
            open={open}
            submission={submission}
            onClose={onClose}
            onRefresh={onRefresh}
        />
    )
}

interface CreateApplicationModalContentProps {
    open: boolean
    submission: StudentSubmission
    onClose: () => void
    onRefresh: () => void
}

function CreateApplicationModalContent({
    open,
    submission,
    onClose,
    onRefresh,
}: CreateApplicationModalContentProps) {
    const {
        register,
        handleSubmit,
        errors,
        loading,
        onSubmit,
        reset,
    } = useCreateApplication({
        submissionId: submission.submissionId,
        onRefresh,
    })

    useEffect(() => {
        if (open) {
            reset({
                submissionId: submission.submissionId,
                reason: '',
            })
        }
    }, [open, submission.submissionId, reset])

    const handleFormSubmit = handleSubmit(async (values) => {
        const success = await onSubmit(values)

        if (success) {
            onClose()
        }
    })

    const handleClose = () => {
        if (loading) return
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Create Application"
            maxWidth="xl"
        >
            <form
                onSubmit={handleFormSubmit}
                className="space-y-5 px-5 py-5"
            >
                {/* Submission Information */}
                <div className="rounded-lg border border-border-default bg-bg-muted/40 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <FiFileText
                            size={18}
                            className="text-brand-orange"
                        />
                        <h3 className="text-sm font-semibold text-text-primary">
                            Submission Information
                        </h3>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <p className="text-xs text-text-muted">
                                Submission File
                            </p>
                            <p className="mt-1 break-all text-sm font-medium text-text-primary">
                                {submission.submissionFile}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-text-muted">
                                Examination
                            </p>
                            <p className="mt-1 text-sm text-text-primary">
                                {submission.examination?.name || '—'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-text-muted">
                                Submission ID
                            </p>
                            <p className="mt-1 break-all text-xs text-text-secondary">
                                {submission.submissionId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                    <label
                        htmlFor="application-reason"
                        className="text-sm font-medium text-text-primary"
                    >
                        Reason <span className="text-brand-orange">*</span>
                    </label>

                    <textarea
                        id="application-reason"
                        {...register('reason')}
                        placeholder="Enter the reason for creating this application..."
                        rows={5}
                        disabled={loading}
                        className={`w-full resize-none rounded-lg border bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-brand-orange ${
                            errors.reason
                                ? 'border-danger'
                                : 'border-border-default'
                        }`}
                    />

                    {errors.reason && (
                        <p className="text-xs text-danger">
                            {errors.reason.message}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-border-default pt-4">
                    <Button
                        type="button"
                        variant="basic"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        <span className="flex items-center gap-2">
                            <FiSend size={15} />
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </span>
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
