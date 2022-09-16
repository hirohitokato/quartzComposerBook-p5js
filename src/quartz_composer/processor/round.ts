import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { Operator } from "../core/operator";

export class Round implements Operator {
  value: BindableInput<number> = new BindableInput(0);

  roundedValue: BindableOutput<number> = new BindableOutput(0);
  floorValue: BindableOutput<number> = new BindableOutput(0);
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
