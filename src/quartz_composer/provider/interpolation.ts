import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export const RepeatMode = {
  None: "none",
  Loop: "loop",
  MirroredLoop: "mirroredLoop",
  MirroredLoopOnce: "mirroredLoopOnce",
} as const;
export type RepeatMode = typeof RepeatMode[keyof typeof RepeatMode];

export const InterpolationType = {
  Linear: "linear",
  QuadraticIn: "quadraticIn",
  QuadraticOut: "quadraticOut",
  QuadraticInOut: "quadraticInOut",
  CubicIn: "cubicIn",
  CubicOut: "cubicOut",
  CubicInOut: "cubicInOut",
  ExponentialIn: "exponentialIn",
  ExponentialOut: "exponentialOut",
  ExponentialInOut: "exponentialInOut",
  SinusodialIn: "sinusodialIn",
  SinusodialOut: "sinusodialOut",
  SinusodialInOut: "sinusodialInOut",
} as const;
export type InterpolationType = typeof InterpolationType[keyof typeof InterpolationType];

export class Interpolation implements Provider {
  /** Start value */
  startValue: BindableInput<number> = new BindableInput(0);
  /** End value */
  endValue: BindableInput<number> = new BindableInput(1);
  /** Duration time in seconds between start value and end value */
  duration: BindableInput<number> = new BindableInput(1);
  tension: BindableInput<number> = new BindableInput(0);
  repeatMode: BindableInput<RepeatMode> = new BindableInput<RepeatMode>(RepeatMode.None);
  interpolationType: BindableInput<InterpolationType> = new BindableInput(InterpolationType.Linear);

  /** The result of this patch */
  result: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5) {}

  update(elapsed: number): void {
    let duration = this.duration.value;
    if (
      this.repeatMode.value == RepeatMode.MirroredLoop ||
      this.repeatMode.value == RepeatMode.MirroredLoopOnce
    ) {
      // consider reversed phase
      duration *= 2;
    }

    let progress = elapsed % duration;
    if (progress > this.duration.value) {
      progress = this.duration.value - (progress - this.duration.value);
    }
    // 0...1 value
    progress /= this.duration.value;

    this.result.value =
      (this.endValue.value - this.startValue.value) * progress + this.startValue.value;
  }
}
