import useApiCall from '@/hooks/useApiCall'
import { useState } from 'react'
import type { FileInformationType } from '../../examination_materials/types/exam_material.type'
import { toast } from 'react-toastify'

export default function useGetFileDetail() {
  const { execute, loading } = useApiCall<FileInformationType>()
  const [fileInformation, setFileInformation] = useState<FileInformationType>()
  const handleGetFileInformation = async (paperSetId: string) => {
      const response = await execute({
            apiUrl: `paper-sets/${paperSetId}/read-files`,
            method: 'get',
            type: 'private'
      })
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      setFileInformation(response.data)
  }
  return { fileInformation, handleGetFileInformation, loading }
}
