import { User } from './user'
import { Permission } from './permission'
import { Menu } from './menu'

export interface Role {
  id: number
  name: string
  value: string
  label: string
  users: User[]
  permissions: Permission[]
  menuIds: number[]
  status: boolean
  isStatusLoading?: boolean
  createdAt: Date
  updatedAt: Date
  menus: Menu[]
}

export interface RoleConditions {
  name?: string
  page?: number
  size?: number
}

export interface RoleAttrs {
  name?: string
  value?: string
  label?: string
  permissionIds?: number[]
  menuIds?: number[]
  status?: boolean
}
