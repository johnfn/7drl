import { Line } from './line';
import { Point, IPoint } from "./point";

export class Rect {
  private _x: number;
  private _y: number;
  private _w: number;
  private _h: number;

  public get x(): number { return this._x; }
  public get y(): number { return this._y; }

  public get w(): number { return this._w; }
  public get h(): number { return this._h; }

  public get centerX(): number { return this._x + this._w / 2; }
  public get centerY(): number { return this._y + this._h / 2; }

  public get right() : number { return this._x + this._w; }
  public get bottom(): number { return this._y + this._h; }
  public get top()   : number { return this._y; }
  public get left()  : number { return this._x; }

  public get pos(): Point { return new Point({ x: this.x, y: this.y })};

  public get center(): Point {
    return new Point({ x: this.x + this.w / 2, y: this.y + this.h / 2 });
  }

  public get dimensions(): Point {
    return new Point({ x: this.w, y: this.h });
  }

  public static FromPoint(point: IPoint, size: number): Rect {
    return new Rect({
      x: point.x,
      y: point.y,
      w: size,
      h: size,
    });
  }

  public static FromPoints(p1: IPoint, p2: IPoint): Rect {
    return new Rect({
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
      w: Math.abs(p1.x - p2.x),
      h: Math.abs(p1.y - p2.y),
    });
  }

