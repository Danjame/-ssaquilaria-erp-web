import { User } from '@/api/system/types/user'

export interface Department {
  id: number
  name: string
  value: string
  label: string
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
  value?: string
  label?: string
  userIds?: number[]
}
