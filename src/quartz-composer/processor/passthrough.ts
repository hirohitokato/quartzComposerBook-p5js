import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";

/**
 * This patch performs as a tunnel patch through the intercepted input/output.
 * This might be useful for debugging.
 */
export class Passthrough<T> implements Operator {
  private _input: BindableInput<T> = new BindableInput<T>(null!);
  private _output: BindableOutput<T> = new BindableOutput<T>(null!);

  constructor(private p: p5) {}

  intercept(
    output: BindableOutput<T>,
    input: BindableInput<T>,
    callback: (t: number, value: T) => void
  ) {
    this._input.bind(output);
    input.bind(this._output);

    this._output.onRequestedValue = (t: number) => {
      let value = this._input.getValue(t);
      callback(t, value);
      return value;
    };
  }
}
