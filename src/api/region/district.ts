import request from '@/utils/request'
import { District } from './types/district'

export const getDistrictsByCity = (cityCode: number) => {
  return request<District[]>({
    method: 'GET',
    url: '/region/districts',
    params: {
      cityCode
    }
  })
}
