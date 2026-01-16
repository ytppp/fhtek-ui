import { logout } from '@/http/api'
import { router, loginPath } from '@/router/index'
import { IP } from './constant'
import { translate } from '@/i18n/index'
import { toast } from '@fhtek-ui/components'

const domainReg = /^(https?:\/\/)?([\w-]+\.)*([\w-]+\.[a-zA-Z]{2,})(\/\S*)?$/i
const ipReg =
  /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
const ipv6Reg =
  /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
const IPAReg =
  /^10\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/
const IPBReg =
  /^172\.(1[6789]|2[0-9]|3[01])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/
const IPCReg =
  /^192\.168\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/

export function getLangUsed(lang) {
  if (localStorage && localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang')
  }
  return lang
}

export function scrollTo(el, x = 0, y = 0) {
  if (el.scrollTo) {
    el.scrollTo(x, y)
  } else {
    el.scrollLeft = x
    el.scrollTop = y
  }
}

export function getIpBefore(ip) {
  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\./
  return pattern.exec(ip)[0]
}
export function getIpAfter(ip) {
  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\./
  return ip.replace(pattern, '')
}

export function mergeOptions(opt1, opt2) {
  return {
    ...opt1,
    ...opt2,
  }
}

// 对象数组中是否存在某个值
export function isObjArrHasVal(arr, val, childNodeName = 'children', keyName = 'url') {
  return arr.some((item) => {
    if (item[childNodeName]) {
      return isObjArrHasVal(item[childNodeName], val, childNodeName, keyName)
    } else {
      return item[keyName] === val
    }
  })
}

export function isMobileDevice(width = 768) {
  // let isMobileUserAgent = false;
  // const userAgent = navigator.userAgent;
  // const mobileKeywords = [
  //   "Android",
  //   "webOS",
  //   "iPhone",
  //   "iPad",
  //   "iPod",
  //   "BlackBerry",
  //   "Windows Phone"
  // ];
  // const isTouchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // const isMobileScreen = document.body.clientWidth <= width;
  // for (const keyword of mobileKeywords) {
  //   if (userAgent.includes(keyword)) {
  //     isMobileUserAgent = true;
  //     break;
  //   }
  // }

  // return isMobileUserAgent || isTouchSupported || isMobileScreen;
  return document.body.clientWidth <= width
}

export function setFavicon(favicon) {
  const link = document.createElement('link')
  link.rel = 'icon'
  link.href = favicon
  const head = document.getElementsByTagName('head')[0]
  const existingLink = head.querySelector("link[rel*='icon']")
  if (existingLink) {
    head.removeChild(existingLink)
  }
  head.appendChild(link)
}
export function setDocTitle(title) {
  document.title = title
}
export function getPublicFile(url) {
  return new URL(url, import.meta.url).href
}
export function isValidLength(value, min = 8, max = 24) {
  if (!value) {
    return false
  }
  if (value.length < min || value.length > max) {
    return false
  }
  return true
}

