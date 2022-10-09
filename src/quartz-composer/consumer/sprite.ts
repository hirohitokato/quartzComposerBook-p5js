import p5 from "p5";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";
import { ImageData } from "../core/imageData";

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
  positionX: BindableInput<number> = new BindableInput(0);
  /** Position on the Y-axis */
  positionY: BindableInput<number> = new BindableInput(0);
  /** Position on the Z-axis */
  positionZ: BindableInput<number> = new BindableInput(0);

  /** Rotation on the X-axis */
  rotationX: BindableInput<number> = new BindableInput(0);
  /** Rotation on the Y-axis */
  rotationY: BindableInput<number> = new BindableInput(0);
  /** Rotation on the Z-axis */
  rotationZ: BindableInput<number> = new BindableInput(0);

  /** The width scale of the sprite */
  widthScale: BindableInput<number> = new BindableInput(1);
  /** The height scale of the sprite */
  heightScale: BindableInput<number> = new BindableInput(1);

  /** The color of the sprite */
  color: BindableInput<p5.Color>;

  /** The image on the sprite */
  image: BindableInput<ImageData>;

  constructor(private p: p5) {
    this.color = new BindableInput(p.color(255, 255, 255, 255));
    this.image = new BindableInput(new ImageData(p, null!));
  }

  updateValue() {}

  draw(elapsed: number) {
    const x = this.positionX.getValue(elapsed) * (this.p.width / 2);
    const y = this.positionY.getValue(elapsed) * -(this.p.height / 2);
    const z = this.positionZ.getValue(elapsed) * (this.p.height / 2);

    const xRotation = this.p.radians(this.rotationX.getValue(elapsed));
    const yRotation = this.p.radians(this.rotationY.getValue(elapsed));
    const zRotation = this.p.radians(-this.rotationZ.getValue(elapsed));

    const tintColor = this.color.getValue(elapsed);

    this.p.push();
    this.p.translate(x, y, this.layer + z);
    this.p.rotateZ(zRotation);
    this.p.rotateY(yRotation);
    this.p.rotateX(xRotation);

    this.p.blendMode(this.p.BLEND);
    this.p.tint(tintColor);

    this.p.textureMode(this.p.NORMAL);

    // Get an image inside a push/pop stack. It may declare some settings
    // inside a onRequested method.
    // cf: ImageTextureProperties patch do so.
    const imageData = this.image.getValue(elapsed);
    const image = imageData.image;

    const w = image.width * this.widthScale.getValue(elapsed);
    const h = image.height * this.heightScale.getValue(elapsed);
    const uOffset = imageData.matrixTranslationX;
    const vOffset = imageData.matrixTranslationY;

    this.p.texture(image);

    if (uOffset != 0 || vOffset != 0) {
      this.p.textureWrap(this.p.REPEAT, this.p.REPEAT);
      // console.log(`[REPEAT] : [${imageData.filePath}]`);
    } else {
      this.p.textureWrap(this.p.CLAMP, this.p.CLAMP);
      // console.log(`[CLAMP] : [${imageData.filePath}]`);
    }

    this.p.beginShape();
    this.p.vertex(-w / 2, -h / 2, 0, 0 + uOffset, 0 + vOffset);
    this.p.vertex(+w / 2, -h / 2, 0, 1 + uOffset, 0 + vOffset);
    this.p.vertex(+w / 2, +h / 2, 0, 1 + uOffset, 1 + vOffset);
    this.p.vertex(-w / 2, +h / 2, 0, 0 + uOffset, 1 + vOffset);
    this.p.endShape();

    this.p.pop();
  }
}
