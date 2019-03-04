export class Util {
  public static RandomRange(low: number, high: number): number {
    return low + Math.floor(Math.random() * (high - low));
  }
}