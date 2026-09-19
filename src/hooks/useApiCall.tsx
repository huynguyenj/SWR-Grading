import { apiPrivate, apiPublic } from '@/config/axiox.config'
import type { ApiResponseType } from '@/types/api.type'
import { useState } from 'react'

type UseApiCallType = {
  apiUrl: string
  type: 'public' | 'private'
  method: 'post' | 'get' | 'put' | 'del' | 'patch'
  body?: object
}

// type UseApiCallReturnType<T> = {
//   data: T
//   loading: boolean
//   error?: string | unknown
// }

export default function useApiCall<T>() {
  const [loading, setLoading] = useState(false)
  const apiMethodSelect = ({ apiUrl, method, type='public', body }: UseApiCallType): Promise<ApiResponseType<T>> => {
    const api = type === 'private' ? apiPrivate : apiPublic
    switch (method) {
    case 'post':
      return api.post(apiUrl, body)
    case 'get':
      return api.get(apiUrl)
    case 'put':
      return api.put(apiUrl, body)
    case 'patch':
      return api.patch(apiUrl, body)
    case 'del':
      return api.delete(apiUrl)
    }
  }

  const execute = async ({ apiUrl, type, method, body }: UseApiCallType) => {
    let data
    let errorResponse
    let success
    try {
      setLoading(true)
      const response = await apiMethodSelect({ apiUrl, type, method, body })
      data = response.data as T            
      success = true
      errorResponse = null
    } catch (error) {
      console.log(error);
      data = null as unknown as T
      success = false
      errorResponse = error as ApiResponseType<null>
    } finally {
      setLoading(false)
    }
    return { data, error: errorResponse, success }
  }
  return { execute, loading }
}
