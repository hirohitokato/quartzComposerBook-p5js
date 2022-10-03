import p5 from "p5";
import { QuartzComposition } from "../quartzComposition";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { Cube } from "../quartz-composer/consumer/cube";

let images: { [name: string]: Image } = {};

export class Advanced01 implements QuartzComposition {
  preload(p: p5) {
    images["wall"] = new Image(p, "assets/chapter3/advanced_01/wall_256x256.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    let cube = new Cube(p);
    cube.width.setDefaultValue(3);
    cube.height.setDefaultValue(3);
    cube.depth.setDefaultValue(3);
    cube.frontImage.bind(images["wall"]!.image);
    cube.frontColor.setDefaultValue(p.color("#787F36"));
    cube.leftImage.bind(images["wall"]!.image);
    cube.leftColor.setDefaultValue(p.color("#1F5D94"));
    cube.rightImage.bind(images["wall"]!.image);
    cube.rightColor.setDefaultValue(p.color("#1F5D94"));
    cube.backImage.bind(images["wall"]!.image);
    cube.backColor.setDefaultValue(p.color("#787F36"));
    cube.topImage.bind(images["wall"]!.image);
    cube.topColor.setDefaultValue(p.color("#820000"));
    cube.bottomImage.bind(images["wall"]!.image);
    cube.bottomColor.setDefaultValue(p.color("#820000"));
    consumers.push(cube);
  }
}
