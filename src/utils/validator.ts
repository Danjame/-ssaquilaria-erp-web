export const intValidator = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error('数量不能为空'))
  if (!Number.isInteger(value)) callback(new Error('数量必须为整数'))
  callback()
}