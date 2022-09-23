import p5 from "p5";
import { QuartzComposition } from "./quartzComposition";
import { Consumer } from "./quartz-composer/core/consumer";

export let targetComposition: QuartzComposition;
export let consumers: Consumer[] = [];

export const setTargetComposition = (composition: QuartzComposition): void => {
  targetComposition = composition;
};

export const preload = (p: p5): void => {
  console.log("preload");
  targetComposition.preload(p);
};

/** This is a setup function. */
export const setup = (p: p5): void => {
  console.log("setup");
  p.createCanvas(800, 600, p.WEBGL) as any;

  p.noStroke();
  p.setAttributes("preserveDrawingBuffer", true);
  p.setAttributes("premultipliedAlpha", false);
  p.setAttributes("alpha", false);
  p.setAttributes("perPixelLighting", false);

  targetComposition.setup(p, consumers);

  // sort consumers by the layer. Bigger the value, the more it will draw in the front.
  consumers.sort((a, b) => (a.layer > b.layer ? 1 : -1));
};
