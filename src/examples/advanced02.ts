import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { ImageData } from "../quartz-composer/core/imageData";
import { QuartzComposition } from "../quartzComposition";
import { Image } from "../quartz-composer/provider/image";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { Multiplexer } from "../quartz-composer/processor/multiplexer";
import { Transformation3D } from "../quartz-composer/consumer/macro/3DTransformation";
import { PatchTime } from "../quartz-composer/provider/patchTime";
import { MathOperation, MathOperator } from "../quartz-composer/processor/math";
import { Round } from "../quartz-composer/processor/round";
import { Interpolation } from "../quartz-composer/provider/interpolation";
import { InterpolationType } from "../quartz-composer/core/tween";
import { Iterator } from "../quartz-composer/consumer/macro/iterator";

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
    // top layer
    let gradient = new Gradient(p);
    gradient.layer = 0;
    gradient.color1.setDefaultValue(p.color(0));
    gradient.color2.setDefaultValue(p.color(59));
    gradient.color3.setDefaultValue(p.color(255));
    gradient.direction = GradientDirection.Vertical_Upside;
    consumers.push(gradient);

    let topComponent = new Transformation3D(p);
    topComponent.layer = 1;
    consumers.push(topComponent);
    topComponent.rotationX.setDefaultValue(-5);
    topComponent.translationY.setDefaultValue(0.4);

    // second layer
    let patchTime = new PatchTime(p);
    let div8Mod6 = new MathOperator(p, 2);
    div8Mod6.initialValue.bind(patchTime.time);
    div8Mod6.operations[0]!.setDefaultValue(MathOperation.Divide);
    div8Mod6.operands[0]!.setDefaultValue(8);
    div8Mod6.operations[1]!.setDefaultValue(MathOperation.Modulo);
    div8Mod6.operands[1]!.setDefaultValue(6);
    let timeRound = new Round(p);
    timeRound.value.bind(div8Mod6.result);
    let multi60 = new MathOperator(p, 1);
    multi60.initialValue.bind(timeRound.floorValue);
    multi60.operations[0]!.setDefaultValue(MathOperation.Multiply);
    multi60.operands[0]!.setDefaultValue(60);
    let plus60 = new MathOperator(p, 1);
    plus60.initialValue.bind(multi60.result);
    plus60.operations[0]!.setDefaultValue(MathOperation.Add);
    plus60.operands[0]!.setDefaultValue(60);

    let rotYInterp = new Interpolation(p);
    rotYInterp.startValue.bind(multi60.result);
    rotYInterp.endValue.bind(plus60.result);
    rotYInterp.duration.setDefaultValue(8);
    rotYInterp.interpolationType.setDefaultValue(InterpolationType.CubicInOut);

    let secondComponent = new Transformation3D(p);
    topComponent.addConsumer(secondComponent);
    secondComponent.rotationY.bind(rotYInterp.result);

    // third layer
    let iterator = new Iterator(p);
    secondComponent.addConsumer(iterator);
    iterator.iterations.setDefaultValue(6);

    // fourth layer
    let rotYInterp2 = new Interpolation(p);
    rotYInterp2.patchTime.bind(iterator.iteratorVariables.currentPosition);
    rotYInterp2.startValue.setDefaultValue(0);
    rotYInterp2.endValue.setDefaultValue(300);
    rotYInterp2.duration.setDefaultValue(1);

    let fourthComponent = new Transformation3D(p);
    iterator.addConsumer(fourthComponent);
    fourthComponent.rotationY.bind(rotYInterp2.result);

    // fifth layer
    let multiplexer = new Multiplexer<ImageData>(p, 6);
    multiplexer.sources[0]!.bind(images["blur"]!.image);
    multiplexer.sources[1]!.bind(images["figure"]!.image);
    multiplexer.sources[2]!.bind(images["scape"]!.image);
    multiplexer.sources[3]!.bind(images["sky"]!.image);
    multiplexer.sources[4]!.bind(images["water"]!.image);
    multiplexer.sources[5]!.bind(images["window"]!.image);
    multiplexer.sourceIndex.bind(iterator.iteratorVariables.currentIndex);

    let light = new Sprite(p);
    light.layer = 1;
    fourthComponent.addConsumer(light);
    light.image.bind(images["light"]!.image);
    light.positionY.setDefaultValue(-0.65);
    light.positionZ.setDefaultValue(-2.5);
    light.rotationX.setDefaultValue(98); // the expected value is 90
    light.widthScale.setDefaultValue(3);
    light.heightScale.setDefaultValue(4);

    let imageFrame = new Sprite(p);
    imageFrame.layer = 2;
    fourthComponent.addConsumer(imageFrame);
    imageFrame.image.bind(multiplexer.output);
    imageFrame.positionZ.setDefaultValue(-2);
    imageFrame.widthScale.setDefaultValue(1.6);
    imageFrame.heightScale.setDefaultValue(1.2);

    let imageShadow = new Sprite(p);
    imageShadow.layer = 3;
    fourthComponent.addConsumer(imageShadow);
    imageShadow.image.bind(multiplexer.output);
    imageShadow.positionY.setDefaultValue(-1.3);
    imageShadow.positionZ.setDefaultValue(-2);
    imageShadow.rotationX.setDefaultValue(180);
    imageShadow.widthScale.setDefaultValue(1.6);
    imageShadow.heightScale.setDefaultValue(1.2);
    imageShadow.color.setDefaultValue(p.color(255,64));
  }
}
