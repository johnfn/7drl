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

  public static minBy<T>(list: T[], fn: (T: T) => number): T | undefined {
    let lowestT    : T      | undefined = undefined;
    let lowestValue: number | undefined = undefined;

    for (const item of list) {
      const value = fn(item);

      if (lowestValue === undefined || value < lowestValue) {
        lowestT = item;
        lowestValue = value;
      }
    }

    return lowestT;
  }

  public static maxBy<T>(list: T[], fn: (T: T) => number): T | undefined {
    let highestT    : T      | undefined = undefined;
    let highestValue: number | undefined = undefined;

    for (const item of list) {
      const value = fn(item);

      if (highestValue === undefined || value > highestValue) {
        highestT = item;
        highestValue = value;
      }
    }

    return highestT;
  }
}