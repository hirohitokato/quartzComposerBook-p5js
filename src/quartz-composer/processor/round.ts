import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";

/**
 * This patch rounds a numerical value to the nearest, largest or smallest integer.
 */
export class Round implements Operator {
  /** The initial value */
  value: BindableInput<number> = new BindableInput(0);

  /** The value rounded to the nearest integer */
  roundedValue: BindableOutput<number> = new BindableOutput(0);
  /** The value rounded to the smallest integer */
  floorValue: BindableOutput<number> = new BindableOutput(0);
  /** The value rounded to the largest integer */
  ceilValue: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5) {
    this.roundedValue.onRequestedValue = (atTime) => {
      return Math.round(this.value.getValue(atTime));
    };
    this.floorValue.onRequestedValue = (atTime) => {
      return Math.floor(this.value.getValue(atTime));
    };
    this.ceilValue.onRequestedValue = (atTime) => {
      return Math.ceil(this.value.getValue(atTime));
    };
  }
}
