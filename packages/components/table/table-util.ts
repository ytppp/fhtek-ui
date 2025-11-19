/**
 * 从多维对象数组中提取指定维度的数据
 * @param {Array} array - 多维对象数组
 * @param {number} targetDepth - 目标维度（从0开始）
 * @param {string} childrenKey - 包含子数组的属性名（默认为'children'）
 * @returns {Array} 包含指定维度所有元素的数组（不包含子维度）
 */
export function extractDimension(array: any[], targetDepth: number, childrenKey = 'children') {
  // 参数验证
  if (!Array.isArray(array)) {
    throw new TypeError('第一个参数必须是数组')
  }

  if (typeof targetDepth !== 'number' || targetDepth < 0) {
    throw new TypeError('目标维度必须是非负整数')
  }

  if (typeof childrenKey !== 'string') {
    throw new TypeError('子维度键名必须是字符串')
  }

  const result: any[] = []

  /**
   * 递归遍历多维数组
   * @param {Array} currentArray - 当前处理的数组
   * @param {number} currentDepth - 当前深度
   */
  function traverse(currentArray: any[], currentDepth: number) {
    for (const item of currentArray) {
      // 检查是否是对象（处理对象数组）
      const isObject = item !== null && typeof item === 'object' && !Array.isArray(item)

      if (currentDepth === targetDepth) {
        // 到达目标维度，提取数据

        // 克隆对象，排除子维度
        if (isObject) {
          const clonedItem = { ...item }
          result.push(clonedItem)
        } else {
          // 非对象元素直接添加
          result.push(item)
        }
      } else if (isObject && item[childrenKey] && Array.isArray(item[childrenKey])) {
        // 继续遍历子维度
        traverse(item[childrenKey], currentDepth + 1)
      }
    }
  }

  traverse(array, 0)
  return result
}
/**
 * 将嵌套的列数组扁平化，将所有子列提取到一个一维数组中。
 * @param {Array} columns - 包含嵌套列对象的数组，每个列对象可能包含 `children` 属性，该属性是一个子列数组。
 * @returns {Array} - 扁平化后的一维列数组。
 */
export function flatten(columns: any[]): Array<any> {
  return columns.reduce((acc: any[], col: any) => {
    if (Array.isArray(col.children) && col.children.length > 0) {
      return [...acc, ...flatten(col.children)]
    }
    return [...acc, col]
  }, [])
}

/**
 * 查找对象数组中包含特定值的所有对象
 * @param {Array} database - 要搜索的对象数组
 * @param {*} searchVal - 要查找的值
 * @returns {Array} 包含该值的所有对象组成的数组
 */
export const findObjectsWithValue = (database: any[], searchVal: any) => {
  if (!Array.isArray(database)) {
    return []
  }

  if (searchVal === undefined || searchVal === null || !searchVal) {
    return database
  }

  return database.filter((obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null || obj[key] === undefined) {
          continue
        }
        if (obj[key].toString().toLowerCase().includes(searchVal.toString().toLowerCase())) {
          return true
        }
      }
    }
    return false
  })
}
