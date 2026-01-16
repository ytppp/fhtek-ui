import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface TAxiosRequestConfig extends AxiosRequestConfig {
  cancel?: boolean // Whether too cancel duplicate requests
  loading?: boolean // Whether to display loading in progress
  hasToken?: boolean // Whether to add a token to the request header
  toast?: boolean // Whether to display error messages toast
  beforeRequestCallback?: (request: TAxiosRequestConfig) => TAxiosRequestConfig
  beforeResponseCallback?: (response: TAxiosRequestConfig) => TAxiosRequestConfig
}

export interface TAxiosResponseConfig extends AxiosResponse {
  config: TAxiosRequestConfig
}

export interface TAxiosError extends AxiosError {
  config: TAxiosRequestConfig // cover config type
  isCancelRequest?: boolean
}

// 定义API响应类型
interface ApiResponse<T> {
  code: number
  msg: string
  data?: T
}
