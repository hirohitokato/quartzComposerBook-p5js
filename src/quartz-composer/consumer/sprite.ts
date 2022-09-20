import p5 from "p5";
import { shader } from "../../setup";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";

/**
 * This patch renders a single quad with optionaly antialiased borders.
 *
 * The image on the quad is multiplied by the color set on the "Color" input
 * and can be combined with a mask using the optional "Mask Image" input
 * (the mask will be resized to match the image's size).
 *
 * Note that the Billboard patch is a simplified version of Sprite with fewer
 * parameters and which is especially suited for 2D drawing.
 */
export class Sprite implements Consumer {
  layer: number = 1;

  xPosition: BindableInput<number> = new BindableInput(0);
  yPosition: BindableInput<number> = new BindableInput(0);

  xRotation: BindableInput<number> = new BindableInput(0);
  yRotation: BindableInput<number> = new BindableInput(0);
  zRotation: BindableInput<number> = new BindableInput(0);

  widthScale: BindableInput<number> = new BindableInput(1);
  heightScale: BindableInput<number> = new BindableInput(1);

  image: BindableInput<p5.Image> = new BindableInput<p5.Image>(new p5.Image());

  constructor(private p: p5) {}

  updateValue() {}

  draw(elapsed: number) {
    const x = (this.p.width / 2) * this.xPosition.getValue(elapsed);
    const y = -(this.p.height / 2) * this.yPosition.getValue(elapsed);

    const image = this.image.getValue(elapsed);
    const w = image.width * this.widthScale.getValue(elapsed);
    const h = image.height * this.heightScale.getValue(elapsed);

    this.p.push();
    this.p.translate(x, y, this.layer);
    this.p.rotate(this.p.radians(this.zRotation.getValue(elapsed)));
    this.p.imageMode(this.p.CENTER);
    this.p.shader(shader);
    this.p.texture(image);
    this.p.plane(w, h);
    this.p.pop();
  }
}
