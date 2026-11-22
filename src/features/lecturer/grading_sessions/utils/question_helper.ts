
export default function getQuestionNumber(
    questionTitle: string,
    fallbackIndex: number,
): number {
    const matchedNumber = questionTitle.match(
        /(?:question|câu)\s*(\d+)/i,
    )

    if (matchedNumber?.[1]) {
        return Number(matchedNumber[1])
    }

    // Nếu tiêu đề không có số câu, sử dụng thứ tự trong danh sách.
    return fallbackIndex + 1
}
