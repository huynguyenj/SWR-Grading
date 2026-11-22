
export interface ManagerScoreDistributionFilterType {
  examinationId?: string | null
  semesterId?: string | null
}

export interface ManagerScoreDistributionFilterContextType {
  semesterId: string | null
  semesterName: string | null
  semesterCode: string | null
  examinationId: string | null
  examinationName: string | null
  examinationCode: string | null
}

export interface ManagerScoreDistributionBucketType {
  label: string
  minScore: number
  maxScore: number
  aiCount: number
  aiPercentage: number
  humanCount: number
  humanPercentage: number
}

export interface ManagerScoreDistributionType {
  filterContext: ManagerScoreDistributionFilterContextType
  totalOfficialSubmissions: number
  totalAiGradedSubmissions: number
  totalHumanOfficialSubmissions: number
  buckets: ManagerScoreDistributionBucketType[]
}

export interface ManagerAiHumanStatisticsType {
  filterContext: ManagerScoreDistributionFilterContextType

  totalOfficialSubmissions: number
  bothGradedCount: number

  humanAverageScore: number | null
  humanHighestScore: number | null
  humanLowestScore: number | null

  aiAverageScore: number | null
  aiHighestScore: number | null
  aiLowestScore: number | null

  averageScoreDifference: number | null
  meanAbsoluteError: number | null

  aiHigherCount: number
  humanHigherCount: number
  equalCount: number

  acceptableDeviationRate: number
}