import p5 from "p5";
import { Consumer } from "./quartz-composer/core/consumer";
import { Gradient, GradientDirection } from "./quartz-composer/consumer/gradient";
import { Image } from "./quartz-composer/provider/image";
import { Sprite } from "./quartz-composer/consumer/sprite";
import { Transformation3D } from "./quartz-composer/consumer/3d-transformation";
import { MathOperation, MathOperator } from "./quartz-composer/processor/math";
import { Round } from "./quartz-composer/processor/round";
import {
  Interpolation,
  InterpolationType,
  RepeatMode,
} from "./quartz-composer/provider/interpolation";
import { Random } from "./quartz-composer/provider/random";
import { PatchTime } from "./quartz-composer/provider/patchTime";
import { WaveGenerator, WaveType } from "./quartz-composer/provider/lfo";

let images: { [name: string]: Image } = {};

export class SetupBasic02 {
  static preload(p: p5) {
    images["Body"] = new Image(p, "assets/chapter2/basic_02/Body.png");
    images["Foot"] = new Image(p, "assets/chapter2/basic_02/Foot.png");
  }

  static setup(p: p5, consumers: Consumer[]) {
    let gradient = new Gradient(p);
    consumers.push(gradient);
    gradient.layer = 1;
    gradient.direction = GradientDirection.Horizontal_RightToLeft;
    gradient.color1.setDefaultValue(p.color(176, 191, 200));
    gradient.color2.setDefaultValue(p.color(71, 92, 128));
    gradient.color3.setDefaultValue(p.color(42, 49, 68));
    gradient.color2pos.setDefaultValue(0.5);

    // body
    let body = new Sprite(p);
    body.layer = 3;
    body.image.bind(images["Body"]!.image);
    let lfo_body = new WaveGenerator(p);
    lfo_body.type.setDefaultValue(WaveType.Sin);
    lfo_body.period.setDefaultValue(1);
    lfo_body.phase.setDefaultValue(0);
    lfo_body.amplitude.setDefaultValue(0.1);
    lfo_body.offset.setDefaultValue(1);
    body.heightScale.bind(lfo_body.result);

    // foot
    let foot = new Sprite(p);
    foot.layer = 2;
    foot.image.bind(images["Foot"]!.image);
    let lfo_foot = new WaveGenerator(p);
    lfo_foot.type.setDefaultValue(WaveType.Cos);
    lfo_foot.period.setDefaultValue(1);
    lfo_foot.phase.setDefaultValue(0);
    lfo_foot.amplitude.setDefaultValue(0.1);
    lfo_foot.offset.setDefaultValue(1);
    foot.heightScale.bind(lfo_foot.result);

    // jellyfish
    let jellyfish = new Transformation3D(p);
    consumers.push(jellyfish);
    jellyfish.addConsumer(foot);
    jellyfish.addConsumer(body);
    jellyfish.layer = 2;
    jellyfish.zTranslation.setDefaultValue(3);

    let patchtime = new PatchTime(p);
    let divider = new MathOperator(p, 1);
    let roundtime = new Round(p);
    let randomtime = new Random(p);
    divider.initialValue.bind(patchtime.time);
    divider.operations[0]!.setDefaultValue(MathOperation.Divide);
    divider.operands[0]!.setDefaultValue(10);
    roundtime.value.bind(divider.result);
    randomtime.patchTime.bind(roundtime.floorValue);
    jellyfish.xTranslation.bind(randomtime.value);

    let interp = new Interpolation(p);
    jellyfish.yTranslation.bind(interp.result);
    interp.startValue.setDefaultValue(-1.75);
    interp.endValue.setDefaultValue(1.75);
    interp.duration.setDefaultValue(10);
    interp.repeatMode.setDefaultValue(RepeatMode.Loop);
    interp.interpolationType.setDefaultValue(InterpolationType.Linear);
  }
}
