// import type { SubmissionStatus } from '@/features/lecturer/grading_exam/types/submission.type'

export interface LecturerDashboardType {
  kpi: DashboardKpi
  scoreDistribution: ScoreBucket[]
  gradingProgress: GradingProgressItem[]
  semesterComparison: SemesterComparisonItem[]
}

export interface DashboardKpi {
  totalSubmissions: number
  gradedSubmissions: number
  gradedPercentage: number
  ungradedSubmissions: number
  averageScore: number | null
  highestScore: number | null
  lowestScore: number | null
}

export interface ScoreBucket {
  range: string
  count: number
  isBelowPass: boolean
}

export interface GradingProgressItem {
  statusKey: string
  statusName: string
  count: number
  percentage: number
  colorHex: string
}

export interface SemesterComparisonItem {
  semesterId: string
  semesterCode: string
  semesterName: string
  totalSubmissions: number
  gradedSubmissions: number
}


/** Dữ liệu giả để xem giao diện khi BE chưa có endpoint — bỏ khi nối API thật */

// const BASE_DISTRIBUTION = [1, 2, 4, 7, 12, 20, 31, 44, 28, 10] // 0–1 ... 9–10
// const BASE_PENDING = 21
// const GRADED_RATIO = [38 / 159, 52 / 159, 69 / 159] // AI đã chấm / GV đã duyệt / Hoàn tất

// function hash(s: string) {
//   let h = 0
//   for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
//   return h
// }

// export function getMockDashboard(semesterId: string): LecturerDashboardType {
//   // Chọn 1 học kỳ cụ thể -> thu nhỏ số liệu để thấy bộ lọc có tác dụng
//   const isAll = semesterId === 'all'
//   const h = hash(semesterId)
//   const factor = isAll ? 1 : 0.25 + (h % 6) / 10
//   const avg = isAll ? 7.4 : 7.4 + ((h % 5) - 2) * 0.25

//   const distribution = BASE_DISTRIBUTION.map((c) => Math.round(c * factor))
//   const graded = distribution.reduce((a, b) => a + b, 0)
//   const pending = Math.round(BASE_PENDING * factor)

//   const ai = Math.round(graded * GRADED_RATIO[0])
//   const reviewed = Math.round(graded * GRADED_RATIO[1])
//   const final = graded - ai - reviewed

//   return {
//     totalSubmissions: graded + pending,
//     gradedSubmissions: graded,
//     pendingSubmissions: pending,
//     averageScore: Number(avg.toFixed(2)),
//     highestScore: 9.8,
//     lowestScore: 0.5,
//     scoreDistribution: distribution.map((count, i) => ({
//       range: `${i}–${i + 1}`,
//       min: i,
//       count,
//     })),
//     statusBreakdown: [
//       { status: '0', count: pending },
//       { status: '1', count: ai },
//       { status: '2', count: reviewed },
//       { status: '3', count: final },
//     ],
//     submissionsBySemester: [
//       { semesterId: 'mock-1', semesterName: 'FA25', total: 60, graded: 60 },
//       { semesterId: 'mock-2', semesterName: 'SP26', total: 75, graded: 70 },
//       { semesterId: 'mock-3', semesterName: 'SU26', total: 45, graded: 29 },
//     ],
//   }
// }