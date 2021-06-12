const SMOOTHING = 0.05;

export class SvgPathUtils {
  public static bezierCommand(
    point: number[],
    i: number,
    a: number[][]
  ): string {
    const [cpsX, cpsY] = SvgPathUtils._controlPoint(a[i - 1], a[i - 2], point);
    const [cpeX, cpeY] = SvgPathUtils._controlPoint(
      point,
      a[i - 1],
      a[i + 1],
      true
    );

    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
  }

  private static _line(
    pointA: number[],
    pointB: number[]
  ): { length: number; angle: number } {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];

    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  }

  private static _controlPoint(
    current: number[],
    previous: number[],
    next: number[],
    reverse: boolean = false
  ): number[] {
    const p = previous || current;
    const n = next || current;
    const o = SvgPathUtils._line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * SMOOTHING;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;

    return [x, y];
  }
}
