import request from '@/utils/request'
import { Tree, TreeAttrs, TreeConditions } from './types/tree'
import { PageResult } from '../types'

export const getTreesByConditions = (params?: TreeConditions) => {
  return request<PageResult<Tree>>({
    method: 'GET',
    url: '/forest/trees/by-conditions',
    params
  })
}

export const deleteTree = (id: number) => {
  return request<Tree>({
    method: 'DELETE',
    url: `/forest/trees/${id}`
  })
}

export const getTreeById = (id: number) => {
  return request<Tree>({
    method: 'GET',
    url: `/forest/trees/${id}`
  })
}

export const createTree = (data: TreeAttrs) => {
  return request<Tree>({
    method: 'POST',
    url: '/forest/trees',
    data
  })
}

export const updateTree = (id: number, data: TreeAttrs) => {
  return request<Tree>({
    method: 'PATCH',
    url: `/forest/trees/${id}`,
    data
  })
}

export const replaceTree = (id: number, data: TreeAttrs) => {
  return request<Tree>({
    method: 'POST',
    url: `/forest/trees/${id}`,
    data
  })
}
