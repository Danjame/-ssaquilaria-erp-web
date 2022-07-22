import { User } from '@/api/system/types/user'

export interface Department {
  id: number
  name: string
  remark: string
  users: User[]
  createdAt: Date
  updatedAt: Date
}

export interface DepartmentConditions {
  page?: number
  size?: number
}

export interface DepartmentAttrs {
  name?: string
  remark?: string
  userIds?: number[]
}