export const specialChar = '!#$*+-.=?@_~'
export function isValidSymbol(value, ruleReg = /^[\w!#$*+\-.=?@_~]+$/i) {
  if (!value) {
    return false
  }
  return ruleReg.test(value)
}

export const invalidChar = '$*?[]&!;<>|\\"\''
export function isInvalidSymbol(value, ruleReg = /[\*\?\[\]\$&!;<>\|\\"']/) {
  if (!value) {
    return false
  }
  return ruleReg.test(value)
}

export function getStringByte(str) {
  let total = 0
  /**
   * js默认使用utf-16进行编码，同时codePointAt也会返回的utf-16的码点值
   * 但是存储是路由器，使用的是utf-8的编码方式，所以需要计算为utf-8的字节数
   * 转换的具体方式，通过取每个字符的codePointAt(0)得到该字符的unicode码点(code point)
   * 然后按照utf-8的转换方式去计算utf-8的字节数
   * */

  for (const ch of str) {
    const charCode = ch.codePointAt(0)
    if (charCode <= 0x007f) {
      total += 1
    } else if (charCode <= 0x07ff) {
      total += 2
    } else if (charCode <= 0xffff) {
      total += 3
    } else {
      total += 4
    }
  }

  return total
}

export function getFileExtendName(file) {
  if (file) {
    const r = file.name.split('.')
    if (r.length) {
      return r[r.length - 1]
    }
  }
  return ''
}

export function isIP(ip, type = IP.IPv4) {
  let reg = null
  switch (type) {
    case IP.IPv4:
      reg = ipReg
      break
    case IP.IPv6:
      reg = ipv6Reg
      break
    default:
      reg = ipReg
  }
  return ip && reg.test(ip)
}

export function ip2int(ip) {
  return ip.split('.').reduce((total, next) => (total << 8) + Number(next), 0) >>> 0
}
// 组播地址
export function isMulticast(ip) {
  const i = ip2int(ip)
  if (i >= ip2int('224.0.0.0') && i <= ip2int('239.255.255.255')) {
    return true
  }
  return false
}
// 环回地址
export function isLoopback(ip) {
  const i = ip2int(ip)
  if (i >= ip2int('127.0.0.0') && i <= ip2int('127.255.255.255')) {
    return true
  }
  return false
}
function ipRule(ip, mask) {
  if (!mask || !ip) {
    return true
  }
  if (!isIP(ip) || !isIP(mask)) {
    return false
  }

  if (ip && mask) {
    if (isMulticast(ip) || isLoopback(ip)) {
      return false
    }
    const i = ip2int(ip)
    const m = ~ip2int(mask)
    const reslut = i & m
    if (reslut >= 1 && reslut < m) {
      return true
    }
    return false
  }
  return true
}
function isIPC(ip) {
  return IPCReg.test(ip)
}
// 是否为私有地址
export function isPrivateIP(ip) {
  return IPAReg.test(ip) || IPBReg.test(ip) || isIPC(ip)
}
// 是否为网络地址
// eg:
//  ip: 192.168.110.0 mask: 255.255.255.0 true
//  ip: 192.168.0.0 mask: 255.255.0.0 true
export function isNetworkIP(ip, mask = '255.255.255.0') {
  const bip = ip2int(ip)
  const bmask = ip2int(mask)
  const r = (bip & bmask) >>> 0 // >>>0去掉符号位
  return r === bip
}
// 是否是广播地址
export function isBoardcastIP(ip, mask = '255.255.255.0') {
  const bip = ip2int(ip)
  const bmask = ~ip2int(mask)
  const r = (bip | bmask) >>> 0 // >>>0去掉符号位
  return r === bip
}
// 是否是有效的网关地址
export const isValidGatewayIP = (ip, mask) => {
  const AIPMask = ipRule(ip, mask)
  const BIPMask = ipRule(ip, mask)
  const CIPMask = ipRule(ip, mask)
  return AIPMask || BIPMask || CIPMask
}

export function getSubNetwork(hostIP, mask) {
  return ip2int(hostIP) & ip2int(mask)
}

export const format = function (str, args) {
  args.forEach((val) => {
    str = str.replace(/%[abcdefghnostx]/, val)
  })
  return str
}

export function isValidDns(value) {
  return isIP(value) && !isMulticast(value) && !isLoopback(value) && ip2int(value) != 0
}

export function isValidMask(ip) {
  const i = ip2int(ip).toString(2).padStart(32, '0')
  const result = i.split('10')
  if (result.length !== 2) {
    return false
  }
  // 有效mask
  if (result[0].includes('0') || (result[1] && result[1].includes('1'))) {
    return false
  }
  return true
}

function isNameUnsafeEx(compareChar) {
  if (compareChar.charCodeAt(0) > 32 && compareChar.charCodeAt(0) < 127)
    return false // found no unsafe chars, return false
  else return true
}

export function isValidNameEx(name) {
  let i = 0
  for (i = 0; i < name.length; i++) {
    if (isNameUnsafeEx(name.charAt(i)) == true) return false
  }
  return true
}

export function validationCharacterRange(val, minLen, maxLen) {
  const len = val.trim().length
  if (!len) {
    return false
  }
  if (minLen && len < minLen) {
    return false
  }
  if (maxLen && len > maxLen) {
    return false
  }
  return true
}

// 简化 ipv6 地址转化完整 ipv6 地址
export function tranSimIpv6ToFullIpv6(simpeIpv6) {
  simpeIpv6 = simpeIpv6.toUpperCase()
  // ipv6地址有8段，每段4个字符
  const Ipv6Len = 8,
    Ipv6SectionLen = 4,
    zero = '0'
  const zero4 = ''.padStart(Ipv6SectionLen, zero) // 0000
  const defaultIpv6 = new Array(Ipv6Len).fill(zero4)
  const symbol1 = '::',
    symbol2 = ':'
  const symbol1Len = symbol1.length
  if (simpeIpv6 == symbol1) {
    return defaultIpv6.join(symbol2)
  }
  if (simpeIpv6.startsWith(symbol1)) {
    const tmpArr = simpeIpv6.substring(symbol1Len).split(symbol2)
    for (let i = 0; i < tmpArr.length; i++) {
      defaultIpv6[i + Ipv6Len - tmpArr.length] = (zero4 + tmpArr[i]).slice(-Ipv6SectionLen)
    }
  } else if (simpeIpv6.endsWith(symbol1)) {
    const tmpArr = simpeIpv6.substring(0, simpeIpv6.length - symbol1Len).split(symbol2)
    for (let i = 0; i < tmpArr.length; i++) {
      defaultIpv6[i] = (zero4 + tmpArr[i]).slice(-Ipv6SectionLen)
    }
  } else if (simpeIpv6.indexOf(symbol1) >= 0) {
    const tmpArr = simpeIpv6.split(symbol1)
    const tmpArr0 = tmpArr[0].split(symbol2)
    for (let i = 0; i < tmpArr0.length; i++) {
      defaultIpv6[i] = (zero4 + tmpArr0[i]).slice(-Ipv6SectionLen)
    }
    const tmpArr1 = tmpArr[1].split(symbol2)
    for (let i = 0; i < tmpArr1.length; i++) {
      defaultIpv6[i + Ipv6Len - tmpArr1.length] = (zero4 + tmpArr1[i]).slice(-Ipv6SectionLen)
    }
  } else {
    const tmpArr = simpeIpv6.split(symbol2)
    for (let i = 0; i < tmpArr.length; i++) {
      defaultIpv6[i + Ipv6Len - tmpArr.length] = (zero4 + tmpArr[i]).slice(-Ipv6SectionLen)
    }
  }
  return defaultIpv6.join(symbol2)
}
export function isValidIpv6AddrExtra(value) {
  let flag = true
  const fullAddr = tranSimIpv6ToFullIpv6(value)
  const ipv6OfAll0 = new Array(8).fill(''.padStart(4, '0')).join(':') // Ipv6 address of all '0'
  const ipv6OfAllF = new Array(8).fill(''.padStart(4, 'F')).join(':') // Ipv6 address of all 'F'
  const ipv6End1 = `${new Array(7).fill(''.padStart(4, '0')).join(':')}:0001` // ::1

  if (
    fullAddr.startsWith('FF') ||
    fullAddr.startsWith('FE80') ||
    fullAddr.startsWith('FE90') ||
    fullAddr.startsWith('FEA0') ||
    fullAddr.startsWith('FEB0') ||
    fullAddr.startsWith('FEC0') ||
    fullAddr.startsWith('FECC') ||
    fullAddr.startsWith('FC00') ||
    fullAddr.startsWith('FD00') ||
    fullAddr === ipv6OfAll0 ||
    fullAddr === ipv6OfAllF ||
    fullAddr === ipv6End1
  ) {
    flag = false
  }
  return flag
}
export function isValidIpv6Dns(value) {
  let flag = true
  const fullAddr = tranSimIpv6ToFullIpv6(value)
  const ipv6Ofall0 = new Array(8).fill(''.padStart(4, '0')).join(':') // Ipv6 address of all '0'
  const ipv6OfallF = new Array(8).fill(''.padStart(4, 'F')).join(':') // Ipv6 address of all 'F'
  const ipv6End1 = `${new Array(7).fill(''.padStart(4, '0')).join(':')}:0001` // ::1
  if (
    fullAddr.startsWith('FF') ||
    fullAddr.startsWith('FE90') ||
    fullAddr.startsWith('FEA0') ||
    fullAddr.startsWith('FEB0') ||
    fullAddr.startsWith('FEC0') ||
    fullAddr.startsWith('FECC') ||
    fullAddr.startsWith('FC00') ||
    fullAddr.startsWith('FD00') ||
    fullAddr === ipv6Ofall0 ||
    fullAddr === ipv6OfallF ||
    fullAddr === ipv6End1 ||
    fullAddr === 'FD00::2222'
  ) {
    flag = false
  }
  return flag
}
export const isReal = (value) => {
  value = Number(value)
  return value === 0 ? true : !!value
}
export function isValidInteger(value, min, max) {
  let flag = true
  const reg = /^(\+|-)?[0-9]\d*$/
  const val = Number(value)
  if (!reg.test(value)) {
    flag = false
  }
  if (isReal(min) && val < min) {
    flag = false
  }
  if (isReal(max) && val > max) {
    flag = false
  }
  return flag
}

export function isValidVal(val, minLen, maxLen) {
  const len = val.trim().length
  if (!len) {
    return false
  }
  if (minLen && len < minLen) {
    return false
  }
  if (maxLen && len > maxLen) {
    return false
  }
  return isValidName(val)
}

export function isValidName(name) {
  for (let i = 0; i < name.length; i++) {
    if (isNameUnsafe(name.charAt(i)) == true) {
      return false
    }
  }
  return true
}
function isNameUnsafe(compareChar) {
  // include space
  const unsafeString = '"<>%\\^[]`+$,=\'#&:\t'
  if (
    unsafeString.indexOf(compareChar) == -1 &&
    compareChar.charCodeAt(0) >= 32 &&
    compareChar.charCodeAt(0) < 123
  ) {
    return false // no found unsafe chars, return false
  } else {
    return true
  }
}

export function isObjExistVal(obj, val) {
  return Object.keys(obj).some((key) => obj[key] === val)
}

export function isValidDomain(value, flag = true) {
  // const domainReg = flag
  //   ? /^(https?:\/\/)?([\w-]+\.)*([\w-]+\.[a-zA-Z]{2,})(\/\S*)?$/i
  //   : /^([\w-]+\.)*([\w-]+\.[a-zA-Z]{2,})(\/\S*)?$/i
  const domainReg = flag
    ? /^(https?:\/\/)?(?:(?:[a-zA-Z0-9\u00a1-\uffff](?:[a-zA-Z0-9\u00a1-\uffff-_]{0,61}[a-zA-Z0-9\u00a1-\uffff])?\.)+[a-zA-Z\u00a1-\uffff]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?::\d{1,5})?(\/\S*)?$/
    : /^(?:(?:[a-zA-Z0-9\u00a1-\uffff](?:[a-zA-Z0-9\u00a1-\uffff-_]{0,61}[a-zA-Z0-9\u00a1-\uffff])?\.)+[a-zA-Z\u00a1-\uffff]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?::\d{1,5})?(\/\S*)?$/
  return domainReg.test(value)
}
function isMulticastMac(mac) {
  const number = mac.split(':')[0]
  const result = Number.parseInt(number, 16) & 0x01
  return result === 0x01
}
export const isMac = (mac) => {
  const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/
  return macRegex.test(mac)
  // 检查组播
  // return !isMulticastMac(mac)
}
export function isValidUrlName(url) {
  const invalidArray = ['www', 'com', 'org', 'net', 'edu', 'www.', '.com', '.org', '.net', '.edu']
  if (isValidAscii(url) != '') {
    return false
  }
  if (isValidName(url) == false) {
    return false
  }
  if (url.includes('http://') || url.includes('https://')) {
    return false
  }
  for (let i = 0; i < url.length; i++) {
    if (url.charAt(i) == '\\') {
      return false
    }
  }
  for (let i = 0; i < invalidArray.length; i++) {
    if (url == invalidArray[i]) {
      return false
    }
  }
  return true
}

export function isValidUnixPath(path) {
  // 匹配 Unix 路径（如 /path/to/file 或 ./file）
  // 需要转义的元字符列表： [ ] ( ) { } \ ^ $ | ? * + . /
  // const pattern = /^(?:\/|\.{1,2}\/)?([a-zA-Z0-9_\-]+\/)*[a-zA-Z0-9_\-]*\/?$/ // 原来的
  const pattern = /^(?:\/|\.{1,2}\/)?([^/\s]+\/)*[^/\s]*\/?$/
  return pattern.test(path)
}

export const formatDuration = (value) => {
  const YEAR = 365 // 定义一年有多少天
  const MONTH = 30 // 定义一月有多少天
  const HOUR = 3600 // 定义一小时有多少秒
  const timeArr = []

  const splits = [YEAR * 24 * HOUR, MONTH * 24 * HOUR, 24 * HOUR, HOUR, 60]
  splits.forEach((val) => {
    let duration = 0
    if (value >= val) {
      duration = parseInt(value / val, 10)
      value -= duration * val
    }
    timeArr.push(duration)
  })
  // 添加剩下的秒数
  timeArr.push(value)
  return timeArr
}

export function cidrToSubnetMask(prefixLength) {
  if (typeof prefixLength !== 'number' || prefixLength <= 0 || prefixLength > 32) {
    return false
  }

  let binaryMask = ''
  for (let i = 0; i < 32; i++) {
    binaryMask += i < prefixLength ? '1' : '0'
  }

  const segments = []
  for (let i = 0; i < 4; i++) {
    const start = i * 8
    const end = start + 8
    segments.push(parseInt(binaryMask.substring(start, end), 2))
  }

  return segments.join('.')
}

// 格式化网络数据流量单位，value的初始单位应为B
export const formatNetworkData = (value) => {
  const units = ['KB', 'MB', 'GB', 'TB', 'PB']
  let index = -1
  value = Number(value)
  if (!value) {
    return { value, unit: '' }
  }
  if (!Number.isNaN(value)) {
    do {
      value /= 1024
      index += 1
    } while (value > 1024 && index < units.length - 1)
    return {
      value: value.toFixed(2),
      unit: units[index],
    }
  }
  return { value: '', unit: '' }
}

export const handleLogout = (isLogout = true) => {
  if (isLogout) {
    logout().then(() => {
      sessionStorage.clear()
      router.push(loginPath)
    })
  } else {
    sessionStorage.clear()
    router.push(loginPath)
  }
}

export const successTips = (msg = 'trans0791') => {
  toast({
    duration: 2000,
    text: translate(msg),
    type: 'success',
  })
}

export const search = (database, searchVal) => {
  return database.filter((row) => {
    return row.filter((col) => {
      return col.toLowerCase().includes(searchVal.toLowerCase())
    })
  })
}

/**
 * 查找对象数组中包含特定值的所有对象
 * @param {Array} database - 要搜索的对象数组
 * @param {*} searchVal - 要查找的值
 * @returns {Array} 包含该值的所有对象组成的数组
 */
export const findObjectsWithValue = (database, searchVal) => {
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

export function isValidStaticRouteMask(ip, mask) {
  if (getIpAfter(ip) !== '0' && mask === '255.255.255.255') return true
  if (getIpAfter(ip) === '0' && mask !== '255.255.255.255') return true
  return false
}

export function isHexadecimal(input) {
  const str = typeof input === 'string' ? input : String(input)
  const hexRegex = /^[0-9a-fA-F]+$/
  return hexRegex.test(str)
}
