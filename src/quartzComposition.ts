import p5 from "p5";
import { Consumer } from "./quartz-composer/core/consumer";

export interface QuartzComposition {
  preload(p: p5): void;
  setup(p: p5, consumers: Consumer[]): void;
}
