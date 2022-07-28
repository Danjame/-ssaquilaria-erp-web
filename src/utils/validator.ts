export const validateQty = (rule: any, value: any, callback: any) => {
  if (value === null || value === undefined) callback(new Error('数量不能为空'))
  if (!Number.isInteger(value)) callback(new Error('数量必须为整数'))
  callback()
}

export const validatePositionX = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error('行不能为空'))
  if (!Number.isInteger(value)) callback(new Error('行必须为整数'))
  callback()
}

export const validatePositionY = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error('列不能为空'))
  if (!Number.isInteger(value)) callback(new Error('列必须为整数'))
  callback()
}
