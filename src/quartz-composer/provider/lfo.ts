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
  /** The type of wave to generate */
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

  /** The resulting value of this patch */
  result: BindableOutput<number>;

  private methods: { [type: string]: (dt: number) => number } = {};

  constructor(private p: p5) {
    this.type = new BindableInput(WaveType.Sin);
    this.period = new BindableInput(1);
    this.phase = new BindableInput(0);
    this.amplitude = new BindableInput(1);
    this.offset = new BindableInput(0);
    this.pwmRatio = new BindableInput(0.5);

    this.methods[WaveType.Sin] = this.sin.bind(this);
    this.methods[WaveType.Cos] = this.cos.bind(this);
    this.methods[WaveType.Triangle] = this.triangle.bind(this);
    this.methods[WaveType.SwatoothUp] = this.sawtoothUp.bind(this);
    this.methods[WaveType.SwatoothDown] = this.sawtoothDown.bind(this);
    this.methods[WaveType.PWM] = this.pwm.bind(this);

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

  private pwm(elapsedTime: number): number {
    const period = this.period.getValue(elapsedTime);
    const phase = this.phase.getValue(elapsedTime);
    const amplitude = this.amplitude.getValue(elapsedTime);
    const offset = this.offset.getValue(elapsedTime);
    const pwmRatio = this.pwmRatio.getValue(elapsedTime);

    let t = ((elapsedTime + phase) % period) / period; // 0.0-1.0
    let value: number;

    if (pwmRatio == 1.0) {
      value = 1.0;
    } else {
      value = t > pwmRatio ? 1 : 0;
    }

    return value * amplitude + offset;
  }

  private triangle(elapsedTime: number): number {
    const period = this.period.getValue(elapsedTime);
    const phase = this.phase.getValue(elapsedTime);
    const amplitude = this.amplitude.getValue(elapsedTime);
    const offset = this.offset.getValue(elapsedTime);

    let t = ((elapsedTime + phase) % period) / period; // 0.0-1.0
    let value: number;

    if (t < 0.5) {
      value = t * 2;
    } else {
      value = -t * 2 + 2;
    }

    return value * amplitude + offset;
  }

  private sawtoothUp(elapsedTime: number): number {
    const period = this.period.getValue(elapsedTime);
    const phase = this.phase.getValue(elapsedTime);
    const amplitude = this.amplitude.getValue(elapsedTime);
    const offset = this.offset.getValue(elapsedTime);

    let t = ((elapsedTime + phase) % period) / period; // 0.0-1.0
    return t * amplitude + offset;
  }

  private sawtoothDown(elapsedTime: number): number {
    const period = this.period.getValue(elapsedTime);
    const phase = this.phase.getValue(elapsedTime);
    const amplitude = this.amplitude.getValue(elapsedTime);
    const offset = this.offset.getValue(elapsedTime);

    let t = ((elapsedTime + phase) % period) / period; // 0.0-1.0
    return (1.0 - t) * amplitude + offset;
  }
}
