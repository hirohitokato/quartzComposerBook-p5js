import p5 from "p5";
import { Consumer } from "../quartz-composer/core/consumer";
import { Image } from "../quartz-composer/provider/image";
import { Sprite } from "../quartz-composer/consumer/sprite";
import { QuartzComposition } from "../quartzComposition";
import { ImageWithString } from "../quartz-composer/provider/imageWithString";
import { Gradient, GradientDirection } from "../quartz-composer/consumer/gradient";

let images: { [name: string]: Image } = {};
let fonts: { [name: string]: p5.Font } = {};

let myCamera;
let sliderX: any, sliderY: any, sliderZ: any;
let camX = 0,
  camY = 0,
  camZ = 0;
let infoP;

export class SetupTmp implements QuartzComposition {
  preload(p: p5) {
    images["fish"] = new Image(p, "assets/chapter2/basic_05/Fish.png");
    images["water"] = new Image(p, "assets/chapter3/advanced_02/water.jpg");
    fonts["roboto"] = p.loadFont("assets/fonts/Roboto-Regular.ttf");
  }

  setup(p: p5, consumers: Consumer[]) {
    // p.debugMode();

    myCamera = p.createCamera();

    sliderX = createXYZslider(p, -200, 200, camX, {
      x: 10,
      y: 310,
    });
    sliderX.elt.onchange = () => {
      camX = sliderX.value();
    };

    sliderY = createXYZslider(p, -200, 200, camY, {
      x: 10,
      y: 330,
    });
    sliderY.elt.onchange = () => {
      camY = sliderY.value();
    };

    sliderZ = createXYZslider(p, -200, 200, camZ, {
      x: 10,
      y: 350,
    });
    sliderZ.elt.onchange = () => {
      camZ = sliderZ.value();
    };

    infoP = p.createP();
    infoP.position(10, 370);

    let sprite = new Sprite(p);
    sprite.layer = 1;
    sprite.image.bind(images["water"]!.image);
    sprite.positionZ.setDefaultValue(0);
    // sprite.widthScale.setDefaultValue(1.6);
    // sprite.heightScale.setDefaultValue(1.2);
    consumers.push(sprite);
  }
}
function createXYZslider(p: p5, min: number, max: number, cam: any, pos: any) {
  const slider = p.createSlider(min, max, cam, 1);
  slider.position(pos.x, pos.y);
  slider.style("width", "400px");
  slider.elt.onchange = function () {
    cam = slider.value();
  };
  return slider;
}
