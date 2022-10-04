import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { QuartzComposition } from "../quartzComposition";
import { ImageWithString } from "../quartz-composer/provider/imageWithString";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";

let images: { [name: string]: Image } = {};
let fonts: { [name: string]: p5.Font } = {};

export class SetupTmp implements QuartzComposition {
  preload(p: p5) {
    images["fish"] = new Image(p, "assets/chapter2/basic_05/Fish.png");
    fonts["roboto"] = p.loadFont("assets/fonts/Roboto-Regular.ttf");
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

    let text = new ImageWithString(p, fonts);
    text.fontName.setDefaultValue("roboto");
    let sprite = new Sprite(p);
    sprite.layer = 1;
    sprite.image.bind(text.image);

    consumers.push(sprite);
  }
}
