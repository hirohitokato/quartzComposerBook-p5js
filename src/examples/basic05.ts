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
import { ImageTexturingProperties } from "../quartz-composer/processor/imageTexturingProperties";
import { Spline } from "../quartz-composer/core/spline";

let images: { [name: string]: Image } = {};

export class Basic05 implements QuartzComposition {
  preload(p: p5) {
    // Unfortunately, p5.js may not accept to mix the size of power of two and not
    // a power of two.
    images["Fish"] = new Image(p, "assets/chapter2/basic_05/Fish_256x256.png");
    images["Water"] = new Image(p, "assets/chapter2/basic_05/Water_512x512.png");
  }

  setup(p: p5, consumers: Consumer[]) {
    let spline = new Spline([0, 0.5, 1], [0, 1, 0]);

    // top layer
    let gradient = new Gradient(p);
    consumers.push(gradient);
    gradient.layer = 1;
    gradient.direction = GradientDirection.Vertical_Upside;
    gradient.color1.setDefaultValue(p.color(255, 255, 255));
    gradient.color2.setDefaultValue(p.color(217, 219, 208));
    gradient.color3.setDefaultValue(p.color(0, 25, 27));
    gradient.color2pos.setDefaultValue(0.5);

    let topComponent = new Transformation3D(p);
    topComponent.layer = 2;
    consumers.push(topComponent);
    let topLfo = new WaveGenerator(p);
    topComponent.rotationZ.bind(topLfo.result);
    topLfo.type.setDefaultValue(WaveType.Sin);
    topLfo.period.setDefaultValue(10);
    topLfo.amplitude.setDefaultValue(15);

    // second layer
    let waveIterator = new Iterator(p);
    waveIterator.layer = 2;
    let fishIterator = new Iterator(p);
    fishIterator.layer = 1;
    topComponent.addConsumer(waveIterator);
    topComponent.addConsumer(fishIterator);
    waveIterator.iterations.setDefaultValue(4);
    fishIterator.iterations.setDefaultValue(20);

    // third layer (wave)
    let waveComponent = new Transformation3D(p);
    waveComponent.layer = 1;
    waveIterator.addConsumer(waveComponent);
    let wavePatchTime = new PatchTime(p);
    let waveCalc = new MathOperator(p);
    waveCalc.num_operations = 2;
    waveCalc.initialValue.bind(waveIterator.iteratorVariables.currentPosition);
    waveCalc.operations[0]?.setDefaultValue(MathOperation.Multiply);
    waveCalc.operands[0]?.setDefaultValue(2);
    waveCalc.operations[1]?.setDefaultValue(MathOperation.Add);
    waveCalc.operands[1]?.bind(wavePatchTime.time);
    waveComponent.patchTime.bind(waveCalc.result);

    // bottom layer (wave)
    let wave = new Sprite(p);
    wave.layer = 1;
    waveComponent.addConsumer(wave);
    wave.widthScale.setDefaultValue(8);
    wave.heightScale.setDefaultValue(0.4);
    let waveLfo = new WaveGenerator(p);
    wave.positionY.bind(waveLfo.result);
    waveLfo.type.setDefaultValue(WaveType.Sin);
    waveLfo.period.setDefaultValue(6);
    waveLfo.amplitude.setDefaultValue(0.05);
    waveLfo.offset.setDefaultValue(-0.4);

    let waveInterp = new Interpolation(p);
    waveInterp.startValue.setDefaultValue(0);
    waveInterp.endValue.setDefaultValue(-1);
    waveInterp.duration.setDefaultValue(15);
    waveInterp.repeatMode.setDefaultValue(RepeatMode.Loop);
    waveInterp.interpolationType.setDefaultValue(InterpolationType.Linear);
    let waveTexture = new ImageTexturingProperties(p);
    wave.image.bind(waveTexture.resultImage);
    waveTexture.image.bind(images["Water"]!.image);
    waveTexture.matrixTranslationX.bind(waveInterp.result);

    // third layer (fish)
    let fishComponent = new Transformation3D(p);
    fishComponent.layer = 1;
    fishIterator.addConsumer(fishComponent);
    let fishRancdom = new Random(p);
    fishRancdom.min.setDefaultValue(0);
    fishRancdom.max.setDefaultValue(5);
    fishRancdom.patchTime.bind(fishIterator.iteratorVariables.currentIndex);
    let fishPatchTime = new PatchTime(p);
    let fishAdd = new MathOperator(p, 1);
    fishAdd.initialValue.bind(fishPatchTime.time);
    fishAdd.operations[0]!.setDefaultValue(MathOperation.Add);
    fishAdd.operands[0]!.bind(fishRancdom.value);
    fishComponent.patchTime.bind(fishAdd.result);

    let fishTransXInterp = new Interpolation(p);
    fishTransXInterp.patchTime.bind(fishIterator.iteratorVariables.currentPosition);
    fishTransXInterp.startValue.setDefaultValue(-2);
    fishTransXInterp.endValue.setDefaultValue(2);
    fishTransXInterp.duration.setDefaultValue(1);
    fishTransXInterp.repeatMode.setDefaultValue(RepeatMode.None);
    fishTransXInterp.interpolationType.setDefaultValue(InterpolationType.Linear);
    fishComponent.translationX.bind(fishTransXInterp.result);

    // bottom layer(fish)
    let fish = new Sprite(p);
    fish.layer = 1;
    fish.image.bind(images["Fish"]?.image!);
    fish.widthScale.setDefaultValue(0.5);
    fish.heightScale.setDefaultValue(0.5);
    fishComponent.addConsumer(fish);

    let xPosInterp = new Interpolation(p);
    xPosInterp.startValue.setDefaultValue(-2);
    xPosInterp.endValue.setDefaultValue(2);
    xPosInterp.duration.setDefaultValue(6);
    xPosInterp.repeatMode.setDefaultValue(RepeatMode.Loop);
    fish.positionX.bind(xPosInterp.result);

    // カーブが山なりにできるようにする
    let yPosInterp = new Interpolation(p);
    yPosInterp.setCustomCurve(spline.at.bind(spline));
    yPosInterp.startValue.setDefaultValue(-1);
    yPosInterp.endValue.setDefaultValue(0.3);
    yPosInterp.duration.setDefaultValue(6);
    yPosInterp.repeatMode.setDefaultValue(RepeatMode.Loop);
    fish.positionY.bind(yPosInterp.result);

    let zRotInterp = new Interpolation(p);
    zRotInterp.startValue.setDefaultValue(45);
    zRotInterp.endValue.setDefaultValue(-45);
    zRotInterp.duration.setDefaultValue(6);
    fish.rotationZ.bind(zRotInterp.result);

    // カーブが山なりにできるようにする
    let alphaInterp = new Interpolation(p);
    alphaInterp.setCustomCurve(spline.at.bind(spline));
    alphaInterp.startValue.setDefaultValue(0);
    alphaInterp.endValue.setDefaultValue(1);
    alphaInterp.duration.setDefaultValue(6);
    let hslColor = new HSLColor(p);
    hslColor.alpha.bind(alphaInterp.result);
    fish.color.bind(hslColor.color);
  }
}
