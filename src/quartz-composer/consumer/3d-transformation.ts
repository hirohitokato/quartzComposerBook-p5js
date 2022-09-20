import p5 from "p5";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";

/**
 * This macro patch applies a 3D transformation to its subpatches:
 * rotation around an origin point, followed by translation,
 * followed by scale around an origin point.
 */
export class Transformation3D implements Consumer {
  layer: number = 1;

  xOrigin: BindableInput<number> = new BindableInput(0);
  yOrigin: BindableInput<number> = new BindableInput(0);
  zOrigin: BindableInput<number> = new BindableInput(0);

  xRotation: BindableInput<number> = new BindableInput(0);
  yRotation: BindableInput<number> = new BindableInput(0);
  zRotation: BindableInput<number> = new BindableInput(0);

  xTranslation: BindableInput<number> = new BindableInput(0);
  yTranslation: BindableInput<number> = new BindableInput(0);
  zTranslation: BindableInput<number> = new BindableInput(0);

  xScale: BindableInput<number> = new BindableInput(1);
  yScale: BindableInput<number> = new BindableInput(1);
  zScale: BindableInput<number> = new BindableInput(1);

  private _subConsumers: Consumer[] = [];

  constructor(private p: p5) {}

  addConsumer(consumer: Consumer) {
    consumer.layer += this.layer;
    this._subConsumers.push(consumer);
  }

  draw(atTime: number): void {
    const xOrigin = (this.p.width / 2) * this.xOrigin.getValue(atTime);
    const yOrigin = (this.p.height / 2) * this.yOrigin.getValue(atTime);
    const zOrigin = this.layer + this.zOrigin.getValue(atTime);

    const xRotation = this.p.radians(this.xRotation.getValue(atTime));
    const yRotation = this.p.radians(this.yRotation.getValue(atTime));
    const zRotation = this.p.radians(this.zRotation.getValue(atTime));

    const xTranslation = (this.p.width / 2) * this.xTranslation.getValue(atTime);
    const yTranslation = -(this.p.height / 2) * this.yTranslation.getValue(atTime);
    const zTranslation = this.layer + this.zTranslation.getValue(atTime);

    const xScale = this.xScale.getValue(atTime);
    const yScale = this.yScale.getValue(atTime);
    const zScale = this.zScale.getValue(atTime);

    this.p.push();

    this.p.push();
    this.p.translate(xOrigin, yOrigin, zOrigin);
    this.p.rotateZ(zRotation);
    this.p.rotateX(xRotation);
    this.p.rotateY(yRotation);
    this.p.pop();

    this.p.scale(xScale, yScale, zScale);
    this.p.translate(xTranslation, yTranslation, zTranslation);

    this._subConsumers.forEach((c) => {
      c.draw(atTime);
    });

    this.p.pop();
  }
}
