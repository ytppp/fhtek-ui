import { ResultEnum } from './config'
import type { TAxiosRequestConfig, TAxiosError } from './type'
import { translate } from '@/i18n/index'
import { toast, loading } from '@fhtek-ui/components'
import { format, handleLogout } from '@/util/tool'

// 获取token
export function getToken(): string {
  return sessionStorage.getItem('token') || ''
}

// 添加token到请求头
export function addTokenToHeader(config: TAxiosRequestConfig): void {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Cookie'] = `-goahead-session-=${token}`
  }
}

// 显示加载动画
export function showLoading(config: TAxiosRequestConfig): void {
  if (config.loading) {
    showFullScreenLoading()
  }
}

// 隐藏加载动画
export function hideLoading(config: TAxiosRequestConfig): void {
  if (config.loading) {
    hideFullScreenLoading()
  }
}

//显示全屏加载
let needLoadingRequestCount = 0

const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

//隐藏全屏加载
const hideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

const startLoading = () => {
  loading.open()
}

//结束loading
const endLoading = () => {
  loading.close()
}

const showToast = (
  message: string,
  configInShowToast: boolean,
  isShowToast: boolean = true,
): void => {
  if (configInShowToast && isShowToast) {
    toast(message)
  }
}

// 处理HTTP状态码
export function checkStatus(error: TAxiosError): void {
  const status = error.response?.status
  let message = translate('trans0681')
  switch (status) {
    case 400:
      message = translate('trans0682')
      break
    case 401:
      message = translate('trans0683')
      // 这里可以处理登出逻辑
      break
    case 403:
      message = translate('trans0684')
      break
    case 404:
      message = translate('trans0685')
      break
    case 408:
      message = translate('trans0686')
      break
    case 500:
      message = translate('trans0687')
      break
    case 501:
      message = translate('trans0688')
      break
    case 502:
      message = translate('trans0689')
      break
    case 503:
      message = translate('trans0690')
      break
    case 504:
      message = translate('trans0691')
      break
    case 505:
      message = translate('trans0692')
      break
    default:
      message = format(translate('trans0693'), [status])
  }
  showToast(message, error.config.toast)
}

// 处理错误信息
export function handleNetworkError(error: TAxiosError): void {
  let message = translate('trans0681')
  if (error.message) {
    if (error.message.includes('timeout')) {
      message = translate('trans0694')
    } else if (error.message.includes('Network Error')) {
      message = translate('trans0695')
    } else {
      message = error.message
    }
  }
  showToast(message, error.config.toast)
}

// 处理业务错误
export function handleBusinessError(response: any): boolean {
  // 如果没有code，说明不是标准响应格式（如二进制流）
  const { data, config } = response
  if (!data || !data.code) {
    return false
  }
  let message = ''
  let flag = true

  // 处理不同的业务状态码
  switch (data.code) {
    case ResultEnum.SUCCESS:
      flag = false
      break
    case ResultEnum.NOAUTH:
      message = translate('trans0696') // data.msg || translate('trans0696')
      showToast(message, config.toast)
      break
    case ResultEnum.OVERDUE:
      message = translate('trans0697') // data.msg || translate('trans0697')
      showToast(message, config.toast, false)
      handleLogout(false)
      break
    case ResultEnum.INVALIDSESSION:
      message = translate('trans0698') // data.msg || translate('trans0698')
      showToast(message, config.toast)
      handleLogout(false)
      break
    case ResultEnum.INVALIDJSON:
      message = translate('trans0699') // data.msg || translate('trans0699')
      showToast(message, config.toast)
      break
    case ResultEnum.HASLOGIN:
      message = translate('trans0012') // data.msg || translate('trans0012')
      showToast(message, config.toast)
      break
    case ResultEnum.INVALIDFILE:
      message = translate('trans0700') // data.msg || translate('trans0700')
      showToast(message, config.toast)
      break
    case ResultEnum.LOGIN_3_TIMES_FAILED:
      message = format(translate('trans0011'), [3]) // data.msg || translate('trans0700')
      showToast(message, config.toast)
      break
    case ResultEnum.VLAN_HAS_EXISTED:
      message = translate('trans0952') // data.msg || translate('trans0952')
      showToast(message, config.toast)
      break
    default:
      message = translate('trans0701') // data.msg || translate('trans0701')
      showToast(message, config.toast)
  }
  return flag
}
