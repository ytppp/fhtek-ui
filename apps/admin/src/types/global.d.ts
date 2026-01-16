import { WifiVersion } from '../util/constant'

declare global {
  /**
   * 字符串格式化方法，替换字符串中的占位符（%a/%b/%c.../%x）
   * @param args 要替换占位符的字符串参数列表
   * @returns 格式化后的新字符串
   */
  interface String {
    // 定义方法名和类型（入参、返回值）
    format(...args: string[]): string
  }
}
