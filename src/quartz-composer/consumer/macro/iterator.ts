import p5 from "p5";
import { BindableInput, BindableOutput } from "../../core/bindable";
import { Consumer } from "../../core/consumer";

/**
 * This patch returns the current state of its parent Iterator patch.
 *
 * Iterator Variables is a special patch to be used inside an Iterator macro patch.
 * It returns the current iteration index (either as an integer or
 * normalized to a [0,1] range) and the total number of iterations.
 */
export class IteratorVariables {
  /** Current iteration index in the [0, count-1] range */
  currentIndex: BindableOutput<number> = new BindableOutput(0);
  /** Current normalized loop position in the [0, 1] range */
  currentPosition: BindableOutput<number> = new BindableOutput(0);
  /** Number of iterations in the loop */
  iterations: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5) {}
}

/**
 * This macro patch renders its subpatches a given number of times.
 *
 * Iterator it typically used to create loops in the composition similar to
 * for() loops in programming languages. The number of iterations is
 * specified by the "Iterations" input. The index of the current iteration
 * can be passed to the subpatches by using an Iterator Variables patch
 * inside this macro patch.
 */
export class Iterator implements Consumer {
  layer: number = 1;

  /** number of iterations in the loop */
  iterations: BindableInput<number> = new BindableInput(1);
  /** Current iteration state of the patch */
  iteratorVariables: IteratorVariables;

  private _subConsumers: Consumer[] = [];

  constructor(private p: p5) {
    this.iteratorVariables = new IteratorVariables(p);
  }

  /**
   * Add the consumer patch as one of subpatches of this patch.
   * @param consumer The patch will be contained in the patch
   * @note Make sure you must set consumer's layer property before adding.
   * the iterator does not concern the change after adding.
   */
  addConsumer(consumer: Consumer) {
    consumer.layer += this.layer;
    this._subConsumers.push(consumer);
  }

  draw(atTime: number): void {
    const num_iterations = this.iterations.getValue(atTime);
    this.iteratorVariables.iterations.updateInitialValue(num_iterations);

    for (let i = 0; i < num_iterations; i++) {
      this.iteratorVariables.currentIndex.updateInitialValue(i);
      this.iteratorVariables.currentPosition.updateInitialValue((i + 1) / num_iterations);

      this._subConsumers.forEach((consumer, i) => {
        this.p.push();
        consumer.layer += i * 0.01;
        consumer.draw(atTime);
        consumer.layer -= i * 0.01;
        this.p.pop();
      });
    }
  }
}
