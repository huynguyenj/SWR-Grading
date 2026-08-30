export type SemesterStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed'

export interface Semester {
  id: string
  name: string
  code: string
  startDate: string // ISO date
  endDate: string // ISO date
  status: SemesterStatus
  courseCount: number
  examCount: number
}

export const mockSemesters: Semester[] = [
  {
    id: '1',
    name: 'Học kỳ Fall 2026',
    code: 'FA26',
    startDate: '2026-09-07',
    endDate: '2026-12-27',
    status: 'upcoming',
    courseCount: 6,
    examCount: 0,
  },
  {
    id: '2',
    name: 'Học kỳ Summer 2026',
    code: 'SU26',
    startDate: '2026-05-11',
    endDate: '2026-08-30',
    status: 'ongoing',
    courseCount: 5,
    examCount: 8,
  },
  {
    id: '3',
    name: 'Học kỳ Spring 2026',
    code: 'SP26',
    startDate: '2026-01-06',
    endDate: '2026-04-26',
    status: 'completed',
    courseCount: 7,
    examCount: 14,
  },
  {
    id: '4',
    name: 'Học kỳ Winter 2025',
    code: 'WI25',
    startDate: '2025-11-03',
    endDate: '2025-12-28',
    status: 'completed',
    courseCount: 4,
    examCount: 6,
  },
  {
    id: '5',
    name: 'Học kỳ Spring 2027',
    code: 'SP27',
    startDate: '2027-01-11',
    endDate: '2027-05-02',
    status: 'draft',
    courseCount: 0,
    examCount: 0,
  },
]