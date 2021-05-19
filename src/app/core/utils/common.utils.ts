export function convertNumberToPercent(value: number, toFixed = 0): number {
  return Number(Math.round(value * 100).toFixed(toFixed));
}
