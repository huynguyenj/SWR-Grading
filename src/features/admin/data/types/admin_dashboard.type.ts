export interface ScoreDistributionItem {
  range: string
  count: number
  isBelowPass: boolean
}

export interface SemesterStatistics {
  semesterId: string
  semesterCode: string
  semesterName: string
  status: string
  totalExaminations: number
  totalSubmissions: number
  gradedSubmissions: number
  ungradedSubmissions: number
  gradedPercentage: number
  averageScore: number | null
  highestScore: number | null
  lowestScore: number | null
  passRate: number
  failRate: number
  scoreDistribution: ScoreDistributionItem[]
}

export interface LecturerPerformance {
  lecturerId: string
  lecturerCode: string
  fullName: string
  email: string
  subject: string
  totalDiaries: number
  totalSubmissions: number
  gradedSubmissions: number
  ungradedSubmissions: number
  completionRate: number
  averageScore: number | null
}