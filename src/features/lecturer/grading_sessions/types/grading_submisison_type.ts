export interface GradingCriteriaType {
    criteria: string
    point: number
}

export interface ParsedAnswerType {
    parsedAnswerId: string
    questionId: string
    questionTitle: string
    maxScore: number
    criteria: GradingCriteriaType[]
    extractedText: string | null
    extractedXml: string | null
    extractedImageUrl: string | null
    createdAt: string
}

export interface GradingHistoryDetailType {
    detailId: string
    parsedAnswerId: string
    questionId: string
    questionTitle: string
    maxScore: number
    score: number
    comment: string
}

export interface GradingHistoryType {
    historyId: string
    submissionId: string
    evaluationType: number
    gradingRound: number
    totalScore: number
    generalFeedback: string
    status: number
    createdAt: string
    details: GradingHistoryDetailType[]
}

export interface SubmissionGradingType {
    submissionId: string
    parsedAnswers: ParsedAnswerType[]
    histories: GradingHistoryType[]
}