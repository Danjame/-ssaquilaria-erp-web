export interface Permission {
  id: number
  name: string
  label: string
  url: string
  method: string
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface PermissionConditions {
  name?: string
  label?: string
  page?: number
  size?: number
}

export interface PermissionAttrs {
  name?: string
  label?: string
  url?: string
  method?: string
  remark?: string
}
