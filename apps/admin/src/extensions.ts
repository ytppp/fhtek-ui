// 扩展 String 原型，添加 format 方法
if (!String.prototype.format) {
  // 防止重复挂载，避免覆盖
  String.prototype.format = function (...args: string[]) {
    if (typeof this !== 'string') {
      throw new TypeError('format 方法只能在字符串上调用')
    }

    const placeholderReg = /%[abcdefghnostx]/
    let result = this.toString()

    for (const val of args) {
      const newResult = result.replace(placeholderReg, val)
      if (newResult === result) break // 无占位符时提前退出，提升性能
      result = newResult
    }

    return result
  }
}
