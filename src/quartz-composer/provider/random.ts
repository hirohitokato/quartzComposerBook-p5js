import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

/**
 * This patch generates random values in a given range.
 *
 * The variability of the generated random values can be set in the patch's settings.
 */
export class Random implements Provider {
  /** The minimum value that can be generated */
  min: BindableInput<number> = new BindableInput(-1);
  max: BindableInput<number> = new BindableInput(1);

  /** Execution time of the patch */
  patchTime: BindableInput<number> = new BindableInput<number>(-1);

  /** The random value */
  value: BindableOutput<number> = new BindableOutput(0);

  private _offset: number;

  constructor(private p: p5) {
    this.value.onRequestedValue = this.onRequestedValue.bind(this);
    this._offset = p.random(0, 1000);
  }

  private onRequestedValue(elapsed: number): number {
    const patchTime = this.patchTime.getValue(elapsed) + this._offset;
    const min = this.min.getValue(elapsed);
    const max = this.max.getValue(elapsed);
    if (patchTime != -1) {
      let x = this.p.noise(patchTime);
      x = (max - min) * x + min;
      return x;
    } else {
      return this.p.random(min, max);
    }
  }
}
