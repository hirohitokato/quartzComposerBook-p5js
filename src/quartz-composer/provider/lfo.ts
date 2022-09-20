import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export const WaveType = {
  Sin: "sin",
  Cos: "cos",
  Triangle: "triangle",
  Square: "square",
  SwatoothUp: "swatoothUp",
  SwatoothDown: "swatoothDown",
  PWM: "pwm",
  Random: "random",
} as const;
export type WaveType = typeof WaveType[keyof typeof WaveType];

/**
 * This patch generates a low-frequency oscillation.
 *
 * All the parameters of the wave used for the oscillation can be customized:
 *  type, period, phase, offset and amplitude.
 *
 * The minimum and maximum values reached by the wave are defined by
 * (offset - amplitude) and (offset + amplitude).
 */
export class WaveGenerator implements Provider {
  /** 種類 */
  type: BindableInput<WaveType>;
  /** 周期 */
  period: BindableInput<number>;
  /** 位相 */
  phase: BindableInput<number>;
  /** 振幅。最低値と最高値の差を設定 */
  amplitude: BindableInput<number>;
  /** オフセット。バイアス */
  offset: BindableInput<number>;
  /** PWM のデューティ比 */
  pwmRatio: BindableInput<number>;

  /** The result of this patch */
  result: BindableOutput<number>;

  private methods: { [type: string]: (dt: number) => number } = {};

  constructor(private p: p5) {
    this.type = new BindableInput(WaveType.Sin);
    this.period = new BindableInput(1);
    this.phase = new BindableInput(0);
    this.amplitude = new BindableInput(1);
    this.offset = new BindableInput(0);
    this.pwmRatio = new BindableInput(0.25);

    this.methods[WaveType.Sin] = this.sin.bind(this);
    this.methods[WaveType.Cos] = this.cos.bind(this);

    this.result = new BindableOutput(0);
    this.result.onRequestedValue = (t) => {
      return this.methods[this.type.getValue(t)]!(t);
    };
  }

  private sin(elapsedTime: number): number {
    const period = this.period.getValue(elapsedTime);
    const phase = this.phase.getValue(elapsedTime);
    const amplitude = this.amplitude.getValue(elapsedTime);
    const offset = this.offset.getValue(elapsedTime);

    let y = Math.sin(elapsedTime * ((2 * Math.PI) / period) + phase);
    return y * amplitude + offset;
  }

  private cos(elapsedTime: number): number {
    const period = this.period.getValue(elapsedTime);
    const phase = this.phase.getValue(elapsedTime);
    const amplitude = this.amplitude.getValue(elapsedTime);
    const offset = this.offset.getValue(elapsedTime);

    let y = Math.cos(elapsedTime * ((2 * Math.PI) / period) + phase);
    return y * amplitude + offset;
  }
}
