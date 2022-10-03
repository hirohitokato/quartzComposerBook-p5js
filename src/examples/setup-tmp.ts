import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { QuartzComposition } from "../quartzComposition";

let images: { [name: string]: Image } = {};

export class SetupTmp implements QuartzComposition {
  preload(p: p5) {
    images["volvox"] = new Image(p, "assets/chapter2/basic_01/volvox.png");
    images["fish"] = new Image(p, "assets/chapter2/basic_05/Fish.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    let sprite = new Sprite(p);

    sprite.positionX.setDefaultValue(-0.05);
    sprite.positionY.setDefaultValue(-0.05);

    sprite.image.bind(images["volvox"]!.image);

    consumers.push(sprite);
  }
}
