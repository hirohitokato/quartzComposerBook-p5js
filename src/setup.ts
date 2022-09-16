import p5 from "p5";
import { Gradient, GradientDirection } from "./quartz_composer/consumer/gradient";
import { Sprite } from "./quartz_composer/consumer/sprite";
import { Consumer } from "./quartz_composer/core/consumer";
import { Provider } from "./quartz_composer/core/provider";
import { Image } from "./quartz_composer/provider/image";
import { Interpolation } from "./quartz_composer/provider/interpolation";
import { WaveGenerator, WaveType } from "./quartz_composer/provider/lfo";

export let gradient_background: Gradient;
export let volvox: Sprite;

export let images: { [name: string]: Image } = {};
export let providers: Provider[] = [];
export let consumers: Consumer[] = [];

export const preload = (p: p5): void => {
  console.log("preload");
  images["volvox"] = new Image(p, "assets/chapter2/basic_01/volvox.png");
};

/** This is a setup function. */
export const setup = (p: p5): void => {
  console.log("setup");
  p.createCanvas(800, 600);

  gradient_background = new Gradient(p);
  gradient_background.color1.setDefaultValue(p.color(134, 148, 150));
  gradient_background.color2.setDefaultValue(p.color(32, 56, 56));
  gradient_background.color3.setDefaultValue(p.color(0));
  gradient_background.direction = GradientDirection.Vertical_UpsideDown;

  volvox = new Sprite(p);
  volvox.image.bind(images["volvox"]!.image);
  volvox.x_position.setDefaultValue(100);

  consumers.push(gradient_background, volvox);

  let lfo_x = new WaveGenerator(p);
  lfo_x.type.setDefaultValue(WaveType.Sin);
  lfo_x.period.setDefaultValue(10);
  lfo_x.amplitude.setDefaultValue(0.5);
  volvox.x_position.bind(lfo_x.result);
  providers.push(lfo_x);

  let lfo_y = new WaveGenerator(p);
  lfo_y.type.setDefaultValue(WaveType.Cos);
  lfo_y.period.setDefaultValue(10);
  lfo_y.amplitude.setDefaultValue(0.5);
  volvox.y_position.bind(lfo_y.result);
  providers.push(lfo_y);

  let lfo_wh = new WaveGenerator(p);
  lfo_wh.type.setDefaultValue(WaveType.Sin);
  lfo_wh.period.setDefaultValue(0.1);
  lfo_wh.amplitude.setDefaultValue(0.01);
  lfo_wh.offset.setDefaultValue(0.8);
  volvox.widthScale.bind(lfo_wh.result);
  volvox.heightScale.bind(lfo_wh.result);
  providers.push(lfo_wh);

  let interpolation = new Interpolation(p);
  interpolation.startValue.setDefaultValue(0);
  interpolation.endValue.setDefaultValue(360);
  interpolation.duration.setDefaultValue(20);
  volvox.z_rotation.bind(interpolation.result);
  providers.push(interpolation);
};
