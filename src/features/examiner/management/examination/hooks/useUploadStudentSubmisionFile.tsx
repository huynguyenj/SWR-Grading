import useApiCall from '@/hooks/useApiCall'
import { toast } from 'react-toastify'

export default function useUploadStudentSubmissionFile({ examinationSessionId }: { examinationSessionId: string }) {
  const { execute, loading } = useApiCall()

  const handleUploadStudentSubmissionFiles = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await execute({
      apiUrl: `submissions/upload?examinationSessionId=${examinationSessionId}`,
      method: 'post',
      type: 'private',
      body: formData,
    })
    if (response.error) {
      toast.error(response.error.message)
      return false
    }
    toast.success('Upload bài nộp thành công')
    return true
  }

  return { handleUploadStudentSubmissionFiles, loading }
}