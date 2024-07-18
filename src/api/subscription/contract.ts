import request from '@/utils/request'
import { PageResult } from '../types'
import { Contract, ContractAttrs, ContractConditions } from './types/contract'

export const getAllContracts = () => {
  return request<Contract[]>({
    method: 'GET',
    url: '/subscription/contracts'
  })
}

export const getContractsByConditions = (params?: ContractConditions) => {
  return request<PageResult<Contract>>({
    method: 'GET',
    url: '/subscription/contracts/by-conditions',
    params
  })
}

export const deleteContract = (id: number) => {
  return request<Contract>({
    method: 'DELETE',
    url: `/subscription/contracts/${id}`
  })
}

export const getContractById = (id: number) => {
  return request<Contract>({
    method: 'GET',
    url: `/subscription/contracts/${id}`
  })
}

export const createContract = (data: ContractAttrs) => {
  return request<Contract>({
    method: 'POST',
    url: '/subscription/contracts',
    data
  })
}

export const updateContract = (id: number, data: ContractAttrs) => {
  return request<Contract>({
    method: 'PATCH',
    url: `/subscription/contracts/${id}`,
    data
  })
}
