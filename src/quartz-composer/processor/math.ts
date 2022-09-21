import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";
import { zip } from "../core/utils";

export const MathOperation = {
  Add: "add",
  Subtract: "subtract",
  Multiply: "multiply",
  Divide: "divide",
  Modulo: "percentile",
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
  /** The number of operations to apply to the initialValue. */
  get num_operations(): number {
    return this._num_operations;
  }

  /** The number of operations to apply to the initialValue. */
  set num_operations(num: number) {
    this._num_operations = num;
    this.operations = MathOperator._move(this.operations, MathOperation.Add, num);
    this.operands = MathOperator._move(this.operands, 0, num);
  }
  private _num_operations: number = 1;

  // input ports
  initialValue: BindableInput<number> = new BindableInput(0);
  operations: BindableInput<MathOperation>[] = [new BindableInput(MathOperation.Add)];
  operands: BindableInput<number>[] = [new BindableInput(0)];

  // output ports
  result: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5, num_operations: number = 1) {
    this.result.onRequestedValue = this._operate.bind(this);
    this.num_operations = num_operations;
  }

  private _operate(t: number): number {
    const pairs: Element[] = zip(this.operations, this.operands).map(
      (x) => new Element(x[0].getValue(t), x[1].getValue(t))
    );
    let result = pairs.reduce(
      (prev, cur) =>
        new Element(cur.operation, MathOperator._calc(cur.operation, prev.operand, cur.operand)),
      new Element(MathOperation.Add /*dummy*/, this.initialValue.getValue(t))
    );
    return result.operand;
  }

  private static _calc(operation: MathOperation, op1: number, op2: number): number {
    switch (operation) {
      case MathOperation.Add:
        return op1 + op2;
      case MathOperation.Subtract:
        return op1 - op2;
      case MathOperation.Multiply:
        return op1 * op2;
      case MathOperation.Divide:
        return op1 / op2;
      case MathOperation.Modulo:
        return op1 % op2;
      case MathOperation.Pow:
        return Math.pow(op1, op2);
      case MathOperation.Min:
        return Math.min(op1, op2);
      case MathOperation.Max:
        return Math.max(op1, op2);
    }
  }

  private static _move<T>(
    array: BindableInput<T>[],
    defaultValue: T,
    limit: number
  ): BindableInput<T>[] {
    let ops: BindableInput<T>[] = [];
    array.forEach((op, i) => {
      if (i < limit) {
        ops.push(op);
      }
    });
    while (ops.length < limit) {
      ops.push(new BindableInput<T>(defaultValue));
    }
    return ops;
  }
}

class Element {
  constructor(public operation: MathOperation, public operand: number) {}
}
