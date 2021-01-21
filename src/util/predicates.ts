export function isString(s: unknown): s is string {
  return typeof s === 'string'
}
export function isNumber(n: unknown): n is number {
  return typeof n === 'number'
}
