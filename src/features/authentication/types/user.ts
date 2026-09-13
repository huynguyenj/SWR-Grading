export type UserType = {
   id: string
   fullname: string
   role: string
}

export interface LoginType {
   accessToken: string
   user: UserType
}