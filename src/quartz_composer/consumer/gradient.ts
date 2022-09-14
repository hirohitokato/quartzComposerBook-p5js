import p5 from "p5";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";

export const GradientDirection = {
  Vertical_Upside: "vertical_upside",
  Vertical_UpsideDown: "vertical_upsidedown",
  Horizontal_LeftToRight: "horizontal_l2r",
  Horizontal_RightToLeft: "horizontal_r2l",
} as const;
export type GradientDirection = typeof GradientDirection[keyof typeof GradientDirection];

export class Gradient implements Consumer {
  layer: number = 1;

  direction: GradientDirection;
  color1: BindableInput<p5.Color>;
  color2: BindableInput<p5.Color>;
  color3: BindableInput<p5.Color>;
  color2pos: BindableInput<number>;

  constructor(private p: p5) {
    this.direction = GradientDirection.Vertical_Upside;
    this.color1 = new BindableInput(p.color(0));
    this.color2 = new BindableInput(p.color(127));
    this.color3 = new BindableInput(p.color(255));
    this.color2pos = new BindableInput(0.5);
  }

  update() {}

  draw() {
    let x = 0;
    let y = 0;
    let w = this.p.width;
    let h = this.p.height;
    let { c1, c2, c3 } = this.getColors();

    this.p.noFill();

    if (
      this.direction == GradientDirection.Vertical_Upside ||
      this.direction == GradientDirection.Vertical_UpsideDown
    ) {
      // Top to bottom gradient
      this.drawVGradient(x, w, y, y + h * this.color2pos.value, c1, c2);
      this.drawVGradient(x, w, h * this.color2pos.value, h, c2, c3);
    } else if (
      this.direction == GradientDirection.Horizontal_LeftToRight ||
      this.direction == GradientDirection.Horizontal_RightToLeft
    ) {
      // Left to right gradient
      this.drawHGradient(y, h, x, x * this.color2pos.value, c1, c2);
      this.drawHGradient(y, h, x * this.color2pos.value, x, c2, c3);
    }
  }

  private getColors(): { c1: p5.Color; c2: p5.Color; c3: p5.Color } {
    let c1: p5.Color;
    let c2 = this.color2.value;
    let c3: p5.Color;

    switch (this.direction) {
      case GradientDirection.Vertical_Upside:
      case GradientDirection.Horizontal_LeftToRight:
        c1 = this.color1.value;
        c3 = this.color3.value;
        break;
      case GradientDirection.Vertical_UpsideDown:
      case GradientDirection.Horizontal_RightToLeft:
        c1 = this.color3.value;
        c3 = this.color1.value;
        break;
    }
    return { c1, c2, c3 };
  }

  private drawVGradient(
    x: number,
    width: number,
    from: number,
    to: number,
    fromColor: p5.Color,
    toColor: p5.Color
  ) {
    for (let i = from; i <= to; i++) {
      let inter = this.p.map(i, from, to, 0, 1);
      let c = this.p.lerpColor(fromColor, toColor, inter);
      this.p.stroke(c);
      this.p.line(x, i, x + width, i);
    }
  }

  private drawHGradient(
    y: number,
    height: number,
    from: number,
    to: number,
    fromColor: p5.Color,
    toColor: p5.Color
  ) {
    for (let i = from; i <= to; i++) {
      let inter = this.p.map(i, from, to, 0, 1);
      let c = this.p.lerpColor(fromColor, toColor, inter);
      this.p.stroke(c);
      this.p.line(i, y, i, y + height);
    }
  }
}
