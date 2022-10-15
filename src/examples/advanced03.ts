import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { QuartzComposition } from "../quartzComposition";

let images: { [name: string]: Image } = {};
let fonts: { [name: string]: p5.Font } = {};

export class Advanced03 implements QuartzComposition {
  preload(p: p5) {}

  setup(p: p5, consumers: Consumer[]) {}
}
