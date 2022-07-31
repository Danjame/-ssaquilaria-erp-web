import { Role } from './role'
import { Department } from '@/api/organization/types/department'

export interface User {
  id: number
  username: string
  name: string
  phone: string
  email: string
  roles: Role[]
  department: Department
  status: boolean
  isStatusLoading?: boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export interface CurrentUser {
  name: string
  status: boolean
  token: string
}

export interface UserConditions {
  name?: string
  departmentId?: number
  page?: number
  size?: number
}

export interface UserAttrs {
  name?: string
  phone?: string
  email?: string
  status?: boolean
  lastLogin?: Date
  roleIds?: number[]
}
