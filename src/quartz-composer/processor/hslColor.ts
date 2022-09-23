import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";

/**
 * Generates a color from hue, saturation, luminosity, and alpha components.
 */
export class HSLColor implements Operator {
  /** The hue component */
  hue: BindableInput<number> = new BindableInput(1);
  /** The saturation component */
  saturation: BindableInput<number> = new BindableInput(1);
  /** The luminosity component */
  luminosity: BindableInput<number> = new BindableInput(1);
  /** The alpha component */
  alpha: BindableInput<number> = new BindableInput(1);

  /** The resulting color */
  color: BindableOutput<p5.Color>;

  constructor(private p: p5) {
    // default value is opaque white
    this.color = new BindableOutput(p.color(255));
    this.color.onRequestedValue = this._createColor.bind(this);
  }

  private _createColor(t: number): p5.Color {
    const h = this.hue.getValue(t) * 360;
    const s = this.saturation.getValue(t) * 100;
    const l = this.luminosity.getValue(t) * 100;
    const a = this.alpha.getValue(t);

    this.p.colorMode(this.p.HSL);
    const result = this.p.color(h, s, l, a);
    // restore state
    this.p.colorMode(this.p.RGB);

    return result;
  }
}
