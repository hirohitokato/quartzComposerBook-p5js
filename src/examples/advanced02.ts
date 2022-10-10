import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { ImageData } from "../quartz-composer/core/imageData";
import { QuartzComposition } from "../quartzComposition";
import { Image } from "../quartz-composer/provider/image";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { Multiplexer } from "../quartz-composer/processor/multiplexer";

let images: { [name: string]: Image } = {};

export class Advanced02 implements QuartzComposition {
  preload(p: p5) {
    images["light"] = new Image(p, "assets/chapter3/advanced_02/light.png");

    images["blur"] = new Image(p, "assets/chapter3/advanced_02/blur.jpg");
    images["figure"] = new Image(p, "assets/chapter3/advanced_02/figure.jpg");
    images["scape"] = new Image(p, "assets/chapter3/advanced_02/scape.jpg");
    images["sky"] = new Image(p, "assets/chapter3/advanced_02/sky.jpg");
    images["water"] = new Image(p, "assets/chapter3/advanced_02/water.jpg");
    images["window"] = new Image(p, "assets/chapter3/advanced_02/window.jpg");
  }

  setup(p: p5, consumers: Consumer[]) {
    let gradient = new Gradient(p);
    gradient.layer = 0;
    gradient.color1.setDefaultValue(p.color(0));
    gradient.color2.setDefaultValue(p.color(59));
    gradient.color3.setDefaultValue(p.color(255));
    gradient.direction = GradientDirection.Vertical_Upside;
    consumers.push(gradient);

    // bottom layer
    let light = new Sprite(p);
    light.layer = 1;
    light.image.bind(images["light"]!.image);
    light.positionY.setDefaultValue(-0.65);
    light.positionZ.setDefaultValue(-2.5);
    light.rotationX.setDefaultValue(90);
    light.widthScale.setDefaultValue(3);
    light.heightScale.setDefaultValue(4);
    consumers.push(light);
    let s = p.createSlider(45, 135, 90, 1);
    s.elt.onchange = () => {
      console.log(s.value());
      light.rotationX.setDefaultValue(Number(s.value()));
    };

    let multiplexer = new Multiplexer<ImageData>(p, 6);
    multiplexer.sources[0]!.bind(images["blur"]!.image);
    multiplexer.sources[1]!.bind(images["figure"]!.image);
    multiplexer.sources[2]!.bind(images["scape"]!.image);
    multiplexer.sources[3]!.bind(images["sky"]!.image);
    multiplexer.sources[4]!.bind(images["water"]!.image);
    multiplexer.sources[5]!.bind(images["window"]!.image);
    multiplexer.sourceIndex.setDefaultValue(3);

    let sprite = new Sprite(p);
    sprite.layer = 3;
    sprite.image.bind(multiplexer.output);
    sprite.positionZ.setDefaultValue(-2);
    // sprite.widthScale.setDefaultValue(1.6);
    // sprite.heightScale.setDefaultValue(1.2);
    consumers.push(sprite);
  }
}
