import type { TAxiosRequestConfig } from './type'

export enum ResultEnum {
  SUCCESS = 100,
  ERROR = 500,
  NOAUTH = 10001,
  OVERDUE = 10002,
  INVALIDSESSION = 10003,
  INVALIDJSON = 10004,
  HASLOGIN = 10005,
  INVALIDFILE = 10006,
  LOGIN_3_TIMES_FAILED = 10012,
  VLAN_HAS_EXISTED = 10013,
}

const defaultUrl = '/action'

export const defaultConfig: TAxiosRequestConfig = {
  baseURL: defaultUrl, // import.meta.env.VITE_API_URL || '',
  timeout: 20000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  loading: true, // show loading
  cancel: true, // cancel duplicate requests
  hasToken: false, // Whether to have token
  toast: true, // Whether to display error messages toast
}
