export interface PaginationType<T> {
      items: T[]
      totalCount: number
      page: number
      pageSize: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
}