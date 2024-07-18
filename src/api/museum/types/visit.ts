export interface Visit {
  id: number
  idNumber: string
  name: string
  phone: string
  total: number
  time: string
}

export interface VisitConditions {
  name?: string
  phone?: string
  page?: number
  size?: number
}
