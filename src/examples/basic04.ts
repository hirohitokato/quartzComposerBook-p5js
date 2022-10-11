import p5 from "p5";
import { QuartzComposition } from "../quartzComposition";
import { Consumer } from "../quartz-composer/core/consumer";
import { InterpolationType } from "../quartz-composer/core/tween";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";
import { Image } from "../quartz-composer/provider/image";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { Transformation3D } from "../quartz-composer/consumer/macro/3DTransformation";
import { MathOperation, MathOperator } from "../quartz-composer/processor/math";
import { Interpolation, RepeatMode } from "../quartz-composer/provider/interpolation";
import { PatchTime } from "../quartz-composer/provider/patchTime";
import { WaveGenerator, WaveType } from "../quartz-composer/provider/lfo";
import { Iterator } from "../quartz-composer/consumer/macro/iterator";
import { Random } from "../quartz-composer/provider/random";
import { HSLColor } from "../quartz-composer/processor/hslColor";

let images: { [name: string]: Image } = {};

export class Basic04 implements QuartzComposition {
  preload(p: p5) {
    images["Nautilus"] = new Image(p, "assets/chapter2/basic_04/Nautilus.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    // top layer
    let gradient = new Gradient(p);
    consumers.push(gradient);
    gradient.layer = 1;
    gradient.direction = GradientDirection.Vertical_Upside;
    gradient.color1.setDefaultValue(p.color(93, 120, 191));
    gradient.color2.setDefaultValue(p.color(56, 93, 107));
    gradient.color3.setDefaultValue(p.color(102, 107, 63));
    gradient.color2pos.setDefaultValue(0.5);

    let component = new Transformation3D(p);
    component.layer = 2;
    consumers.push(component);

    let lfoRotZ = new WaveGenerator(p);
    let lfoTransX = new WaveGenerator(p);
    // component.zRotation.bind(lfoRotZ.result);
    // component.xTranslation.bind(lfoTransX.result);
    lfoRotZ.type.setDefaultValue(WaveType.Sin);
    lfoRotZ.period.setDefaultValue(30);
    lfoRotZ.amplitude.setDefaultValue(10);
    lfoTransX.type.setDefaultValue(WaveType.Sin);
    lfoTransX.period.setDefaultValue(10);
    lfoTransX.amplitude.setDefaultValue(0.2);

    // second layer
    let iterator = new Iterator(p);
    iterator.layer = 1;
    component.addConsumer(iterator);
    iterator.iterations.setDefaultValue(20);

    // third layer
    let subComponent = new Transformation3D(p);
    subComponent.layer = 1;
    iterator.addConsumer(subComponent);

    let patchTime = new PatchTime(p);
    let calc = new MathOperator(p, 2);
    calc.initialValue.bind(iterator.iteratorVariables.currentPosition);
    calc.operations[0]?.setDefaultValue(MathOperation.Multiply);
    calc.operands[0]?.setDefaultValue(5);
    calc.operations[1]?.setDefaultValue(MathOperation.Add);
    calc.operands[1]?.bind(patchTime.time);
    subComponent.patchTime.bind(calc.result);

    let rotZRandom = new Random(p);
    let transXRandom = new Random(p);
    let transYRandom = new Random(p);
    rotZRandom.patchTime.bind(iterator.iteratorVariables.currentIndex);
    rotZRandom.min.setDefaultValue(0);
    rotZRandom.max.setDefaultValue(60);
    transXRandom.patchTime.bind(iterator.iteratorVariables.currentIndex);
    transXRandom.min.setDefaultValue(-2);
    transXRandom.max.setDefaultValue(2);
    transYRandom.patchTime.bind(iterator.iteratorVariables.currentIndex);
    transYRandom.min.setDefaultValue(-1.5);
    transYRandom.max.setDefaultValue(1.5);
    subComponent.rotationZ.bind(rotZRandom.value);
    subComponent.translationX.bind(transXRandom.value);
    subComponent.translationY.bind(transYRandom.value);

    // bottom layer
    let sprite = new Sprite(p);
    sprite.layer = 1;
    sprite.image.bind(images["Nautilus"]!.image);
    sprite.widthScale.setDefaultValue(0.5);
    sprite.heightScale.setDefaultValue(0.5);
    subComponent.addConsumer(sprite);

    let alphaInterp = new Interpolation(p);
    alphaInterp.startValue.setDefaultValue(0);
    alphaInterp.endValue.setDefaultValue(1);
    alphaInterp.duration.setDefaultValue(2.5);
    alphaInterp.repeatMode.setDefaultValue(RepeatMode.MirroredLoop);
    alphaInterp.interpolationType.setDefaultValue(InterpolationType.QuadraticInOut);

    let hslColor = new HSLColor(p);
    hslColor.alpha.bind(alphaInterp.result);

    let zPosInterp = new Interpolation(p);
    zPosInterp.startValue.setDefaultValue(-3);
    zPosInterp.endValue.setDefaultValue(1.5);
    zPosInterp.duration.setDefaultValue(5);
    zPosInterp.repeatMode.setDefaultValue(RepeatMode.Loop);
    zPosInterp.interpolationType.setDefaultValue(InterpolationType.Linear);

    sprite.color.bind(hslColor.color);
    sprite.positionZ.bind(zPosInterp.result);
  }
}
