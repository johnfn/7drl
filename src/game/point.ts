export interface IPoint {
  x: number;
  y: number;
}

export class Point {
  private _x: number;
  private _y: number;

  public get x(): number { return this._x; }
  public get y(): number { return this._y; }

  public get half(): Point {
    return new Point({ x: this.x / 2, y: this.y / 2 });
  }

  public static Zero: Point = new Point({ x: 0, y: 0 });

  static isPoint(x: any): x is Point {
    return x instanceof Point;
  }

  constructor(props: { x: number, y: number }) {
    this._x = props.x;
    this._y = props.y;
  }

  toString(): string {
    return `[${ this.x }, ${ this.y }]`;
  }

  invert(): Point {
    return new Point({
      x: -this.x,
      y: -this.y,
    });
  }

  round(): Point {
    return new Point({
      x: Math.round(this.x),
      y: Math.round(this.y),
    });
  }

  floor(): Point {
    return new Point({
      x: Math.floor(this.x),
      y: Math.floor(this.y),
    });
  }

  translate(p: { x: number, y: number }): Point {
    return new Point({
      x: this.x + p.x,
      y: this.y + p.y,
    });
  }

  subtract(p: { x: number, y: number }): Point {
    return new Point({
      x: this.x - p.x,
      y: this.y - p.y,
    });
  }

  add(p: { x: number, y: number }): Point {
    return new Point({
      x: this.x + p.x,
      y: this.y + p.y,
    });
  }

  scale(about: { x: number; y: number }, amount: { x: number; y: number }): Point {
    return new Point({
      x: (this.x - about.x) * amount.x + about.x,
      y: (this.y - about.y) * amount.y + about.y,
    });
  }

  rotate(origin: Point, angle: number): Point {
    angle = angle / (180 / Math.PI);

    return new Point({
      x: Math.cos(angle) * (this.x - origin.x) - Math.sin(angle) * (this.y - origin.y) + origin.x,
      y: Math.sin(angle) * (this.x - origin.x) + Math.cos(angle) * (this.y - origin.y) + origin.y,
    });
  }

  equals(other: Point | undefined): boolean {
    if (other === undefined) { return false; }

    return this.x === other.x && this.y === other.y;
  }

  multiply(other: Point | number): Point {
    if (typeof other === "number") {
      return new Point({
        x: this.x * other,
        y: this.y * other,
      });
    } else {
      return new Point({
        x: this.x * other.x,
        y: this.y * other.y,
      });
    }
  }

  divide(other: Point | number): Point {
    if (typeof other === "number") {
      return new Point({
        x: this.x / other,
        y: this.y / other,
      });
    } else {
      return new Point({
        x: this.x / other.x,
        y: this.y / other.y,
      });
    }
  }

  toJSON(): any {
    return {
      x: this.x,
      y: this.y,
      reviver: "Point",
    }
  }

  transform(trans: Point, scale: number): Point {
    return new Point({
      x: Math.floor((this.x - trans.x) * scale),
      y: Math.floor((this.y - trans.y) * scale),
    });
  }

  static Deserialize(obj: any): Point {
    if (!obj.hasOwnProperty("x") || !obj.hasOwnProperty("y")) {
      console.error("Failed deserializing point");
    }

    return new Point({
      x: obj.x,
      y: obj.y,
    });
  }

  static Serialize(obj: Point): string {
    return JSON.stringify({ x: obj.x, y: obj.y });
  }
}