import { onUnmounted } from 'vue'
/**
 * 创建一个倒计时器，支持自定义超时时间、间隔时间以及倒计时进行中和结束时的回调函数。
 *
 * @param {number} timeout - 倒计时的总时间（毫秒）。如果设置为 -1，则表示无限倒计时。
 * @param {number} interval - 倒计时的间隔时间（毫秒）。
 * @param {(countdown: number) => void} [doingHandle] - 倒计时进行时的回调函数，接收当前剩余时间作为参数。
 * @param {() => void} [doneHandle] - 倒计时结束时的回调函数。
 *
 * @returns {{ createCountDown: () => void; cleanCountDown: () => void }} - 一个对象，包含启动倒计时和清除倒计时的方法。
 */
export const useCountDown = (
  timeout: number,
  interval: number,
  doingHandle?: (countdown: number) => void,
  doneHandle?: () => void,
) => {
  let timer: number | null = null
  const createCountDown = () => {
    if (timer !== null) {
      return
    }
    let countdown: number = timeout !== -1 ? timeout : 0
    // 先执行一次
    if (doingHandle) {
      doingHandle(countdown)
    }
    timer = setInterval(() => {
      if (!countdown && timeout !== -1) {
        cleanCountDown()
        return
      }
      if (timeout !== -1) countdown -= interval
      if (doingHandle) {
        doingHandle(countdown)
      }
    }, interval)
  }
  const cleanCountDown = () => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
      if (doneHandle) {
        doneHandle()
      }
    }
  }
  onUnmounted(() => {
    cleanCountDown()
  })
  return {
    createCountDown,
    cleanCountDown,
  }
}
