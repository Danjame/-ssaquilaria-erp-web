import { User } from './system/types/user'
import { Role } from './system/types/role'
import { Permission } from './system/types/permission'
import { Category } from './inventory/types/category'
import { Unit } from './inventory/types/unit'
import { Product } from './inventory/types/product'
import { Purchase } from './inventory/types/purchase'
import { Sale } from './inventory/types/sale'
import { Supplier } from './inventory/types/supplier'
import { Farm } from './forest/types/farm'
import { Area } from './forest/types/area'
import { OperType } from './forest/types/opertype'
import { OperItem } from './forest/types/operitem'
import { Tree } from './forest/types/tree'
import { Record } from './forest/types/record'
import { Task } from './forest/types/task'
import { Department } from './organization/types/department'

export interface PageResult {
  results: User[] | Role[] | Permission[] | Department[] | Category[] | Unit[] | Product[] | Purchase[] | Sale[] | Supplier[] | Farm[] | Area[] | OperType[] | OperItem[] | Tree[] | Record[] | Task[]
  size: number
  page: number
  count: number
}
