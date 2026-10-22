/**
 * fileQuestionDocs/fileAnswerRubric/fileAnswerTemplate hiện là object key nội bộ
 * (VD: "examinations/{semesterId}/{code}/EQ/xxx_Question.docx"), không phải URL
 * public. Cần 1 base URL (CDN) hoặc — nếu bucket private — 1 API presigned-URL
 * để đổi key này thành link tải/xem được. Tạm thời ghép với base URL từ env,
 * CẦN THAY LOGIC NÀY nếu BE dùng presigned URL riêng.
 */

export function toFileUrl(objectKey: string) {
  if (!objectKey) return ''
  if (objectKey.startsWith('http')) return objectKey
  return `${objectKey}`
}
 
/** Lấy tên file hiển thị từ object key (bỏ phần path phía trước) */
export function toFileDisplayName(objectKey: string) {
  const parts = objectKey.split('/')
  return parts[parts.length - 1] || objectKey
}