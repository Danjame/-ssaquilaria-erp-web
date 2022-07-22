import request from '@/utils/request'
import { Rank, RankAttrs, RankConditions } from './types/rank'
import { PageResult } from '../types'

export const getAllRanks = () => {
  return request<Rank[]>({
    method: 'GET',
    url: '/inventory/ranks'
  })
}

export const getRanksByConditions = (params?: RankConditions) => {
  return request<PageResult<Rank>>({
    method: 'GET',
    url: '/inventory/ranks/by-conditions',
    params
  })
}

export const deleteRank = (id: number) => {
  return request<Rank>({
    method: 'DELETE',
    url: `/inventory/ranks/${id}`
  })
}

export const getRankById = (id: number) => {
  return request<Rank>({
    method: 'GET',
    url: `/inventory/ranks/${id}`
  })
}

export const createRank = (data: RankAttrs) => {
  return request<Rank>({
    method: 'POST',
    url: '/inventory/ranks',
    data
  })
}

export const updateRank = (id: number, data: RankAttrs) => {
  return request<Rank>({
    method: 'PATCH',
    url: `/inventory/ranks/${id}`,
    data
  })
}
