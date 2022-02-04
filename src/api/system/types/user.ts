import { Role } from './role'
import { Department } from '@/api/organization/types/department'

export interface User {
  id: number
  name: string
  username: string
  email: string
  roles: Role[]
  department: Department
  status: boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export interface CurrentUser {
  name: string
  status: boolean
  token: string
}
