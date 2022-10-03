import p5 from "p5";
import { QuartzComposition } from "../quartzComposition";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { Cube } from "../quartz-composer/consumer/cube";
import { Transformation3D } from "../quartz-composer/consumer/3DTransformation";
import { Interpolation } from "../quartz-composer/provider/interpolation";

let images: { [name: string]: Image } = {};

export class Advanced01 implements QuartzComposition {
  preload(p: p5) {
    images["wall"] = new Image(p, "assets/chapter3/advanced_01/wall_256x256.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    // top layer
    let topComponent = new Transformation3D(p);
    let xRotInterp = new Interpolation(p);
    let yRotInterp = new Interpolation(p);
    xRotInterp.startValue.setDefaultValue(0);
    xRotInterp.endValue.setDefaultValue(360);
    xRotInterp.duration.setDefaultValue(30);
    yRotInterp.startValue.setDefaultValue(0);
    yRotInterp.endValue.setDefaultValue(360);
    yRotInterp.duration.setDefaultValue(40);
    topComponent.rotationX.bind(xRotInterp.result);
    topComponent.rotationY.bind(yRotInterp.result);
    consumers.push(topComponent);

    // second layer
    let cube = new Cube(p);
    topComponent.addConsumer(cube);
    cube.width.setDefaultValue(3.5);
    cube.height.setDefaultValue(3.5);
    cube.depth.setDefaultValue(3.5);
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
  }
}
