import p5 from "p5";
import { QuartzComposition } from "../quartzComposition";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { Cube } from "../quartz-composer/consumer/cube";
import { Transformation3D } from "../quartz-composer/consumer/macro/3DTransformation";
import { Interpolation } from "../quartz-composer/provider/interpolation";
import { ImageWithString } from "../quartz-composer/provider/imageWithString";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { ReplicateInSpace } from "../quartz-composer/consumer/macro/replicateInSpace";
import { Random } from "../quartz-composer/provider/random";
import { Round } from "../quartz-composer/processor/round";

let images: { [name: string]: Image } = {};
let fonts: { [name: string]: p5.Font } = {};

export class Advanced01 implements QuartzComposition {
  preload(p: p5) {
    images["wall"] = new Image(p, "assets/chapter3/advanced_01/wall_256x256.png");
    fonts["roboto"] = p.loadFont("assets/fonts/Roboto-Regular.ttf");
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

    let replicateZ = new ReplicateInSpace(p);
    topComponent.addConsumer(replicateZ);
    replicateZ.copies.setDefaultValue(5);
    replicateZ.originZ.setDefaultValue(-1);
    replicateZ.finalTranslationZ.setDefaultValue(2);

    // second layer
    let cube = new Cube(p);
    cube.layer = 1;
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

    // third layer
    let replicateY = new ReplicateInSpace(p);
    replicateZ.addConsumer(replicateY);
    replicateY.copies.setDefaultValue(5);
    replicateY.originY.setDefaultValue(-1);
    replicateY.finalTranslationY.setDefaultValue(2);

    // forth layer
    let replicateX = new ReplicateInSpace(p);
    replicateY.addConsumer(replicateX);
    replicateX.copies.setDefaultValue(5);
    replicateX.originX.setDefaultValue(-1);
    replicateX.finalTranslationX.setDefaultValue(2);

    // bottom layer
    let random = new Random(p);
    random.min.setDefaultValue(1000);
    random.max.setDefaultValue(9999);

    let round = new Round(p);
    round.value.bind(random.value);

    let sprite = new Sprite(p);
    sprite.layer = 2;
    replicateX.addConsumer(sprite);
    let text = new ImageWithString(p, fonts);
    text.textString.bind(round.roundedValue);
    text.fontName.setDefaultValue("roboto");
    sprite.image.bind(text.image);
    sprite.widthScale.bind(text.displayWidth);
    sprite.heightScale.bind(text.displayHeight);
  }
}
