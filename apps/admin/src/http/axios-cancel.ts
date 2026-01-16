import type { TAxiosRequestConfig } from './type'
import qs from 'qs'

// A map to store pending requests
const pendingMap = new Map<string, AbortController>()

// Serialize parameters to ensure consistent object property order
const sortedStringify = (obj: unknown) => {
  if (!obj) return ''
  return qs.stringify(obj, {
    arrayFormat: 'repeat',
    sort: (a, b) => a.localeCompare(b),
  })
}

export class AxiosCanceler {
  // get a pending request
  private getPendingUrl(config: TAxiosRequestConfig) {
    const { url, method, params, data } = config
    return [url, method, sortedStringify(params), sortedStringify(data)].join('&')
  }

  // Add a pending request
  addPending(config: TAxiosRequestConfig) {
    this.removePending(config)
    const url = this.getPendingUrl(config)
    const controller = new AbortController()
    config.signal = controller.signal
    pendingMap.set(url, controller)
  }

  // Remove a pending request
  removePending(config: TAxiosRequestConfig) {
    const url = this.getPendingUrl(config)
    if (pendingMap.has(url)) {
      const controller = pendingMap.get(url)
      if (controller) {
        controller.abort()
        pendingMap.delete(url)
      }
    }
  }

  // Remove all pending requests
  removeAllPending() {
    pendingMap.forEach((controller) => {
      controller.abort()
    })
    pendingMap.clear()
  }

  // Remove pending requests by URL
  removeByUrl(url: string) {
    pendingMap.forEach((controller, pendingUrl) => {
      if (pendingUrl.includes(url)) {
        controller.abort()
        pendingMap.delete(pendingUrl)
      }
    })
  }
}
