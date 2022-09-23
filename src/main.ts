import p5 from "p5";
import { createSketch } from "./p5-util/sketch";
import { preload, setTargetComposition, setup } from "./setup";
import { draw } from "./draw";

import { SetupTmp } from "./examples/setup-tmp";
import { Basic01 } from "./examples/basic01";
import { Basic02 } from "./examples/basic02";
import { Basic03 } from "./examples/basic03";
import { Basic04 } from "./examples/basic04";

setTargetComposition(new Basic04());

const sketch = createSketch({
  setup,
  preload,
  draw,
});

new p5(sketch);
