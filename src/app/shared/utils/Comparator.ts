/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class Comparator {
  /**
   *
   *
   * @param [compareFunction]
   */
  constructor(compareFunction: (a: number, b: number) => number) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  public compare: any;

  /**
   *
   *
   * @param a
   * @param b
   * @returns
   */
  public static defaultCompareFunction(a: number, b: number): number {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  public equal(a: any, b: any) {
    return this.compare(a, b) === 0;
  }

  public lessThan(a: any, b: any) {
    return this.compare(a, b) < 0;
  }

  public greaterThan(a: any, b: any) {
    return this.compare(a, b) > 0;
  }

  public lessThanOrEqual(a: any, b: any) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  public greaterThanOrEqual(a: any, b: any) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  public reverse() {
    const compareOriginal = this.compare;

    this.compare = (a: any, b: any) => compareOriginal(b, a);
  }
}
