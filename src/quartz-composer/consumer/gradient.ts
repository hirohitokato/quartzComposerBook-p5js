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

/**
 * Renders an horizontal or vertical gradient shading that covers the entire
 * rendering destination and varies between three colors - starting, middle,
 * and ending. This patch also clears the depth buffer.
 *
 * Assuming the "Blending" input is set to "None", you can use Gradient
 * instead of Clear to clear the rendering destination.
 */
export class Gradient implements Consumer {
  layer: number = 0;

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

  draw(elapsed: number) {
    let x = -this.p.width / 2;
    let y = -this.p.height / 2;
    let w = this.p.width;
    let h = this.p.height;
    let { c1, c2, c3 } = this.getColors(elapsed);
    const c2pos = this.color2pos.getValue(elapsed);

    this.p.noFill();

    if (
      this.direction == GradientDirection.Vertical_Upside ||
      this.direction == GradientDirection.Vertical_UpsideDown
    ) {
      // Top to bottom gradient
      this.drawVGradient(x, w, y, y + h * c2pos, c1, c2);
      this.drawVGradient(x, w, y + h * c2pos, h / 2, c2, c3);
    } else if (
      this.direction == GradientDirection.Horizontal_LeftToRight ||
      this.direction == GradientDirection.Horizontal_RightToLeft
    ) {
      // Left to right gradient
      this.drawHGradient(y, h, x, x + w * c2pos, c1, c2);
      this.drawHGradient(y, h, x + w * c2pos, w / 2, c2, c3);
    }
  }

  private getColors(elapsed: number): { c1: p5.Color; c2: p5.Color; c3: p5.Color } {
    let c1: p5.Color;
    let c2 = this.color2.getValue(elapsed);
    let c3: p5.Color;

    switch (this.direction) {
      case GradientDirection.Vertical_Upside:
      case GradientDirection.Horizontal_LeftToRight:
        c1 = this.color1.getValue(elapsed);
        c3 = this.color3.getValue(elapsed);
        break;
      case GradientDirection.Vertical_UpsideDown:
      case GradientDirection.Horizontal_RightToLeft:
        c1 = this.color3.getValue(elapsed);
        c3 = this.color1.getValue(elapsed);
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
    this.p.beginShape();
    this.p.fill(fromColor);
    this.p.vertex(x + width, from);
    this.p.fill(toColor);
    this.p.vertex(x + width, to);
    this.p.fill(toColor);
    this.p.vertex(x, to);
    this.p.fill(fromColor);
    this.p.vertex(x, from);
    this.p.endShape();
  }

  private drawHGradient(
    y: number,
    height: number,
    from: number,
    to: number,
    fromColor: p5.Color,
    toColor: p5.Color
  ) {
    this.p.beginShape();
    this.p.fill(toColor);
    this.p.vertex(to, y);
    this.p.fill(toColor);
    this.p.vertex(to, y + height);
    this.p.fill(fromColor);
    this.p.vertex(from, y + height);
    this.p.fill(fromColor);
    this.p.vertex(from, y);
    this.p.endShape();
  }
}
