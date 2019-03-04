import { Point } from "./point"

export class Line {
  private _x1: number;
  private _x2: number;
  private _y1: number;
  private _y2: number;

  public get x1(): number { return this._x1; }
  public get x2(): number { return this._x2; }
  public get y1(): number { return this._y1; }
  public get y2(): number { return this._y2; }

  public get start(): Point { return new Point({ x: this.x1, y: this.y1 }); }
  public get end()  : Point { return new Point({ x: this.x2, y: this.y2 }); }

  public get angleInDegrees(): number {
    const cx = this._x1;
    const cy = this._y1;

    const ex = this._x2;
    const ey = this._y2;

    const dy = ey - cy;
    const dx = ex - cx;
    let theta = Math.atan2(dy, dx);

    theta *= 180 / Math.PI;

    if (theta < 0) {
      theta = 360 + theta;
    }

    return theta;
  }

  public serialized: string = "";

  constructor(props: { x1: number, x2: number, y1: number, y2: number } |
                     { one: Point, two: Point }) {
    let x1, x2, y1, y2;

    if (typeof (props as any).x1 !== "undefined") {
      const p = props as { x1: number, x2: number, y1: number, y2: number };

      x1 = p.x1;
      x2 = p.x2;
      y1 = p.y1;
      y2 = p.y2;
    } else {
      const p = props as { one: Point, two: Point };

      x1 = p.one.x;
      x2 = p.two.x;
      y1 = p.one.y;
      y2 = p.two.y;
    }

    if (x1 === x2 || y1 === y2) {
      this._x1 = Math.min(x1, x2);
      this._x2 = Math.max(x1, x2);
      this._y1 = Math.min(y1, y2);
      this._y2 = Math.max(y1, y2);
    } else {
      this._x1 = x1;
      this._y1 = y1;
      this._x2 = x2;
      this._y2 = y2;
    }

    this.serialized = `${ this.x1 }|${ this.x2 }|${ this.y1 }|${ this.y2 }`;
  }

  public get length(): number {
    return Math.sqrt(
      (this.x2 - this.x1) * (this.x2 - this.x1) +
      (this.y2 - this.y1) * (this.y2 - this.y1)
    );
  }

  public get isDegenerate(): boolean {
    return this.length === 0;
  }

  public rotateAbout(origin: Point, angle: number): Line {
    const start = this.start;
    const end = this.end;

    return new Line({
      one: start.rotate(origin, angle),
      two: end.rotate(origin, angle),
    });
  }

  public scaleAbout(about: Point, amount: Point): Line {
    return new Line({
      one: this.start.scale(about, amount),
      two: this.end.scale(about, amount),
    });
  }

  sharesAVertexWith(other: Line): boolean {
    return (
      (this.x1 === other.x1 && this.y1 === other.y1) ||
      (this.x1 === other.x2 && this.y1 === other.y2) ||
      (this.x2 === other.x1 && this.y2 === other.y1) ||
      (this.x2 === other.x2 && this.y2 === other.y2)
    );
  }

  static DeserializeLine(s: string): Line {
    const [ x1, x2, y1, y2 ] = s.split("|").map(x => Number(x));

    return new Line({ x1, x2, y1, y2 });
  }

  // Must be horizontally/vertically oriented lines
  // Does not consider intersection, only overlap
  getOverlap(other: Line): Line | undefined {
    const orientedByX = (
      this.x1 === this.x2 &&
      this.x1 === other.x1 &&
      this.x1 === other.x2
    );

    const orientedByY = (
      this.y1 === this.y2 &&
      this.y1 === other.y1 &&
      this.y1 === other.y2
    );

    if (!orientedByX && !orientedByY) { return undefined; }

    const summedLength  = this.length + other.length;
    const overallLength = new Line({
      x1: Math.min(this.x1, other.x1),
      y1: Math.min(this.y1, other.y1),
      x2: Math.max(this.x2, other.x2),
      y2: Math.max(this.y2, other.y2),
    }).length;

    if (overallLength >= summedLength) {
      // These lines do not overlap.

      return undefined;
    }

    if (orientedByX) {
      return new Line({
        x1: this.x1,
        x2: this.x2,
        y1: Math.max(this.y1, other.y1),
        y2: Math.min(this.y2, other.y2),
      });
    } else /* if (orientedByY) */ {
      return new Line({
        y1: this.y1,
        y2: this.y2,
        x1: Math.max(this.x1, other.x1),
        x2: Math.min(this.x2, other.x2),
      });
    }
  }

  // A----B----C----D
  // AD - BC returns AB and CD.
  getNonOverlappingSections(other: Line): Line[] | undefined {
    const orientedByX = (
      this.x1 === this.x2 &&
      this.x1 === other.x1 &&
      this.x1 === other.x2
    );

    const orientedByY = (
      this.y1 === this.y2 &&
      this.y1 === other.y1 &&
      this.y1 === other.y2
    );

    if (!orientedByX && !orientedByY) { return undefined; }

    const summedLength  = new Line(this).length + new Line(other).length;
    const overallLength = new Line({
      x1: Math.min(this.x1, other.x1),
      y1: Math.min(this.y1, other.y1),
      x2: Math.max(this.x1, other.x1),
      y2: Math.max(this.y1, other.y1),
    }).length;

    if (overallLength >= summedLength) {
      // These lines do not overlap.

      return undefined;
    }

    if (orientedByX) {
      return [
        new Line({ x1: this.x1, x2: this.x2, y1: Math.min(this.y1, other.y1), y2: Math.max(this.y1, other.y1), }),
        new Line({ x1: this.x1, x2: this.x2, y1: Math.min(this.y2, other.y2), y2: Math.max(this.y2, other.y2), }),
      ].filter(l => !l.isDegenerate);
    } else /* if (orientedByY) */ {
      return [
        new Line({ y1: this.y1, y2: this.y2, x1: Math.min(this.x1, other.x1), x2: Math.max(this.x1, other.x1), }),
        new Line({ y1: this.y1, y2: this.y2, x1: Math.min(this.x2, other.x2), x2: Math.max(this.x2, other.x2), }),
      ].filter(l => !l.isDegenerate);
    }
  }

  clone(): Line {
    return new Line({ x1: this.x1, x2: this.x2, y1: this.y1, y2: this.y2 });
  }

  translate(p: Point): Line {
    return new Line({
      x1: this.x1 + p.x,
      x2: this.x2 + p.x,

      y1: this.y1 + p.y,
      y2: this.y2 + p.y,
    });
  }

  transform(trans: Point, scale: number): Line {
    return new Line({
      one: this.start.transform(trans, scale),
      two: this.end.transform(trans, scale),
    });
  }

  toJSON(): any {
    return {
      x1     : this.x1,
      x2     : this.x2,
      y1     : this.y1,
      y2     : this.y2,
      reviver: "Line",
    };
  }

  static Deserialize(obj: any): Line {
    if (
      !obj.hasOwnProperty("x1") ||
      !obj.hasOwnProperty("y1") ||
      !obj.hasOwnProperty("x2") ||
      !obj.hasOwnProperty("y2")) {

      console.error("Failed deserializing Rect");
    }

    return new Line({
      x1: obj.x1,
      y1: obj.y1,
      x2: obj.x2,
      y2: obj.y2,
    });
  }

  static Serialize(obj: Line): string {
    return JSON.stringify({
      x1: obj.x1,
      y1: obj.y1,
      x2: obj.x2,
      y2: obj.y2,
    });
  }
}