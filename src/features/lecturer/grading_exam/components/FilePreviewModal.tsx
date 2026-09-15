import { useEffect, useState } from 'react'
import mammoth from 'mammoth'
import type { ReferenceFile } from '../types/grading-exam.type';
import Modal from '@/components/ui/modal';

interface FilePreviewModalProps {
  /** null = đóng modal */
  data: { label: string; file: ReferenceFile } | null
  onClose: () => void
}

function isDocx(fileName: string) {
  return fileName.toLowerCase().endsWith('.docx')
}

/**
 * Modal xem nội dung file tham chiếu (đề/rubric/đáp án).
 *
 * - Nếu file là .docx VÀ có `fileUrl` thật: tải file về rồi dùng `mammoth`
 *   convert sang HTML ngay trên trình duyệt, render ra giống mở file Word
 *   (giữ heading, bold, danh sách, bảng...).
 * - Nếu chưa có file thật (chỉ có `content` dạng text mock): hiển thị fallback
 *   dạng text thường — dùng cho giai đoạn UI/demo trước khi nối BE thật.
 *
 * Lưu ý: mammoth chỉ đọc được .docx. Với .xlsx (thường dùng cho rubric) cần
 * thư viện khác (VD: SheetJS - `xlsx`) để parse và render ra bảng; với .pdf
 * cần pdf.js. Có thể mở rộng thêm nhánh xử lý riêng cho từng đuôi file.
 */
export default function FilePreviewModal({ data, onClose }: FilePreviewModalProps) {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleFileDocs = () => {
          if (!data) {
            setHtml('')
            setError('')
            return
          }
      
          const { file } = data
          if (!isDocx(file.fileName) || !file.fileUrl) {
            // Chưa có file .docx thật -> dùng fallback content, không gọi mammoth
            setHtml('')
            setError('')
            return
          }
      
          let cancelled = false
          setLoading(true)
          setError('')
      
          fetch(file.fileUrl)
            .then((res) => {
              if (!res.ok) throw new Error('Không tải được file')
              return res.arrayBuffer()
            })
            .then((arrayBuffer) => mammoth.convertToHtml({ arrayBuffer }))
            .then((result) => {
              if (!cancelled) setHtml(result.value)
            })
            .catch(() => {
              if (!cancelled) setError('Không thể đọc nội dung file. Thử tải file về để xem trực tiếp.')
            })
            .finally(() => {
              if (!cancelled) setLoading(false)
            })
      
          return () => {
            cancelled = true
          }
    }
    handleFileDocs()
  }, [data])

  return (
    <Modal
      open={data !== null}
      onClose={onClose}
      title={data ? `${data.label} — ${data.file.fileName}` : undefined}
      maxWidth="lg"
    >
      {data && (
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">
          {loading && (
            <p className="py-8 text-center text-sm text-text-muted">Đang tải nội dung file...</p>
          )}

          {!loading && error && <p className="text-sm text-danger">{error}</p>}

          {/* Render đúng định dạng Word bằng HTML mammoth trả về */}
          {!loading && !error && html && (
            <div
              className={[
                'rounded-md border border-border-default bg-white p-8 shadow-sm',
                // Style cho các thẻ HTML thô mà mammoth trả về (không có class riêng)
                '[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mb-3 [&_h1]:text-text-primary',
                '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2.5 [&_h2]:text-text-primary',
                '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-text-primary',
                '[&_p]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-text-primary',
                '[&_strong]:font-semibold',
                '[&_em]:italic',
                '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1',
                '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1',
                '[&_li]:text-sm [&_li]:text-text-primary',
                '[&_table]:w-full [&_table]:border-collapse [&_table]:mb-3',
                '[&_td]:border [&_td]:border-border-default [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-sm',
                '[&_th]:border [&_th]:border-border-default [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-sm [&_th]:font-semibold [&_th]:bg-bg-muted',
                '[&_img]:max-w-full',
              ].join(' ')}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          {/* Fallback khi chưa có file .docx thật — dùng content mock */}
          {!loading && !error && !html && data.file.content && (
            <div className="rounded-md bg-bg-muted/50 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-text-primary leading-relaxed">
                {data.file.content}
              </pre>
            </div>
          )}

          <p className="mt-3 text-xs text-text-muted">
            {html
              ? 'Nội dung được chuyển đổi trực tiếp từ file .docx gốc — có thể lệch định dạng nhẹ so với Word (VD: một số style phức tạp, header/footer).'
              : 'Chưa gắn file .docx thật (fileUrl) nên đang hiển thị nội dung mẫu dạng text.'}
          </p>
        </div>
      )}
    </Modal>
  )
}