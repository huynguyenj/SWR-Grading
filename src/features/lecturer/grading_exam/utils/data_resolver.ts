
export interface QuestionItem {
  id: string
  text: string
  point: number | null
}

export interface ParsedQuestionContent {
  /** Các đoạn mô tả đề bài đứng trước danh sách ý */
  intro: string[]
  items: QuestionItem[]
}


// "1. text", "8.a text" — tối đa 2 chữ số để không nhầm với câu bắt đầu bằng số lớn (năm, v.v.)
const ITEM_REGEX = /^(\d{1,2}(?:\.[a-z])?)\.?\s+(.+)$/i
// "(0.2 point)" hoặc "(1 points)" ở cuối dòng
const POINT_REGEX = /\s*\((\d+(?:\.\d+)?)\s*points?\)\s*$/i

/**
 * BE ghép tiêu đề dính liền vào đầu content (không có khoảng trắng):
 * "Context DiagramDraw a context diagram..." -> bỏ phần tiêu đề, chỉ giữ nội dung.
 * Chỉ cắt khi content thật sự bắt đầu bằng tiêu đề.
 */

/** Data cần giải quyết
[
  {\"subId\":\"1\",\"point\":0.1,\"guideline\":\"Phrase | The SnakeGuard system/project title is completed correctly or is clearly equivalent. 0 if missing or unrelated.\"},
  
  {\"subId\":\"2\",\"point\":0.1,\"guideline\":\"Phrase | Required document identification/metadata fields on the first page are completed accurately (for example, document/version/date/author only where the template asks for them). Award proportionally; 0 if all are missing or incorrect.\"},

  {\"subId\":\"3\",\"point\":0.1,\"guideline\":\"Phrase | The purpose/objective field, if present on the first page, accurately describes why the SnakeGuard SRS is being written. Award 0.05 for partially relevant content; 0 for missing/unrelated content.\"},

  {\"subId\":\"4\",\"point\":0.1,\"guideline\":\"Phrase | The scope/system overview field, if present on the first page, correctly identifies SnakeGuard as an AI-powered snake identification and rescue-support system. Award 0.05 for a partly correct description; 0 for missing/unrelated content.\"},

  {\"subId\":\"5\",\"point\":0.1,\"guideline\":\"Phrase | All other required fields appearing on the supplied first page are completed with relevant, consistent information. Award proportionally for completed fields; do not deduct twice for the same omission already scored above.\"}
]
*/

export function stripTitleFromContent(title: string, content: string) {
  const name = title.replace(/^Question\s*\d+\s*:\s*/i, '').trim()
  return name && content.startsWith(name) ? content.slice(name.length).trimStart() : content
}

/**
 * Ý nghĩa từng thành phần
  / Ký tự phân cách mở đầu Regex trong JavaScript.
  ^ Neo vào đầu chuỗi. Chỉ khớp nếu mẫu bắt đầu từ ký tự đầu tiên.

  Question Khớp chính xác chữ Question, không phân biệt hoa thường do cờ i.

  \s Khớp một ký tự khoảng trắng, chẳng hạn dấu cách hoặc tab.

  \* Khớp dấu * theo nghĩa đen. Phải escape vì * vốn là ký tự đặc biệt.

  \d+ \d khớp một chữ số từ 0 đến 9; + nghĩa là một hoặc nhiều chữ số.

  \s Khớp một ký tự khoảng trắng sau phần số.

  \*: Khớp dấu * rồi đến dấu hai chấm :, theo đúng thứ tự.

  \s* Khớp không hoặc nhiều ký tự khoảng trắng.

  /i Cờ i: không phân biệt chữ hoa và chữ thường.
 * 
 */


export function parseQuestionContent(title: string, content: string): ParsedQuestionContent {
  const intro: string[] = []
  const items: QuestionItem[] = []

  for (const rawLine of stripTitleFromContent(title, content).split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const match = line.match(ITEM_REGEX)
    if (match) {
      const pointMatch = match[2].match(POINT_REGEX)
      items.push({
        id: match[1],
        text: pointMatch ? match[2].replace(POINT_REGEX, '') : match[2],
        point: pointMatch ? Number(pointMatch[1]) : null,
      })
    } else if (items.length > 0) {
      // Dòng không đánh số xuất hiện sau khi đã có ý -> là phần nối tiếp của ý trước
      items[items.length - 1].text += ` ${line}`
    } else {
      intro.push(line)
    }
  }

  return { intro, items }
}
