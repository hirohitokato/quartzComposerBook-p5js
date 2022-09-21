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

  patchTime: BindableInput<number> = new BindableInput(-1);

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
    const patchTime = this.patchTime.getValue(atTime);
    const t = patchTime == -1 ? atTime : patchTime;

    const xOrigin = (this.p.width / 2) * this.xOrigin.getValue(t);
    const yOrigin = (this.p.height / 2) * this.yOrigin.getValue(t);
    const zOrigin = this.layer + this.zOrigin.getValue(t);

    const xRotation = this.p.radians(this.xRotation.getValue(t));
    const yRotation = this.p.radians(this.yRotation.getValue(t));
    const zRotation = this.p.radians(this.zRotation.getValue(t));

    const xTranslation = (this.p.width / 2) * this.xTranslation.getValue(t);
    const yTranslation = -(this.p.height / 2) * this.yTranslation.getValue(t);
    const zTranslation = this.layer + this.zTranslation.getValue(t);

    const xScale = this.xScale.getValue(t);
    const yScale = this.yScale.getValue(t);
    const zScale = this.zScale.getValue(t);

    this.p.push();

    this.p.push();
    this.p.translate(xOrigin, yOrigin, zOrigin);
    this.p.rotateZ(zRotation);
    this.p.rotateX(xRotation);
    this.p.rotateY(yRotation);
    this.p.pop();

    this.p.scale(xScale, yScale, zScale);
    this.p.translate(xTranslation, yTranslation, zTranslation);

    this._subConsumers.forEach((consumer) => {
      consumer.draw(t);
    });

    this.p.pop();
  }
}
