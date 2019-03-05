/** 
 * Drop in replacement for Map that actually takes a reasonable stab at doing
 * deep object equality for key comparisons
 */
export class GoodMap<K, V> {
  private map: Map<string, V>;

  constructor() {
    this.map = new Map();
  }

  public get(key: K): V | undefined {
    return this.map.get(JSON.stringify(key));
  }

  public has(key: K): boolean {
    return this.map.has(JSON.stringify(key));
  }

  public set(key: K, val: V): GoodMap<K, V> {
    this.map.set(JSON.stringify(key), val);

    return this;
  }
}