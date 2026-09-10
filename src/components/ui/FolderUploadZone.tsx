import { useRef, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi'

export interface ParsedFolder {
  folderName: string
  fileCount: number
}

interface FolderUploadDropzoneProps {
  onFoldersSelected: (folders: ParsedFolder[]) => void
}

/**
 * Cho phép lecturer chọn 1 thư mục cha chứa nhiều folder bài nộp (mỗi folder con
 * = 1 bài làm của sinh viên). Dùng thuộc tính `webkitdirectory` để trình duyệt
 * trả về toàn bộ file kèm đường dẫn tương đối, từ đó gom nhóm theo folder con.
 */
export default function FolderUploadDropzone({ onFoldersSelected }: FolderUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function parseFileList(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return

    const groups = new Map<string, number>()
    Array.from(fileList).forEach((file) => {
      const relativePath = (file as any).webkitRelativePath as string | undefined
      // Folder con là segment thứ 2 trong đường dẫn (segment đầu là thư mục cha vừa chọn)
      const segments = relativePath ? relativePath.split('/') : [file.name]
      const folderName = segments.length > 2 ? segments[1] : segments[0]
      groups.set(folderName, (groups.get(folderName) ?? 0) + 1)
    })

    const folders: ParsedFolder[] = Array.from(groups.entries()).map(([folderName, fileCount]) => ({
      folderName,
      fileCount,
    }))
    onFoldersSelected(folders)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragActive(false)
        // Kéo-thả folder qua DataTransfer API khá phức tạp để đọc đệ quy;
        // ở đây ưu tiên luồng bấm chọn thư mục qua input bên dưới cho ổn định.
      }}
      className={[
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
        dragActive
          ? 'border-brand-orange bg-brand-orange/5'
          : 'border-border-default hover:border-brand-orange/60 hover:bg-bg-muted/40',
      ].join(' ')}
    >
      <FiUploadCloud className="w-8 h-8 text-text-muted" />
      <p className="text-sm text-text-primary">
        Bấm để chọn <span className="font-medium text-brand-orange">thư mục chứa bài làm</span>
      </p>
      <p className="text-xs text-text-muted">
        Mỗi folder con bên trong sẽ được coi là 1 bài nộp riêng biệt
      </p>
      <input
        ref={inputRef}
        type="file"
        // @ts-expect-error -- webkitdirectory chưa có trong type chuẩn của React
        webkitdirectory=""
        directory=""
        multiple
        onChange={(e) => parseFileList(e.target.files)}
        className="hidden"
      />
    </div>
  )
}