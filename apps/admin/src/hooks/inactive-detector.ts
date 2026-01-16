import { onMounted, onUnmounted, type Ref, ref } from 'vue'

// 定义可监听的事件类型
type ActiveEventType =
  | 'mousemove'
  | 'click'
  | 'keydown'
  | 'touchstart'
  | 'scroll'
  | 'drag'
  | 'input'

// 钩子函数的参数类型
interface UseInactiveDetectorOptions {
  // 超时时间(毫秒)，默认10秒
  timeout?: number
  // 需要监听的事件列表，默认包含常用事件
  events?: ActiveEventType[]
}

// 钩子函数返回类型
interface InactiveDetectorResult {
  // 当前是否处于闲置状态
  isInactive: Ref<boolean>
  // 手动重置计时器的方法
  reset: () => void
}

/**
 * 检测用户无操作的Vue钩子函数
 * @param onInactive 超时后触发的回调函数
 * @param options 配置选项，包括超时时间和监听事件
 * @returns 包含当前状态和重置方法的对象
 */
export function useInactiveDetector(
  onInactive: () => void,
  options: UseInactiveDetectorOptions = {},
): InactiveDetectorResult {
  const {
    timeout = 10 * 1000,
    events = ['mousemove', 'click', 'keydown', 'touchstart', 'scroll', 'drag', 'input'],
  } = options

  // 存储计时器ID
  let timeoutId: number | null = null
  // 记录当前是否处于闲置状态
  const isInactive = ref<boolean>(false)

  /**
   * 重置计时器
   */
  const resetTimer = (): void => {
    if (isInactive.value) return

    // 清除已有的计时器
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }

    onInactive()
    isInactive.value = true

    // 设置新的计时器
    timeoutId = window.setTimeout(() => {
      isInactive.value = false
    }, timeout)
  }

  /**
   * 事件监听器：调用重置计时器
   */
  const handleEvent = (): void => {
    resetTimer()
  }

  // 组件挂载时设置事件监听和初始计时器
  onMounted(() => {
    events.forEach((event) => {
      window.addEventListener(event, handleEvent)
    })
    resetTimer()
  })

  // 组件卸载时清除事件监听和计时器
  onUnmounted(() => {
    events.forEach((event) => {
      window.removeEventListener(event, handleEvent)
    })
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }
  })

  return {
    isInactive,
    reset: resetTimer,
  }
}
