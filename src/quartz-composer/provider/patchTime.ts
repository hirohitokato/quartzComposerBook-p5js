import p5 from "p5";
import { BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

/**
 * This patch simply returns the time it receives from p5.js as a number.
 *
 * This patch is typically used to retrieve the current time at a given place
 * in the composition's patch hierarchy and perform some actions based on it.
 *
 * Note that the library times are guaranteed to be positive or null.
 */
export class PatchTime implements Provider {
  /** The current time in seconds */
  time: BindableOutput<number> = new BindableOutput(0);

  constructor(private p: p5) {
    // return elapsed time as is
    this.time.onRequestedValue = (t) => t;
  }
}
