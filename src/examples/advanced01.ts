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
    cube.width.setDefaultValue(0.25);
    cube.height.setDefaultValue(0.5);
    cube.depth.setDefaultValue(0.5);
    // cube.width.setDefaultValue(3);
    // cube.height.setDefaultValue(3.5);
    // cube.depth.setDefaultValue(3.5);
    cube.xRotation.setDefaultValue(20);
    cube.yRotation.setDefaultValue(20);
    cube.zRotation.setDefaultValue(20);
    // cube.frontImage.bind(images["wall"]!.image);
    consumers.push(cube);
  }
}
