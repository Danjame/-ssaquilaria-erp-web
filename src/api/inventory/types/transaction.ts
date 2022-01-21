import { Product } from './product'

export interface Transaction {
  id: number;
  type: string
  quantity: number;
  price: number;
  amount: number;
  product: Product;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}
