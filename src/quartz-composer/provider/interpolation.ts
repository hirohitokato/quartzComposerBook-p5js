import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";
import { Easings } from "../core/tween";

export const RepeatMode = {
  None: "none", // not implemented
  Loop: "loop",
  MirroredLoop: "mirroredLoop",
  MirroredLoopOnce: "mirroredLoopOnce", // not implemented
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

/**
 * This patch interpolates between two numerical values over time.
 *
 * The curve used for the interpolation can be chosen among presets
 * (linear, quadratic, exponential...).
 *
 * The duration of the interpolation and its looping mode can also be specified.
 */
export class Interpolation implements Provider {
  /** Execution time of the patch */
  patchTime: BindableInput<number> = new BindableInput(-1);

  /** The starting value */
  startValue: BindableInput<number> = new BindableInput(0);
  /** The final value */
  endValue: BindableInput<number> = new BindableInput(1);
  /** The interpolation duration time in seconds */
  duration: BindableInput<number> = new BindableInput(1);
  /** The relative tension of the interpolated curve */
  tension: BindableInput<number> = new BindableInput(0);
  /** The repeat mode */
  repeatMode: BindableInput<RepeatMode> = new BindableInput<RepeatMode>(RepeatMode.None);
  /** The interpolation mode */
  interpolationType: BindableInput<InterpolationType> = new BindableInput(InterpolationType.Linear);

  /** The resulting value of this patch */
  result: BindableOutput<number> = new BindableOutput(0);

  private static tweenMethods: Record<InterpolationType, (t: number) => number> = {
    linear: Easings.linear,
    quadraticIn: Easings.quadraticIn,
    quadraticOut: Easings.quadraticOut,
    quadraticInOut: Easings.quadraticInOut,
    cubicIn: Easings.cubicIn,
    cubicOut: Easings.cubicOut,
    cubicInOut: Easings.cubicInOut,
    exponentialIn: Easings.exponentialIn,
    exponentialOut: Easings.exponentialOut,
    exponentialInOut: Easings.exponentialInOut,
    sinusodialIn: Easings.sinusoidalIn,
    sinusodialOut: Easings.sinusoidalOut,
    sinusodialInOut: Easings.sinusoidalInOut,
  };

  constructor(private p: p5) {
    this.result.onRequestedValue = this._calculate.bind(this);
  }

  private _calculate(elapsed: number): number {
    const patchTime = this.patchTime.getValue(elapsed);
    const t = patchTime == -1 ? elapsed : patchTime;

    let duration = this.duration.getValue(t);
    const originalDuration = duration;
    const repeatMode = this.repeatMode.getValue(t);
    if (repeatMode == RepeatMode.MirroredLoop || repeatMode == RepeatMode.MirroredLoopOnce) {
      // consider reversed phase
      duration *= 2;
    }

    let progress = t % duration;
    if (progress > originalDuration) {
      progress = originalDuration - (progress - originalDuration);
    }
    // 0...1 value
    progress /= originalDuration;

    const startValue = this.startValue.getValue(t);
    const endValue = this.endValue.getValue(t);

    const tweened = Interpolation.tweenMethods[this.interpolationType.getValue(t)](progress);

    return (endValue - startValue) * tweened + startValue;
  }
}
