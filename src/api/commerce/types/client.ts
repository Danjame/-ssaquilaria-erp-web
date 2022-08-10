import { Commodity } from './commodity'

export interface Client {
  id: number
  openid: string
  nickname: string
  name: string
  gender: number
  phone: string
  avatar: string
  commodities: Commodity[]
  createdAt: Date
  updatedAt: Date
}

export interface ClientConditions {
  name?: number
  phone?: number
  page?: number
  size?: number
}

export interface ClientAttrs {
  name?: number
  phone?: number
}
