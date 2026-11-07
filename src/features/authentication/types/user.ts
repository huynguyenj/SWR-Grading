export type UserType = {
   id: string
   fullName: string
   role: string
   type: string
   studentCode: string
   major: string
   staffCode: string
}

export interface LoginType {
   accessToken: string
   user: UserType
}