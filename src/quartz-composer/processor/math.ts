import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";

export const MathOperation = {
  Add: "add",
  Subtract: "subtract",
  Multiply: "multiply",
  Divide: "divide",
  Percentile: "percentile",
  Pow: "pow",
  Min: "min",
  Max: "max",
} as const;
export type MathOperation = typeof MathOperation[keyof typeof MathOperation];

/** This patch performs an arbitrary number of mathematical operations
 *  on an initial numerical value.
 *
 * The operations are applied in sequence starting by applying operation #1
 * with operand #1 on the initial value. The result is then applied
 * operation #2 with operand #2 and so on...
 */
export class MathOperator implements Operator {
  operation: MathOperation = MathOperation.Add;
  value: BindableInput<number> = new BindableInput(0);
  operand: BindableInput<number> = new BindableInput(0);

  result: BindableOutput<number> = new BindableOutput(0);

  constructor(p: p5) {
    this.result.onRequestedValue = this.operate.bind(this);
  }

  private operate(t: number): number {
    switch (this.operation) {
      case MathOperation.Add:
        return this.value.getValue(t) + this.operand.getValue(t);
      case MathOperation.Subtract:
        return this.value.getValue(t) - this.operand.getValue(t);
      case MathOperation.Multiply:
        return this.value.getValue(t) * this.operand.getValue(t);
      case MathOperation.Divide:
        return this.value.getValue(t) / this.operand.getValue(t);
      case MathOperation.Percentile:
        return this.value.getValue(t) * this.operand.getValue(t) * 100;
      case MathOperation.Pow:
        return Math.pow(this.value.getValue(t), this.operand.getValue(t));
      case MathOperation.Min:
        return Math.min(this.value.getValue(t), this.operand.getValue(t));
      case MathOperation.Max:
        return Math.max(this.value.getValue(t), this.operand.getValue(t));
    }
  }
}
