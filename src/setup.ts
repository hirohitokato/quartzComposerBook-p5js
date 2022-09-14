import p5 from "p5";
import { Gradient, GradientDirection } from "./quartz_composer/consumer/gradient";
import { Sprite } from "./quartz_composer/consumer/sprite";
import { Consumer } from "./quartz_composer/core/consumer";
import { Provider } from "./quartz_composer/core/provider";
import { ImageImporter } from "./quartz_composer/provider/imageImporter";
import { Interpolation } from "./quartz_composer/provider/interpolation";
import { LFO, LFOType } from "./quartz_composer/provider/lfo";

export let gradient_background: Gradient;
export let volvox: Sprite;

export let images: { [name: string]: ImageImporter } = {};
export let providers: Provider[] = [];
export let consumers: Consumer[] = [];

export const preload = (p: p5): void => {
  console.log("preload");
  images["volvox"] = new ImageImporter(p, "assets/chapter2/basic_01/volvox.png");
};

/** This is a setup function. */
export const setup = (p: p5): void => {
  console.log("setup");
  p.createCanvas(800, 600);

  gradient_background = new Gradient(p);
  gradient_background.color1.value = p.color(134, 148, 150);
  gradient_background.color2.value = p.color(32, 56, 56);
  gradient_background.color3.value = p.color(0);
  gradient_background.direction = GradientDirection.Vertical_UpsideDown;

  volvox = new Sprite(p);
  images["volvox"]?.image.bind(volvox.image);
  volvox.x_position.value = 100;

  consumers.push(gradient_background, volvox);

  let lfo_x = new LFO(p);
  lfo_x.type.value = LFOType.Sin;
  lfo_x.period.value = 10;
  lfo_x.amplitude.value = 0.5;
  lfo_x.result.bind(volvox.x_position);
  providers.push(lfo_x);

  let lfo_y = new LFO(p);
  lfo_y.type.value = LFOType.Cos;
  lfo_y.period.value = 10;
  lfo_y.amplitude.value = 0.5;
  lfo_y.result.bind(volvox.y_position);
  providers.push(lfo_y);

  let lfo_wh = new LFO(p);
  lfo_wh.type.value = LFOType.Sin;
  lfo_wh.period.value = 0.1;
  lfo_wh.amplitude.value = 0.01;
  lfo_wh.offset.value = 0.8;
  lfo_wh.result.bind(volvox.widthScale);
  lfo_wh.result.bind(volvox.heightScale);
  providers.push(lfo_wh);

  let interpolation = new Interpolation(p);
  interpolation.startValue.value = 0;
  interpolation.endValue.value = 360;
  interpolation.duration.value = 20;
  interpolation.result.bind(volvox.z_rotation);
  providers.push(interpolation);
};
