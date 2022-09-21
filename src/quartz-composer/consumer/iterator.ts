import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Consumer } from "../core/consumer";

/**
 * This patch returns the current state of its parent Iterator patch.
 *
 * Iterator Variables is a special patch to be used inside an Iterator macro patch.
 * It returns the current iteration index (either as an integer or
 * normalized to a [0,1] range) and the total number of iterations.
 */
export class IteratorVariables {
  currentIndex: BindableOutput<number> = new BindableOutput(0);
  currentPosition: BindableOutput<number> = new BindableOutput(0);
  iterations: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5) {}
}

export class Iterator implements Consumer {
  layer: number = 1;

  iterations: BindableInput<number> = new BindableInput(1);
  iteratorVariables: IteratorVariables;

  private _subConsumers: Consumer[] = [];

  constructor(private p: p5) {
    this.iteratorVariables = new IteratorVariables(p);
  }

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
        consumer.layer += i * 0.01;
        consumer.draw(atTime);
        consumer.layer -= i * 0.01;
      });
    }
  }
}
