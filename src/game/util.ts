export class Util {
  public static RandomRange(low: number, high: number): number {
    return low + Math.floor(Math.random() * (high - low));
  }

  public static Random(high: number): number {
    return Math.floor(Math.random() * high);
  }

  public static Flatten<T>(x: T[][]): T[] {
    const result: T[] = [];

    for (const a of x) {
      for (const b of a) {
        result.push(b);
      }
    }

    return result;
  }

  public static AssertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
  }
}