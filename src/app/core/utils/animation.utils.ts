const ONE_HUNDRED = 100;

export function getSlideTransform(
  currentValue: number,
  maxValue: number,
  maxPercent: number = ONE_HUNDRED
): { transform: string } {
  return {
    transform:
      'translateY(' +
      Number((1 - maxValue) * maxPercent + (currentValue - 1) * maxPercent) +
      '%)',
  };
}
