import { Product } from './product'

export interface Unit {
  id: number;
  name: string;
  description: string;
  products: Product[]
  createdAt: Date;
  updatedAt: Date;
}
