import p5 from "p5";
import { BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export class PatchTime implements Provider {
  time: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5) {
    // return elapsed time as is
    this.time.onRequestedValue = (t) => t;
  }
}
