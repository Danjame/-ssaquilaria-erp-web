import request from '@/utils/request'
import { Rank, RankAttrs, RankConditions } from './types/rank'
import { PageResult } from '../types'

export const getAllRanks = () => {
  return request<Rank[]>({
    method: 'GET',
    url: '/manufacture/ranks'
  })
}

export const getRanksByConditions = (params?: RankConditions) => {
  return request<PageResult<Rank>>({
    method: 'GET',
    url: '/manufacture/ranks/by-conditions',
    params
  })
}

export const deleteRank = (id: number) => {
  return request<Rank>({
    method: 'DELETE',
    url: `/manufacture/ranks/${id}`
  })
}

export const getRankById = (id: number) => {
  return request<Rank>({
    method: 'GET',
    url: `/manufacture/ranks/${id}`
  })
}

export const createRank = (data: RankAttrs) => {
  return request<Rank>({
    method: 'POST',
    url: '/manufacture/ranks',
    data
  })
}

export const updateRank = (id: number, data: RankAttrs) => {
  return request<Rank>({
    method: 'PATCH',
    url: `/manufacture/ranks/${id}`,
    data
  })
}
