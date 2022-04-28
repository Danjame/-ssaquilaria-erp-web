import request from '@/utils/request'
import { Task, TaskAttrs, TaskConditions } from './types/task'
import { PageResult } from '../types'

export const getTaskById = (id: number) => {
  return request<Task>({
    method: 'GET',
    url: `/forest/tasks/${id}`
  })
}

export const getTasksByConditions = (params?: TaskConditions) => {
  return request<PageResult>({
    method: 'GET',
    url: '/forest/tasks/by-conditions',
    params
  })
}

export const updateTask = (id: number, data: TaskAttrs) => {
  return request<Task>({
    method: 'PATCH',
    url: `/forest/tasks/${id}`,
    data
  })
}
