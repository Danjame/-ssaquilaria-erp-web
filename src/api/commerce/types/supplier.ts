export interface Supplier {
  id: number
  name: string
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface SupplierConditions {
  page?: number
  size?: number
}

export interface SupplierAttrs {
  name: string
  remark?: string
}
