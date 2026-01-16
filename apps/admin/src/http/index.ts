import Axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { defaultConfig } from './config'
import { AxiosCanceler } from './axios-cancel'
import type { TAxiosError, TAxiosRequestConfig, TAxiosResponseConfig } from './type'
import {
  addTokenToHeader,
  checkStatus,
  handleBusinessError,
  handleNetworkError,
  hideLoading,
  showLoading,
} from './tool'

/**
 * @description 请求封装
 * @example
 * const res = await http.get('/api/users')
 * const res = await http.post('/api/users', { name: 'John' })
 * const res = await http.put('/api/users', { name: 'John' })
 * const res = await http.delete('/api/users', { name: 'John' })
 * const res = await http.download('/api/users', { name: 'John' })
 * const res = await http.upload('/api/users', { name: 'John' })
 * @example 取消请求
 * http.cancelRequest('/api/users') // 取消指定URL的请求
 * http.cancelAllRequests() // 取消所有请求
 * http.showLoading() // 显示加载动画
 * http.hideLoading() // 隐藏加载动画
 */

class TRequest {
  // axios instance
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)

  // cancel request instance
  private axioCanceler = new AxiosCanceler()

  constructor() {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  /**
   * @description batch cancel requests
   * @example onUnMount(() => {http.cancelAllRequests()})
   */
  public cancelAllRequests(): void {
    this.axioCanceler.removeAllPending()
  }

  /**
   * @description Cancel the request for the specified URL
   * @param url
   * @example http.cancelRequest('/api/users');
   */
  public cancelRequest(url: string): void {
    this.axioCanceler.removeByUrl(url)
  }

  /** intercept request */
  private httpInterceptorsRequest(): void {
    TRequest.axiosInstance.interceptors.request.use(
      (config: TAxiosRequestConfig): Promise<any> => {
        //1. 针对单个请求的自定义回调
        if (typeof config.beforeRequestCallback === 'function') {
          config = config.beforeRequestCallback(config)
        }
        //2. 显示加载动画
        showLoading(config)
        //3. 添加取消请求
        if (config.cancel) {
          this.axioCanceler.addPending(config)
        }
        //4. 添加token到请求头
        if (config.hasToken) {
          addTokenToHeader(config)
        }
        //5. 请求之前
        return Promise.resolve(config)
      },
      (error: TAxiosError) => {
        const config = error.config
        //6.隐藏loading
        hideLoading(config)
        return Promise.reject(error)
      },
    )
  }

  /** intercept response */
  private httpInterceptorsResponse(): void {
    TRequest.axiosInstance.interceptors.response.use(
      (response: TAxiosResponseConfig) => {
        const { config, data } = response

        // 执行响应前回调
        if (typeof config.beforeResponseCallback === 'function') {
          config.beforeResponseCallback(config)
        }

        // 隐藏加载动画
        hideLoading(config)

        // 处理业务错误
        if (handleBusinessError(response)) {
          return Promise.reject(data)
        }

        // 请求完成后，删除对应的cancelToken
        if (config.cancel) {
          this.axioCanceler.removePending(config)
        }

        // 响应成功
        return response.data
      },
      (error: TAxiosError) => {
        // 响应错误
        const config = error.config

        // 隐藏加载动画
        if (config) {
          hideLoading(config)
        }

        // 请求出错时，也需要删除对应的cancelToken
        if (error.config && error.config.cancel) {
          this.axioCanceler.removePending(error.config)
        }

        // 标记取消请求
        error.isCancelRequest = Axios.isCancel(error)

        // 处理网络错误
        if (!error.isCancelRequest) {
          handleNetworkError(error)
          return Promise.reject(error)
        }

        // 处理HTTP状态码错误
        if (error.response) {
          checkStatus(error)
          return Promise.reject(error)
        }

        // 处理断网情况
        if (!window.navigator.onLine) {
          console.log('网络已断开，请检查网络连接')
          // router.replace('/500')
        }
        return Promise.reject(error)
      },
    )
  }

  /**常用方法封装 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: TAxiosRequestConfig,
  ): Promise<T> {
    return TRequest.axiosInstance.post(url, params, config)
  }

  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: TAxiosRequestConfig,
  ): Promise<T> {
    return TRequest.axiosInstance.get(url, { params, ...config })
  }

  public put<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: TAxiosRequestConfig,
  ): Promise<T> {
    return TRequest.axiosInstance.put(url, params, config)
  }

  public delete<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: TAxiosRequestConfig,
  ): Promise<T> {
    return TRequest.axiosInstance.delete(url, { params, ...config })
  }

  public download<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: TAxiosRequestConfig,
  ): Promise<T> {
    return TRequest.axiosInstance.post(url, params, {
      ...config,
      responseType: 'blob',
    })
  }

  public upload<T>(
    url: string,
    formData: FormData,
    onprogressCallback?,
    config?: TAxiosRequestConfig,
  ): Promise<T> {
    return TRequest.axiosInstance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...((config?.headers as Record<string, unknown>) || {}),
      },
      onUploadProgress: (progressEvent) => {
        onprogressCallback(progressEvent)
      },
    })
  }
}

export const http = new TRequest()
