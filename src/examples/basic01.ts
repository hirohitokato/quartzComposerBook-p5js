import p5 from "p5";
import { QuartzComposition } from "../quartzComposition";
import { Consumer } from "../quartz-composer/core/consumer";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";
import { Image } from "../quartz-composer/provider/image";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { Transformation3D } from "../quartz-composer/consumer/3DTransformation";
import { Interpolation } from "../quartz-composer/provider/interpolation";
import { WaveGenerator, WaveType } from "../quartz-composer/provider/lfo";

let images: { [name: string]: Image } = {};

export class Basic01 implements QuartzComposition {
  preload(p: p5) {
    images["volvox"] = new Image(p, "assets/chapter2/basic_01/volvox.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    let gradient_background = new Gradient(p);
    gradient_background.layer = 0;
    gradient_background.color1.setDefaultValue(p.color(134, 148, 150));
    gradient_background.color2.setDefaultValue(p.color(32, 56, 56));
    gradient_background.color3.setDefaultValue(p.color(0));
    gradient_background.direction = GradientDirection.Vertical_UpsideDown;

    let volvox = new Sprite(p);
    volvox.layer = 0;
    volvox.image.bind(images["volvox"]!.image);
    volvox.xPosition.setDefaultValue(100);

    let group = new Transformation3D(p);
    group.layer = 1;
    group.addConsumer(volvox);

    consumers.push(gradient_background, group);

    let lfo_x = new WaveGenerator(p);
    lfo_x.type.setDefaultValue(WaveType.Sin);
    lfo_x.period.setDefaultValue(10);
    lfo_x.amplitude.setDefaultValue(0.5);
    volvox.xPosition.bind(lfo_x.result);

    let lfo_y = new WaveGenerator(p);
    lfo_y.type.setDefaultValue(WaveType.Cos);
    lfo_y.period.setDefaultValue(10);
    lfo_y.amplitude.setDefaultValue(0.5);
    volvox.yPosition.bind(lfo_y.result);

    let lfo_wh = new WaveGenerator(p);
    lfo_wh.type.setDefaultValue(WaveType.Sin);
    lfo_wh.period.setDefaultValue(0.1);
    lfo_wh.amplitude.setDefaultValue(0.01);
    lfo_wh.offset.setDefaultValue(0.8);
    volvox.widthScale.bind(lfo_wh.result);
    volvox.heightScale.bind(lfo_wh.result);

    let interpolation = new Interpolation(p);
    interpolation.startValue.setDefaultValue(0);
    interpolation.endValue.setDefaultValue(360);
    interpolation.duration.setDefaultValue(20);
    volvox.zRotation.bind(interpolation.result);
  }
}
