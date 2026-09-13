export interface ApiResponseType<T> {
      data: T
      error: unknown
      success: boolean
}