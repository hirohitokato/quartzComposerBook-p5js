import p5 from "p5";
import { createSketch } from "./p5-util/sketch";
import { preload, setTargetComposition, setup } from "./setup";
import { draw } from "./draw";

import { SetupBasic01 } from "./setup-basic01";
import { SetupBasic02 } from "./setup-basic02";
import { SetupBasic03 } from "./setup-basic03";
import { SetupTmp } from "./setup-tmp";

setTargetComposition(new SetupBasic03());

const sketch = createSketch({
  setup,
  preload,
  draw,
});

new p5(sketch);
