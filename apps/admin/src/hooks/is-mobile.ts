import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 判断当前是否为手机页面的 Hook
 * @param {number} [mobileBreakpoint=768] - 移动设备断点宽度（默认768px）
 * @returns {{isMobile: Ref<boolean>, width: Ref<number>, height: Ref<number>}}
 */
export function useIsMobile(mobileBreakpoint = 768) {
  // 响应式引用
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const isMobile = ref(width.value < mobileBreakpoint)

  // 窗口大小变化时更新尺寸和移动设备状态
  const handleResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    isMobile.value = width.value < mobileBreakpoint
  }

  // 监听窗口大小变化
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    // 初始化时立即检查一次
    handleResize()
  })

  // 组件卸载时移除监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  // 提供一个方法用于手动触发检查
  const checkIsMobile = () => {
    handleResize()
  }

  return {
    isMobile,
    width,
    height,
    checkIsMobile,
  }
}
