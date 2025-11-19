/**
 * Shallow merges two option objects
 * @template T - The type of the option objects
 * @param {T} opt1 - The first option object
 * @param {T} opt2 - The second option object that overrides properties from opt1
 * @returns {T} - The merged option object
 */
export function shallowMergeOptions<T extends Record<string, any>>(opt1: T, opt2: T): T {
  // Handle null/undefined cases
  if (!opt1) return { ...opt2 } as T
  if (!opt2) return { ...opt1 } as T

  // Shallow merge for simple cases
  return { ...opt1, ...opt2 }
}

export const isReal = (value: number | string) => {
  value = Number(value)
  return value === 0 ? true : !!value
}

export function isValidInteger(value: number | string, min?: number, max?: number) {
  let flag = true
  const reg = /^(\+|-)?[0-9]\d*$/
  const val = Number(value)
  if (!reg.test(value.toString())) {
    flag = false
  }
  if (min && isReal(min) && val < min) {
    flag = false
  }
  if (max && isReal(max) && val > max) {
    flag = false
  }
  return flag
}

export function scrollTo(el: HTMLElement, x = 0, y = 0) {
  if (el.scrollTo) {
    el.scrollTo(x, y)
  } else {
    el.scrollLeft = x
    el.scrollTop = y
  }
}
