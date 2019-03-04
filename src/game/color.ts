export class Color {
  public static Red         = new Color(255, 0  , 0  , 1)
  public static Green       = new Color(0  , 255, 0  , 1)
  public static Blue        = new Color(0  , 0  , 255, 1)
  public static Black       = new Color(0  , 0  , 0  , 1)
  public static Gray        = new Color(200, 200, 200, 1)
  public static LightGray   = new Color(240, 240, 240, 1)
  public static Whitesmoke  = new Color(245, 245, 245, 1)
  public static White       = new Color(255, 255, 255, 1)
  public static Transparent = new Color(0  , 0  , 0  , 0)

  constructor(
    public red   : number, 
    public green : number, 
    public blue  : number, 
    public alpha = 1) {
  }

  toString(): string {
    return `rgba(${ Math.floor(this.red) }, ${ Math.floor(this.green) }, ${ Math.floor(this.blue) }, ${ this.alpha })`;
  };

  private componentToHex(value: number): string {
    return ("0" + value.toString(16)).slice(-2);
  }

  rgbaToRgb(value: Color): Color  {
    const BGColor = Color.White;

    return new Color(
      Math.floor(((1 - value.alpha) * BGColor.red)   + (value.alpha * value.red)),
      Math.floor(((1 - value.alpha) * BGColor.green) + (value.alpha * value.green)),
      Math.floor(((1 - value.alpha) * BGColor.blue)  + (value.alpha * value.blue)),
      1,
    );
  }

  toHex(): string {
    return `#${ this.componentToHex(this.red) }${ this.componentToHex(this.green) }${ this.componentToHex(this.blue) }`;
  }
  
  toNumber(): number {
    return (Math.floor(this.red)   << 16) +
           (Math.floor(this.green) << 8 ) +
           (Math.floor(this.blue )      );
  }
}

/*
export const hexToRgb = (hex: string): Color | null => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red  : parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue : parseInt(result[3], 16),
        alpha: 1,
    } : null;
}

export const colorEq = (one: Color, two: Color): boolean => {
  return one.red   === two.red &&
         one.green === two.green &&
         one.blue  === two.blue &&
         one.alpha === two.alpha;
}

export const isColor = (x: any): x is Color => {
  return x.red !== undefined && x.green !== undefined && x.blue !== undefined;
};

//*
// Take a color like (255, 0, 0, 0.5) and convert it to a color with alpha 1.
//
// We assume the background is (255, 255, 255, 1), WHICH IT IS.
//
export const deAlphaize = (c: Color): Color => {
  const { red, green, blue, alpha } = c;

  return {
    red   : Math.floor(255 + (red   - 255) * alpha),
    green : Math.floor(255 + (green - 255) * alpha),
    blue  : Math.floor(255 + (blue  - 255) * alpha),
    alpha : 1,
  }
}

export const colorDiff = (a: Color, b: Color): number => {
  return (a.red - b.red) ** 2 + (a.blue - b.blue) ** 2 + (a.green - b.green) ** 2;
}
*/