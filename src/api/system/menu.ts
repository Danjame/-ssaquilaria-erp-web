import request from '@/utils/request'
import { Menu } from './types/menu'

export const getAllMenus = () => {
  return request<Menu[]>({
    method: 'GET',
    url: '/system/menus'
  })
}

export const getMenusByConditions = (data: number[]) => {
  return request<Menu[]>({
    method: 'POST',
    url: '/system/menus/conditions',
    data
  })
}