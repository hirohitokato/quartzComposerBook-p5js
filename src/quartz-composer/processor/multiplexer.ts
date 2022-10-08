import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";

/**
 * This patch implements a Nx1 multiplexer that forwards the current value
 * of a given input to its unique output.
 *
 * Multiplexer is typically used to select dynamically one value among
 * a set of values. All the values are available on the source inputs,
 * each of them having an index.
 * The value transmitted to the patch's output is the one from the input
 * whose index matches the "Source Index" input.
 *
 * Note that by default the Multiplexer inputs and output are virtual,
 * meaning they can transmit any kind of values. For best performances,
 * you should change whenever possible their type in the patch's settings
 * to the type of the input to which the Multiplexer output is connected.
 */
export class Multiplexer<T> implements Operator {
  /** The number of Multiplexer inputs. */
  get number_of_sources(): number {
    return this._num_sources;
  }

  /** The number of Multiplexer inputs. */
  set number_of_sources(num: number) {
    this._num_sources = num;
    this.sources = Multiplexer._move(this.sources, null!, num);
  }
  private _num_sources: number = 1;

  /** The index of the selected source */
  sourceIndex: BindableInput<number> = new BindableInput(0);
  /** An Array of generic input ports */
  sources: BindableInput<T>[] = [];

  constructor(private p: p5) {}

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