  public withRight(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      w: value - this.x,
      h: this.h,
    });
  }

  public withWidth(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      w: value,
      h: this.h,
    });
  }

  public withHeight(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      w: this.w,
      h: value,
    });
  }

  public withBottom(value: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      w: this.w,
      h: value - this.y,
    });
  }

  public withX(value: number): Rect {
    return new Rect({
      x: value,
      y: this.y,
      w: this.w,
      h: this.h,
    });
  }

  public withY(value: number): Rect {
    return new Rect({
      x: this.x,
      y: value,
      w: this.w,
      h: this.h,
    });
  }

  public withTop(value: number): Rect {
    return this.withY(value);
  }

  public withLeft(value: number): Rect {
    return this.withX(value);
  }

  /**
   * bottomRight is held constant.
   */
  public withTopLeft(topLeft: IPoint): Rect {
    return Rect.FromPoints(topLeft, this.bottomRight);
  }

  /**
   * bottomLeft is held constant.
   */
  public withTopRight(topRight: IPoint): Rect {
    return Rect.FromPoints(topRight, this.bottomLeft);
  }

  /**
   * topLeft is held constant.
   */
  public withBottomRight(bottomRight: IPoint): Rect {
    return Rect.FromPoints(bottomRight, this.topLeft);
  }

  /**
   * topRight is held constant.
   */
  public withBottomLeft(bottomLeft: IPoint): Rect {
    return Rect.FromPoints(bottomLeft, this.topRight);
  }

  public get topLeft(): Point {
    return new Point({
      x: this.x,
      y: this.y,
    });
  }

  public get topRight(): Point {
    return new Point({
      x: this.right,
      y: this.y,
    });
  }

  public get bottomRight(): Point {
    return new Point({
      x: this.right,
      y: this.bottom,
    });
  }

  public get bottomLeft(): Point {
    return new Point({
      x: this.x,
      y: this.bottom,
    });
  }

  constructor(props: { x: number, y: number, w: number, h: number }) {
    this._x = props.x;
    this._y = props.y;
    this._w = props.w;
    this._h = props.h;
  }

  static DeserializeRect(s: string): Rect {
    const [ x, y, w, h ] = s.split("|").map(x => Number(x));

    return new Rect({ x, y, w, h });
  }

  getLinesFromRect(): Line[] {
    return [
      new Line({ x1: this.x         , y1: this.y         , x2: this.x + this.w, y2: this.y          }),
      new Line({ x1: this.x         , y1: this.y         , x2: this.x         , y2: this.y + this.h }),
      new Line({ x1: this.x + this.w, y1: this.y + this.h, x2: this.x + this.w, y2: this.y          }),
      new Line({ x1: this.x + this.w, y1: this.y + this.h, x2: this.x         , y2: this.y + this.h }),
    ];
  }

  serialize(): string {
    return `${ this.x }|${ this.y }|${ this.w }|${ this.h }`;
  }

  // consider overlapping edges as intersection, but not overlapping corners.
  intersects(other: Rect, props: { edgesOnlyIsAnIntersection: boolean }): boolean {
    const intersection = this.getIntersection(other, true);

    if (props.edgesOnlyIsAnIntersection) {
      return !!intersection && (
              intersection.w > 0 ||
              intersection.h > 0 );
    } else {
      return !!intersection && (intersection.w * intersection.h > 0);
    }
  }

  completelyContains(smaller: Rect): boolean {
    return this.x          <= smaller.x             &&
           this.x + this.w >= smaller.x + smaller.w &&
           this.y          <= smaller.y             &&
           this.y + this.h >= smaller.y + smaller.h ;
  }

  getIntersection(other: Rect, edgesOnlyIsAnIntersection = false): Rect | undefined {
    const xmin = Math.max(this.x, other.x);
    const xmax1 = this.x + this.w;
    const xmax2 = other.x + other.w;
    const xmax = Math.min(xmax1, xmax2);

    if (xmax > xmin || (edgesOnlyIsAnIntersection && xmax >= xmin)) {
      const ymin  = Math.max(this.y, other.y);
      const ymax1 = this.y + this.h;
      const ymax2 = other.y + other.h;
      const ymax  = Math.min(ymax1, ymax2);

      if (ymax >= ymin || (edgesOnlyIsAnIntersection && ymax >= ymin)) {
        return new Rect({
          x: xmin,
          y: ymin,
          w: xmax - xmin,
          h: ymax - ymin,
        });
      }
    }

    return undefined;
  }

  // Wand selecting diagonal pixels downwards depends on this
  contains(p: Point): boolean {
    return p.x >= this.x && p.x < this.x + this.w &&
           p.y >= this.y && p.y < this.y + this.h;
  }

  clone(): Rect {
    return new Rect({ x: this.x, y: this.y, w: this.w, h: this.h });
  }

  add(p: IPoint): Rect {
    return this.translate(p);
  }

  translate(p: IPoint): Rect {
    return new Rect({
      x: this.x + p.x,
      y: this.y + p.y,
      w: this.w,
      h: this.h,
    });
  }

  scale(p: Point): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      w: this.w * p.x,
      h: this.h * p.y,
    });
  }

  centeredAtOrigin(): Rect {
    return new Rect({
      x: -this.w / 2,
      y: -this.h / 2,
      w: this.w,
      h: this.h,
    });
  }

  equals(o: Rect | undefined): boolean {
    if (!o) { return false; }

    return this.x === o.x &&
           this.y === o.y &&
           this.w === o.w &&
           this.h === o.h;
  }

  toJSON(): any {
    return {
      x      : this.x,
      y      : this.y,
      w      : this.w,
      h      : this.h,
      reviver: "Rect",
    }
  }

  /**
   * Adds amount to both width and height.
   */
  extend(amount: number): Rect {
    return new Rect({
      x: this.x,
      y: this.y,
      w: this.w + amount,
      h: this.h + amount,
    });
  }

  shrink(amount: number): Rect {
    return new Rect({
      x: this.x + amount,
      y: this.y + amount,
      w: Math.max(this.w - amount * 2, 0),
      h: Math.max(this.h - amount * 2, 0),
    });
  }

  floor(): Rect {
    return new Rect({
      x: Math.floor(this.x),
      y: Math.floor(this.y),
      w: Math.floor(this.w),
      h: Math.floor(this.h),
    });
  }

  /**
   * Grow the Rect by amount in all directions.
   */
  expand(amount: number): Rect {
    return this.shrink(-amount);
  }

  transform(trans: Point, scale: number): Rect {
    const topLeft = this.topLeft.transform(trans, scale);
    const botRight = this.bottomRight.transform(trans, scale);

    return new Rect({
      x: topLeft.x,
      y: topLeft.y,
      w: botRight.x - topLeft.x,
      h: botRight.y - topLeft.y,
    });
  }

  static Deserialize(obj: any): Rect {
    if (
      !obj.hasOwnProperty("x") ||
      !obj.hasOwnProperty("y") ||
      !obj.hasOwnProperty("w") ||
      !obj.hasOwnProperty("h")) {

      console.error("Failed deserializing Rect");
    }

    return new Rect({
      x: obj.x,
      y: obj.y,
      w: obj.w,
      h: obj.h,
    });
  }

  static Serialize(r: Rect): string {
    return JSON.stringify({
      x: r.x,
      y: r.y,
      w: r.w,
      h: r.h,
    });
  }
}
