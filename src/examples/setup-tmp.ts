import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";
import { Image } from "../quartz-composer/provider/image";
import { Interpolation } from "../quartz-composer/provider/interpolation";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { Transformation3D } from "../quartz-composer/consumer/3DTransformation";
import { WaveGenerator, WaveType } from "../quartz-composer/provider/lfo";

let images: { [name: string]: Image } = {};

export class SetupTmp {
  static preload(p: p5) {
    images["volvox"] = new Image(p, "assets/chapter2/basic_01/volvox.png");
  }

  static setup(p: p5, consumers: Consumer[]) {
    let trans = new Transformation3D(p);
    let sprite = new Sprite(p);
    let lerp = new Interpolation(p);

    lerp.startValue.setDefaultValue(-1);
    lerp.endValue.setDefaultValue(1);
    lerp.duration.setDefaultValue(2);

    // trans.xTranslation.bind(lerp.result);
    // trans.yTranslation.bind(lerp.result);
    sprite.xPosition.bind(lerp.result);
    sprite.yPosition.bind(lerp.result);

    sprite.image.bind(images["volvox"]!.image);

    // trans.addConsumer(sprite);
    // consumers.push(trans);
    consumers.push(sprite);
  }
}
