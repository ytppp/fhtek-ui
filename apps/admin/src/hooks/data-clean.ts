import { EnableStatus, DefaultVal } from '@/util/constant'

// 修改 `handle` 参数的类型为更具体的函数类型，这里假设 `handle` 没有参数且返回值为 `void`
export const useDataClean = () => {
  const undefinedFlag = 'N/A'
  const defaultVal = DefaultVal
  const cleanData = (obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefinedFlag) {
        obj[key] = ''
      }
    })
  }
  const defaultDataObj = (info, thisInfoKey, fn?: (key: string) => {}) => {
    cleanData(info)
    Object.keys(info).forEach((key) => {
      info[key].value = thisInfoKey[key]
        ? `${thisInfoKey[key]} ${info[key].unit || ''}`
        : defaultVal
      if (typeof fn === 'function') {
        fn(key)
      } else {
        info[key].show = true
      }
    })
  }
  const convertBooleanStatus = (flag: string | boolean) => {
    if (typeof flag === 'string') {
      if (flag === EnableStatus.yes || flag === EnableStatus.no) {
        return flag === EnableStatus.yes
      }
      if (flag === '') return false
    }
    if (typeof flag === 'boolean') {
      if (flag) return EnableStatus.yes
      if (!flag) return EnableStatus.no
    }
    // 底层可能传空字符串，这里做兼容处理
    return false
  }
  return {
    undefinedFlag,
    defaultVal,
    cleanData,
    convertBooleanStatus,
    defaultDataObj,
  }
}
