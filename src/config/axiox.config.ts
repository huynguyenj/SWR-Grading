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
   config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzM2FjOGM2Zi01ODhjLTRkMTgtYWM5My1jMmQyYTc2MGYwNTUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMzYWM4YzZmLTU4OGMtNGQxOC1hYzkzLWMyZDJhNzYwZjA1NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJOZ3V5ZW4gSHV5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiMSIsImRpc2NyaW1pbmF0b3IiOiJMZWN0dXJlciIsImV4cCI6MTc4OTU2MzU1NywiaXNzIjoiU3dyQWlHcmFkaW5nQXBpIiwiYXVkIjoiU3dyQWlHcmFkaW5nQ2xpZW50In0.RclE8I2Srq3mwcBOuSkhJUAy4pyyM9fiFrdZEVmfw4s`
   return config
}, error => Promise.reject(error))

apiPrivate.interceptors.response.use((response) => {
      return response.data
}, (error: AxiosError) => {
      // const apiResponseError = error.response?.data as ApiResponseError
      // if (apiResponseError.code === 'TOKEN_EXPIRED' || apiResponseError.code === 'UNAUTHORIZED')
      //       authStore.getState().removeAuthInfo()
      return Promise.reject(error)
})

apiPublic.interceptors.response.use((response) => {
      return response.data
}, (error: AxiosError) => {
      return Promise.reject(error)
})