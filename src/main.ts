import p5 from "p5";
import { createSketch } from "./p5-util/sketch";
import { preload, setup } from "./setup";
import { draw } from "./draw";

const sketch = createSketch({
  setup,
  preload,
  draw,
});

new p5(sketch);
