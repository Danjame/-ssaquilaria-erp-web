export interface PageResult<T> {
  results: T[]
  size: number
  page: number
  count: number
}
