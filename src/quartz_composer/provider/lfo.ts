import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export const LFOType = {
  Sin: "sin",
  Cos: "cos",
  Triangle: "triangle",
  Square: "square",
  SwatoothUp: "swatoothUp",
  SwatoothDown: "swatoothDown",
  PWM: "pwm",
  Random: "random",
} as const;
export type LFOType = typeof LFOType[keyof typeof LFOType];

export class LFO implements Provider {
  /** 種類 */
  type: BindableInput<LFOType>;
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
    this.type = new BindableInput(LFOType.Sin);
    this.period = new BindableInput(1);
    this.phase = new BindableInput(0);
    this.amplitude = new BindableInput(1);
    this.offset = new BindableInput(0);
    this.pwmRatio = new BindableInput(0.25);

    this.result = new BindableOutput(0);

    this.methods[LFOType.Sin] = this.sinLfo.bind(this);
    this.methods[LFOType.Cos] = this.cosLfo.bind(this);
  }

  update(elapsedTime: number): void {
    this.result.value = this.methods[this.type.value]!(elapsedTime);
  }

  private sinLfo(elapsedTime: number): number {
    let y = Math.sin(elapsedTime * (Math.PI / this.period.value) + this.phase.value);
    return y * this.amplitude.value + this.offset.value;
  }

  private cosLfo(elapsedTime: number): number {
    let y = Math.cos(elapsedTime * (Math.PI / this.period.value) + this.phase.value);
    return y * this.amplitude.value + this.offset.value;
  }
}
