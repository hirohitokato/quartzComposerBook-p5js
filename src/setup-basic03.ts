import p5 from "p5";
import { QuartzComposition } from "./quartzComposition";
import { Consumer } from "./quartz-composer/core/consumer";
import { Gradient, GradientDirection } from "./quartz-composer/consumer/gradient";
import { Image } from "./quartz-composer/provider/image";
import { Sprite } from "./quartz-composer/consumer/sprite";
import { Transformation3D } from "./quartz-composer/consumer/3DTransformation";
import { MathOperation, MathOperator } from "./quartz-composer/processor/math";
import { Interpolation } from "./quartz-composer/provider/interpolation";
import { PatchTime } from "./quartz-composer/provider/patchTime";
import { WaveGenerator, WaveType } from "./quartz-composer/provider/lfo";
import { Iterator } from "./quartz-composer/consumer/iterator";

let images: { [name: string]: Image } = {};

export class SetupBasic03 implements QuartzComposition {
  preload(p: p5) {
    images["Body"] = new Image(p, "assets/chapter2/basic_03/Body.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    let gradient = new Gradient(p);
    consumers.push(gradient);
    gradient.layer = 1;
    gradient.direction = GradientDirection.Vertical_Upside;
    gradient.color1.setDefaultValue(p.color(83, 83, 83));
    gradient.color2.setDefaultValue(p.color(131, 131, 131));
    gradient.color3.setDefaultValue(p.color(255, 255, 255));
    gradient.color2pos.setDefaultValue(0.5);

    // parts of trilobite
    let sprite = new Sprite(p);
    sprite.layer = 0;
    sprite.image.bind(images["Body"]!.image);
    sprite.widthScale.setDefaultValue(0.4);
    sprite.heightScale.setDefaultValue(0.4);

    let xPosLfo = new WaveGenerator(p);
    let yPosLfo = new WaveGenerator(p);
    sprite.xPosition.bind(xPosLfo.result);
    sprite.yPosition.bind(yPosLfo.result);
    xPosLfo.type.setDefaultValue(WaveType.Cos);
    xPosLfo.period.setDefaultValue(4);
    xPosLfo.amplitude.setDefaultValue(0.1);
    yPosLfo.type.setDefaultValue(WaveType.Sin);
    yPosLfo.period.setDefaultValue(2);
    yPosLfo.amplitude.setDefaultValue(0.2);

    let trilobiteParts = new Transformation3D(p);
    trilobiteParts.layer = 2;
    trilobiteParts.addConsumer(sprite);

    // trilobite body
    let trilobite = new Iterator(p);
    trilobite.layer = 2;
    trilobite.addConsumer(trilobiteParts);
    trilobite.iterations.setDefaultValue(20);

    let patchTime = new PatchTime(p);
    let sum = new MathOperator(p, 2);
    sum.operations[0]!.setDefaultValue(MathOperation.Add);
    sum.operands[0]!.bind(patchTime.time);
    sum.operations[1]!.setDefaultValue(MathOperation.Add);
    sum.operands[1]!.bind(trilobite.iteratorVariables.currentPosition);
    trilobiteParts.patchTime.bind(sum.result);

    let interp = new Interpolation(p);
    interp.patchTime.bind(trilobite.iteratorVariables.currentPosition);
    interp.startValue.setDefaultValue(0.5);
    interp.endValue.setDefaultValue(1.2);
    interp.duration.setDefaultValue(1);
    sprite.widthScale.bind(interp.result);

    consumers.push(trilobite);
  }
}
