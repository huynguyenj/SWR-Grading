export interface SubmissionFileValidationResult {
  valid: boolean
  errors: string[]
}

interface SubmissionFileValidationOptions {
  /**
   * Regex kiểm tra tên file, không bao gồm phần mở rộng.
   * Có thể truyền regex khác khi cấu trúc tên file thay đổi.
   */
  pattern?: RegExp
  allowedExtensions?: string[]
}

const DEFAULT_PATTERN =
  /^[A-Z0-9]+_[A-Z0-9]+_[A-Z]{2}\d{2}_[A-Z0-9]+$/i

export function validateSubmissionFileNames(
  fileNames: string[],
  options: SubmissionFileValidationOptions = {},
): SubmissionFileValidationResult {
  const {
    pattern = DEFAULT_PATTERN,
    allowedExtensions = ['.rar', '.zip'],
  } = options

  const errors: string[] = []

  if (fileNames.length === 0) {
    return {
      valid: false,
      errors: ['File RAR tổng không chứa file bài làm nào.'],
    }
  }

  for (const filePath of fileNames) {
    // Chỉ lấy tên file, bỏ qua thư mục bên trong archive.
    const fileName = filePath.split(/[\\/]/).pop() ?? filePath
    const extensionIndex = fileName.lastIndexOf('.')

    const extension =
      extensionIndex >= 0
        ? fileName.slice(extensionIndex).toLowerCase()
        : ''

    const baseName =
      extensionIndex >= 0
        ? fileName.slice(0, extensionIndex)
        : fileName

    if (!allowedExtensions.includes(extension)) {
      errors.push(
        `${fileName}: định dạng không hợp lệ. Chỉ chấp nhận ${allowedExtensions.join(', ')}.`,
      )
      continue
    }

    // Reset trạng thái nếu người dùng truyền regex có cờ g hoặc y.
    pattern.lastIndex = 0

    if (!pattern.test(baseName)) {
      errors.push(
        `${fileName}: tên file không đúng cấu trúc yêu cầu.`,
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}