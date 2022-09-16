import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export class Random implements Provider {
  min: BindableInput<number> = new BindableInput(0);
  max: BindableInput<number> = new BindableInput(1);

  patchTime: BindableInput<number> = new BindableInput<number>(-1);

  value: BindableOutput<number> = new BindableOutput(0);

  private _previousValue: number | undefined = undefined;

  constructor(private p: p5) {
    this.value.onRequestedValue = this.onRequestedValue;
  }

  private onRequestedValue(elapsed: number): number {
    const patchTime = this.patchTime.getValue(elapsed);
    const min = this.min.getValue(elapsed);
    const max = this.max.getValue(elapsed);
    if (patchTime == -1) {
      let dt = patchTime - (this._previousValue ?? 0);
      let x = this.p.noise(dt * 10);
      x = (max - min) * x + min;
      this._previousValue = patchTime;
      return x;
    } else {
      return this.p.random(min, max);
    }
  }
}
