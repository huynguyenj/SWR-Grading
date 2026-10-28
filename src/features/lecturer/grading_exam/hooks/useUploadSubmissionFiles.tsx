import { createExtractorFromData } from 'node-unrar-js/esm'
import useApiCall from '@/hooks/useApiCall'
import { toast } from 'react-toastify'
import { validateSubmissionFileNames } from '../utils/file_resolver'

const MAX_ARCHIVE_SIZE = 200 * 1024 * 1024 // 200 MB
const MAX_EXTRACTED_FILES = 200

function getFileName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path
}

export default function useUploadSubmissionFiles() {
  const { execute, loading } = useApiCall()

  const handleUploadSubmissionFiles = async (
    diaryId: string,
    archiveFile: File,
  ): Promise<boolean> => {
    try {
      // 1. Validate file RAR tổng.
      if (!archiveFile.name.toLowerCase().endsWith('.rar')) {
        toast.error('Vui lòng chọn file RAR.')
        return false
      }

      if (archiveFile.size === 0) {
        toast.error('File RAR không được để trống.')
        return false
      }

      if (archiveFile.size > MAX_ARCHIVE_SIZE) {
        toast.error('File RAR vượt quá dung lượng tối đa 200 MB.')
        return false
      }

      // 2. Đọc file RAR vào bộ nhớ.
      const buffer = await archiveFile.arrayBuffer()

      const extractor = await createExtractorFromData({
        data: buffer,
      })

      // 3. Đọc danh sách file bên trong archive.
      const archiveList = extractor.getFileList()
      const fileHeaders = [...archiveList.fileHeaders]

      // Bỏ qua thư mục, chỉ lấy file.
      const innerFiles = fileHeaders.filter(
        (header) => !header.flags.directory,
      )

      if (innerFiles.length === 0) {
        toast.error('File RAR không chứa file bài làm.')
        return false
      }

      if (innerFiles.length > MAX_EXTRACTED_FILES) {
        toast.error(
          `File RAR chứa quá nhiều file. Tối đa ${MAX_EXTRACTED_FILES} file.`,
        )
        return false
      }

      // 4. Validate tên file trước khi giải nén nội dung.
      const validation = validateSubmissionFileNames(
        innerFiles.map((header) => header.name),
        {
          allowedExtensions: ['.rar', '.zip'],
        },
      )

      if (!validation.valid) {
        toast.error(
          `Có ${validation.errors.length} file không hợp lệ:\n${validation.errors.slice(0, 5).join('\n')}`,
          {
            autoClose: 8000,
          },
        )
        return false
      }

      // 5. Giải nén các file bài làm vào bộ nhớ.
      const extractedResult = extractor.extract({
        files: (header) => !header.flags.directory,
      })

      const extractedFiles = [...extractedResult.files]

      if (extractedFiles.length === 0) {
        toast.error('Không giải nén được file bài làm.')
        return false
      }

      // 6. Chuyển nội dung đã giải nén thành File để gửi FormData.
      const submissionFiles = extractedFiles.map((item) => {
        const fileName = getFileName(item.fileHeader.name)

        // Sao chép dữ liệu sang ArrayBuffer độc lập.
        if (!item.extraction) {
          throw new Error(`Không thể giải nén file ${fileName}.`)
        }
        const content = Uint8Array.from(item.extraction).buffer

        return new File([content], fileName, {
          type: 'application/vnd.rar',
        })
      })

      // 7. Gửi các file bài làm đến API hiện tại.
      const formData = new FormData()

      submissionFiles.forEach((file) => {
        formData.append('files', file)
      })

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

      toast.success(
        `Upload thành công ${submissionFiles.length} file bài làm.`,
      )

      return true
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đọc hoặc giải nén file RAR.'

      toast.error(message)
      return false
    }
  }

  return {
    handleUploadSubmissionFiles,
    loading,
  }
}