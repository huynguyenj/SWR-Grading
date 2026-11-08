import Modal from "@/components/ui/modal"
import useUploadStudentSubmissionFile from "../hooks/useUploadStudentSubmisionFile"
import ExamSessionUploadZone from "./ExamSessionUploadZone"

type UploadStudentSubmissionModalType = {
   examinationSessionId: string
   refresh: () => void
   isOpen: boolean
   onClose: () => void
}

export default function UploadStudentSubmissionModal({ examinationSessionId, isOpen, onClose, refresh }: UploadStudentSubmissionModalType) {
  const { handleUploadStudentSubmissionFiles, loading } = useUploadStudentSubmissionFile({ examinationSessionId: examinationSessionId})
  async function handleUploadFiles(files: File[]) {
    const success = await handleUploadStudentSubmissionFiles(files)
    if (success) refresh()
    return success
  }
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Tải file bài làm học sinh"
    >
      <div className="px-4 py-5">
        <ExamSessionUploadZone
          onUpload={handleUploadFiles}
          uploading={loading}
        />
      </div>
    </Modal>
  )
}
