import useApiCall from '@/hooks/useApiCall'
import { toast } from 'react-toastify'

export default function useUploadSubmissionFiles() {
  const { execute, loading } = useApiCall()

  const handleUploadSubmissionFiles = async (diaryId: string, files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await execute({
      apiUrl: `grading-diaries/${diaryId}/submissions/upload`,
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

  return { handleUploadSubmissionFiles, loading }
}