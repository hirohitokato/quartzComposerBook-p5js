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

  /** Position on the X-axis */
  xPosition: BindableInput<number> = new BindableInput(0);
  /** Position on the Y-axis */
  yPosition: BindableInput<number> = new BindableInput(0);
  /** Position on the Z-axis */
  zPosition: BindableInput<number> = new BindableInput(0);

  /** Rotation on the X-axis */
  xRotation: BindableInput<number> = new BindableInput(0);
  /** Rotation on the Y-axis */
  yRotation: BindableInput<number> = new BindableInput(0);
  /** Rotation on the Z-axis */
  zRotation: BindableInput<number> = new BindableInput(0);

  /** The width scale of the sprite */
  widthScale: BindableInput<number> = new BindableInput(1);
  /** The height scale of the sprite */
  heightScale: BindableInput<number> = new BindableInput(1);

  /** The color of the sprite */
  color: BindableInput<p5.Color>;

  /** The image on the sprite */
  image: BindableInput<p5.Image> = new BindableInput<p5.Image>(new p5.Image());

  constructor(private p: p5) {
    this.color = new BindableInput(p.color(255, 255, 255, 255));
  }

  updateValue() {}

  draw(elapsed: number) {
    const x = this.xPosition.getValue(elapsed) * (this.p.width / 2);
    const y = this.yPosition.getValue(elapsed) * -(this.p.height / 2);
    // const x = 0;
    // const y=0;
    const z = this.zPosition.getValue(elapsed) * 100 + 100;

    const xRotation = this.p.radians(this.xRotation.getValue(elapsed));
    const yRotation = this.p.radians(this.yRotation.getValue(elapsed));
    const zRotation = this.p.radians(this.zRotation.getValue(elapsed));

    const image = this.image.getValue(elapsed);
    const w = image.width * this.widthScale.getValue(elapsed);
    const h = image.height * this.heightScale.getValue(elapsed);

    const tintColor = this.color.getValue(elapsed);

    this.p.push();
    this.p.imageMode(this.p.CENTER);
    this.p.translate(x, y, this.layer + z);
    this.p.rotateZ(zRotation);
    this.p.rotateX(xRotation);
    this.p.rotateY(yRotation);

    this.p.blendMode(this.p.BLEND);
    this.p.tint(tintColor);

    this.p.texture(image);
    this.p.plane(w, h);

    this.p.pop();
  }
}
