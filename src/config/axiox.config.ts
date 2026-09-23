import { useAuthStore } from "@/features/authentication/store/auth-store"
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
   const accessToken = useAuthStore.getState().accessToken
   config.headers.Authorization = `Bearer ${accessToken}`
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