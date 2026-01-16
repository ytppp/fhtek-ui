declare module '@/util/tool' {
  // IP 类型定义
  export type IPType = 'IPv4' | 'IPv6' | 'mix'

  // 网络数据格式定义
  export interface NetworkData {
    value: string
    unit: string
  }

  // 文件类型定义
  export interface File {
    name: string
  }

  // 导出的常量
  export const specialChar: string
  export const invalidChar: string

  // 函数声明
  export function getLangUsed(lang?: string): string | null
  export function scrollTo(el: HTMLElement, x?: number, y?: number): void
  export function getIpBefore(ip: string): string
  export function getIpAfter(ip: string): string
  export function mergeOptions<T, U>(opt1: T, opt2: U): T & U
  export function isObjArrHasVal<T extends Record<string, any>>(
    arr: T[],
    val: any,
    childNodeName?: string,
    keyName?: string,
  ): boolean
  export function isMobileDevice(width?: number): boolean
  export function setFavicon(favicon: string): void
  export function setDocTitle(title: string): void
  export function getPublicFile(url: string): string
  export function isValidLength(value: string, min?: number, max?: number): boolean
  export function isValidSymbol(value: string, ruleReg?: RegExp): boolean
  export function isInvalidSymbol(value: string, ruleReg?: RegExp): boolean
  export function getStringByte(str: string): number
  export function getFileExtendName(file?: File): string
  export function isIP(ip?: string, type?: IPType): boolean
  export function ip2int(ip: string): number
  export function isMulticast(ip: string): boolean
  export function isLoopback(ip: string): boolean
  export function isPrivateIP(ip: string): boolean
  export function isNetworkIP(ip: string, mask?: string): boolean
  export function isBoardcastIP(ip: string, mask?: string): boolean
  export const isValidGatewayIP: (ip: string, mask: string) => boolean
  export function getSubNetwork(hostIP: string, mask: string): number
  export const format: (str: string, args: any[]) => string
  export function isValidDns(value: string): boolean
  export function isValidMask(ip: string): boolean
  export function isValidNameEx(name: string): boolean
  export function validationCharacterRange(val: string, minLen?: number, maxLen?: number): boolean
  export function tranSimIpv6ToFullIpv6(simpeIpv6: string): string
  export function isValidIpv6AddrExtra(value: string): boolean
  export function isValidIpv6Dns(value: string): boolean
  export const isReal: (value: any) => boolean
  export function isValidInteger(value: any, min?: number, max?: number): boolean
  export function isValidVal(val: string, minLen?: number, maxLen?: number): boolean
  export function isValidName(name: string): boolean
  export function isObjExistVal<T extends Record<string, any>>(obj: T, val: any): boolean
  export function isValidDomain(value: string, flag?: boolean): boolean
  export const isMac: (mac: string) => boolean
  export function isValidUrlName(url: string): boolean
  export function isValidUnixPath(path: string): boolean
  export const formatDuration: (value: number) => number[]
  export function cidrToSubnetMask(prefixLength: number): string | false
  export const formatNetworkData: (value: number) => NetworkData
  export const handleLogout: (isLogout?: boolean) => void
  export const successTips: (msg?: string) => void
  export const search: <T extends string[][]>(database: T, searchVal: string) => T
  export const findObjectsWithValue: <T extends Record<string, any>>(
    database: T[],
    searchVal: any,
  ) => T[]
  export function isValidStaticRouteMask(ip: string, mask: string): boolean
  export function isHexadecimal(input: any): boolean
}
