export function numZeros(num: number): number {
  if (num >= 0.1) {
    return 0
  }
  return Math.abs(Math.floor(Math.log10(num) + 1))
}

export function round(num: number, decimals = 2): string {
  const mult = Math.pow(10, numZeros(num) + decimals)
  return `${Math.round(num * mult) / mult}`
}

export function array(val) {
  if (!val) {
    return []
  }
  if (!Array.isArray(val)) {
    return [val]
  }
  return val
}
