import { ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * 自定义Hook：用于操作sessionStorage
 * @param key 存储的键名
 * @param initialValue 初始值
 * @returns 包含值、设置值、删除值的对象
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): {
  value: Ref<T>
  setValue: (newValue: T) => void
  removeItem: () => void
} {
  // 从sessionStorage读取数据，如果没有则使用初始值
  const readValue = (): T => {
    // 在SSR环境下不执行
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  }

  // 创建响应式数据
  const value = ref<T>(readValue()) as Ref<T>

  // 当值变化时，同步到sessionStorage
  watch(
    value,
    (newValue) => {
      // 在SSR环境下不执行
      if (typeof window === 'undefined') {
        console.warn(`Tried to update sessionStorage key "${key}" in SSR environment`)
        return
      }

      try {
        // 如果值为undefined，则从sessionStorage中删除
        if (newValue === undefined) {
          window.sessionStorage.removeItem(key)
        } else {
          window.sessionStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    {
      deep: true, // 深度监听，处理对象和数组
    },
  )

  // 手动设置值的方法
  const setValue = (newValue: T) => {
    value.value = newValue
  }

  // 从sessionStorage中删除该项
  const removeItem = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key)
    }
    // value.value = initialValue
  }

  return { value, setValue, removeItem }
}
