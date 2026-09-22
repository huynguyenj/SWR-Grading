import type { AxiosError } from "axios"
import axios from "axios"
const BASE_API_URL= import.meta.env.VITE_BASE_API_URL

export const apiPrivate = axios.create({
      baseURL: BASE_API_URL
})
export const apiPublic = axios.create({
      baseURL: BASE_API_URL
})

apiPrivate.interceptors.request.use((config) => {
//    const accessToken = authStore.getState().accessToken
   config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNTA1YTJmYS1jY2IzLTRlNTItYWM4My0yYzZiOWIxN2MyMDQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImQ1MDVhMmZhLWNjYjMtNGU1Mi1hYzgzLTJjNmI5YjE3YzIwNCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJKYW5lIExlY3R1cmVyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiMSIsImRpc2NyaW1pbmF0b3IiOiJMZWN0dXJlciIsImV4cCI6MTc5MDA2ODY5NywiaXNzIjoiU3dyQWlHcmFkaW5nQXBpIiwiYXVkIjoiU3dyQWlHcmFkaW5nQ2xpZW50In0.hNiHYv_CYFVMTX9vDCBE2z6dY2ruY_4E1cO6sJ1oAH0`
   return config
}, error => Promise.reject(error))

apiPrivate.interceptors.response.use((response) => {
      return response.data
}, (error: AxiosError) => {
      // const apiResponseError = error.response?.data as ApiResponseError
      // if (apiResponseError.code === 'TOKEN_EXPIRED' || apiResponseError.code === 'UNAUTHORIZED')
      //       authStore.getState().removeAuthInfo()
              console.log("===== AXIOS ERROR =====")
        console.log("Status:", error.response?.status)
        console.log("Response data:", error.response?.data)
        console.log("Response headers:", error.response?.headers)
        console.log("Request URL:", error.config?.url)
        console.log("Request method:", error.config?.method)
        console.log("Request headers:", error.config?.headers)
        console.log("=======================")
      return Promise.reject(error.response?.data)
})

apiPublic.interceptors.response.use((response) => {
      return response.data
}, (error: AxiosError) => {
      return Promise.reject(error)
})