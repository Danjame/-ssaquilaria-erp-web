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
