import p5 from "p5";
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

  x_position: BindableInput<number> = new BindableInput(0);
  y_position: BindableInput<number> = new BindableInput(0);

  x_rotation: BindableInput<number> = new BindableInput(0);
  y_rotation: BindableInput<number> = new BindableInput(0);
  z_rotation: BindableInput<number> = new BindableInput(0);

  widthScale: BindableInput<number> = new BindableInput(1);
  heightScale: BindableInput<number> = new BindableInput(1);

  image: BindableInput<p5.Image> = new BindableInput<p5.Image>(new p5.Image());

  constructor(private p: p5) {}

  updateValue() {}

  draw(elapsed: number) {
    const x = (this.p.width * (this.x_position.getValue(elapsed) + 1)) / 2;
    const y = (this.p.height * (this.y_position.getValue(elapsed) + 1)) / 2;

    const image = this.image.getValue(elapsed);
    const w = image.width * this.widthScale.getValue(elapsed);
    const h = image.height * this.heightScale.getValue(elapsed);

    this.p.push();
    this.p.translate(x, y);
    this.p.rotate(this.p.radians(this.z_rotation.getValue(elapsed)));
    this.p.imageMode(this.p.CENTER);
    this.p.image(image, 0, 0, w, h);
    this.p.pop();
  }
}
