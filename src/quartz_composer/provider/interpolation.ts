import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

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

  constructor(private p: p5) {
    this.result.onRequestedValue = this.onRequestedValue.bind(this);
  }

  onRequestedValue(elapsed: number): number {
    let duration = this.duration.getValue(elapsed);
    const originalDuration = duration;
    const repeatMode = this.repeatMode.getValue(elapsed);
    if (repeatMode == RepeatMode.MirroredLoop || repeatMode == RepeatMode.MirroredLoopOnce) {
      // consider reversed phase
      duration *= 2;
    }

    let progress = elapsed % duration;
    if (progress > originalDuration) {
      progress = originalDuration - (progress - originalDuration);
    }
    // 0...1 value
    progress /= originalDuration;

    const startValue = this.startValue.getValue(elapsed);
    const endValue = this.endValue.getValue(elapsed);

    return (endValue - startValue) * progress + startValue;
  }
}
