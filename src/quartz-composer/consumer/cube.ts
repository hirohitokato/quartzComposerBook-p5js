import p5 from "p5";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";
import { ImageData } from "../core/imageData";

class Position {
  constructor(public x: number, public y: number, public z: number) {}
}

export class Cube implements Consumer {
  layer: number = 0;

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

  draw(atTime: number): void {}

  private drawPlane(a: Position, b: Position, c: Position, d: Position, color: p5.Color) {
    this.p.beginShape();
    this.p.fill(color);
    this.p.vertex(a.x, a.y, a.z);
    this.p.fill(color);
    this.p.vertex(b.x, b.y, b.z);
    this.p.fill(color);
    this.p.vertex(c.x, c.y, c.z);
    this.p.fill(color);
    this.p.vertex(d.x, d.y, d.z);
    this.p.endShape();
  }
}
