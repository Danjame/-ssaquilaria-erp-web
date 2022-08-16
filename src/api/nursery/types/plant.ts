export interface Plant {
  id: number
  name: string
  unit: string
  quantity: number
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface PlantConditions {
  name?: string
  page?: number
  size?: number
}

export interface PlantAttrs {
  name: string
  unit: string
  quantity: number
  remark?: string
}
