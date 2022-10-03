import p5 from "p5";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";
import { ImageData } from "../core/imageData";

class Point {
  constructor(public x: number, public y: number, public z: number) {}
}

export class Cube implements Consumer {
  layer: number = 0;

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

  /** The width of the cube */
  width: BindableInput<number> = new BindableInput(0);
  /** The height of the cube */
  height: BindableInput<number> = new BindableInput(0);
  /** The depth of the cube */
  depth: BindableInput<number> = new BindableInput(0);

  /** The color of the front face of the cube */
  frontColor: BindableInput<p5.Color>;
  /** The image on the front face of the cube */
  frontImage: BindableInput<ImageData>;
  /** The color of the left face of the cube */
  leftColor: BindableInput<p5.Color>;
  /** The image on the left face of the cube */
  leftImage: BindableInput<ImageData>;
  /** The color of the right face of the cube */
  rightColor: BindableInput<p5.Color>;
  /** The image on the right face of the cube */
  rightImage: BindableInput<ImageData>;
  /** The color of the back face of the cube */
  backColor: BindableInput<p5.Color>;
  /** The image on the back face of the cube */
  backImage: BindableInput<ImageData>;
  /** The color of the top face of the cube */
  topColor: BindableInput<p5.Color>;
  /** The image on the top face of the cube */
  topImage: BindableInput<ImageData>;
  /** The color of the bottom face of the cube */
  bottomColor: BindableInput<p5.Color>;
  /** The image on the bottom face of the cube */
  bottomImage: BindableInput<ImageData>;

  constructor(private p: p5) {
    this.frontColor = new BindableInput(p.color(255));
    this.frontImage = new BindableInput(new ImageData(p, null!));
    this.leftColor = new BindableInput(p.color(255));
    this.leftImage = new BindableInput(new ImageData(p, null!));
    this.rightColor = new BindableInput(p.color(255));
    this.rightImage = new BindableInput(new ImageData(p, null!));
    this.backColor = new BindableInput(p.color(255));
    this.backImage = new BindableInput(new ImageData(p, null!));
    this.topColor = new BindableInput(p.color(255));
    this.topImage = new BindableInput(new ImageData(p, null!));
    this.bottomColor = new BindableInput(p.color(255));
    this.bottomImage = new BindableInput(new ImageData(p, null!));
  }

  draw(atTime: number): void {
    const x = this.positionX.getValue(atTime) * (this.p.width / 2);
    const y = this.positionY.getValue(atTime) * -(this.p.height / 2);
    const z = this.positionZ.getValue(atTime) * (this.p.height / 2);
    const w = this.width.getValue(atTime) * (this.p.width / 2);
    const h = this.height.getValue(atTime) * (this.p.height / 2);
    const d = this.depth.getValue(atTime) * (this.p.height / 2);
    const w2 = w / 2;
    const h2 = h / 2;
    const d2 = d / 2;
    const frontColor = this.frontColor.getValue(atTime);
    const leftColor = this.leftColor.getValue(atTime);
    const rightColor = this.rightColor.getValue(atTime);
    const backColor = this.backColor.getValue(atTime);
    const topColor = this.topColor.getValue(atTime);
    const bottomColor = this.bottomColor.getValue(atTime);
    const frontImage = this.frontImage.getValue(atTime);
    const leftImage = this.leftImage.getValue(atTime);
    const rightImage = this.rightImage.getValue(atTime);
    const backImage = this.backImage.getValue(atTime);
    const topImage = this.topImage.getValue(atTime);
    const bottomImage = this.bottomImage.getValue(atTime);

    const xRotation = this.p.radians(this.rotationX.getValue(atTime));
    const yRotation = this.p.radians(this.rotationY.getValue(atTime));
    const zRotation = this.p.radians(-this.rotationZ.getValue(atTime));

    const planes = [
      // front
      {
        a: new Point(x - w2, y - h2, z + d2),
        b: new Point(x + w2, y - h2, z + d2),
        c: new Point(x + w2, y + h2, z + d2),
        d: new Point(x - w2, y + h2, z + d2),
        color: frontColor,
        image: frontImage,
      },
      // left
      {
        a: new Point(x - w2, y - h2, z + d2),
        b: new Point(x - w2, y - h2, z - d2),
        c: new Point(x - w2, y + h2, z - d2),
        d: new Point(x - w2, y + h2, z + d2),
        color: leftColor,
        image: leftImage,
      },
      // right
      {
        a: new Point(x + w2, y - h2, z + d2),
        b: new Point(x + w2, y - h2, z - d2),
        c: new Point(x + w2, y + h2, z - d2),
        d: new Point(x + w2, y + h2, z + d2),
        color: rightColor,
        image: rightImage,
      },
      // back
      {
        a: new Point(x - w2, y - h2, z - d2),
        b: new Point(x + w2, y - h2, z - d2),
        c: new Point(x + w2, y + h2, z - d2),
        d: new Point(x - w2, y + h2, z - d2),
        color: backColor,
        image: backImage,
      },
      // top
      {
        a: new Point(x - w2, y - h2, z + d2),
        b: new Point(x - w2, y - h2, z - d2),
        c: new Point(x + w2, y - h2, z - d2),
        d: new Point(x + w2, y - h2, z + d2),
        color: topColor,
        image: topImage,
      },
      // bottom
      {
        a: new Point(x - w2, y + h2, z + d2),
        b: new Point(x - w2, y + h2, z - d2),
        c: new Point(x + w2, y + h2, z - d2),
        d: new Point(x + w2, y + h2, z + d2),
        color: bottomColor,
        image: bottomImage,
      },
    ];

    this.p.push();
    this.p.rotateZ(zRotation);
    this.p.rotateX(xRotation);
    this.p.rotateY(yRotation);

    for (const plane of planes) {
      this.drawPlane(plane.a, plane.b, plane.c, plane.d, plane.color, plane.image);
    }
    this.p.pop();
  }

  private drawPlane(a: Point, b: Point, c: Point, d: Point, color: p5.Color, imageData: ImageData) {
    const uOffset = imageData.matrixTranslationX;
    const vOffset = imageData.matrixTranslationY;

    this.p.blendMode(this.p.BLEND);

    if (imageData.image) {
      this.p.textureMode(this.p.NORMAL);
      this.p.tint(color);
      this.p.texture(imageData!.image);
    }

    // Draw cube
    this.p.beginShape();
    if (!imageData.image) {
      this.p.fill(color);
      this.p.vertex(a.x, a.y, a.z);
    } else {
      this.p.vertex(a.x, a.y, a.z, 0 + uOffset, 0 + vOffset);
    }
    if (!imageData.image) {
      this.p.fill(color);
      this.p.vertex(b.x, b.y, b.z);
    } else {
      this.p.vertex(b.x, b.y, b.z, 1 + uOffset, 0 + vOffset);
    }
    if (!imageData.image) {
      this.p.fill(color);
      this.p.vertex(c.x, c.y, c.z);
    } else {
      this.p.vertex(c.x, c.y, c.z, 1 + uOffset, 1 + vOffset);
    }
    if (!imageData.image) {
      this.p.fill(color);
      this.p.vertex(d.x, d.y, d.z);
    } else {
      this.p.vertex(d.x, d.y, d.z, 0 + uOffset, 1 + vOffset);
    }
    this.p.endShape();
  }
}
