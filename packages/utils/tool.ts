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
