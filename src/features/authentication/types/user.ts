export type UserType = {
   id: string
   fullName: string
   role: string
}

export interface LoginType {
   accessToken: string
   user: UserType
}