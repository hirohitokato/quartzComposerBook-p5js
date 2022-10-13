import p5 from "p5";
import { BindableInput } from "../../core/bindable";
import { Consumer } from "../../core/consumer";

/**
 * This macro patch applies a 3D transformation to its subpatches:
 * rotation around an origin point, followed by translation,
 * followed by scale around an origin point.
 */
export class Transformation3D implements Consumer {
  layer: number = 1;

  /** Execution time of the patch */
  patchTime: BindableInput<number> = new BindableInput(-1);

  /** Origin on the X-axis */
  originX: BindableInput<number> = new BindableInput(0);
  /** Origin on the Y-axis */
  originY: BindableInput<number> = new BindableInput(0);
  /** Origin on the Z-axis */
  originZ: BindableInput<number> = new BindableInput(0);

  /** Rotation on the X-axis */
  rotationX: BindableInput<number> = new BindableInput(0);
  /** Rotation on the Y-axis */
  rotationY: BindableInput<number> = new BindableInput(0);
  /** Rotation on the Z-axis */
  rotationZ: BindableInput<number> = new BindableInput(0);

  /** Translation amount on the X-axis */
  translationX: BindableInput<number> = new BindableInput(0);
  /** Translation amount on the Y-axis */
  translationY: BindableInput<number> = new BindableInput(0);
  /** Translation amount on the Z-axis */
  translationZ: BindableInput<number> = new BindableInput(0);

  /** Scale amount on the X-axis */
  scaleX: BindableInput<number> = new BindableInput(1);
  /** Scale amount on the Y-axis */
  scaleY: BindableInput<number> = new BindableInput(1);
  /** Scale amount on the Z-axis */
  scaleZ: BindableInput<number> = new BindableInput(1);

  private _subConsumers: Consumer[] = [];

  constructor(private p: p5) {}

  /**
   * Add the consumer patch as one of subpatches of this patch.
   * @param consumer The patch will be contained in the patch
   * @note Make sure you must set consumer's layer property before adding.
   * the macro patch does not concern the change after adding.
   */
  addConsumer(consumer: Consumer) {
    consumer.layer += this.layer;
    this._subConsumers.push(consumer);
    this._subConsumers.sort((a, b) => (a.layer < b.layer ? 1 : -1));
  }

  draw(atTime: number): void {
    const patchTime = this.patchTime.getValue(atTime);
    const t = patchTime == -1 ? atTime : patchTime;

    const xOrigin = this.p.width * this.originX.getValue(t);
    const yOrigin = this.p.width * this.originY.getValue(t);
    const zOrigin = this.layer + (-this.p.height / 2) * this.originZ.getValue(t);

    const xRotation = this.p.radians(this.rotationX.getValue(t));
    const yRotation = this.p.radians(this.rotationY.getValue(t));
    const zRotation = this.p.radians(-this.rotationZ.getValue(t));
    const xTranslation = this.p.width * this.translationX.getValue(t);
    const yTranslation = -this.p.width * this.translationY.getValue(t);
    const zTranslation = this.layer + (-this.p.height / 2) * this.translationZ.getValue(t);

    const xScale = this.scaleX.getValue(t);
    const yScale = this.scaleY.getValue(t);
    const zScale = this.scaleZ.getValue(t);

    this._subConsumers.forEach((consumer) => {
      this.p.push();

      this.p.translate(xTranslation, yTranslation, zTranslation);
      this.p.translate(xOrigin, yOrigin, zOrigin);
      this.p.rotateZ(zRotation);
      this.p.rotateY(yRotation);
      this.p.rotateX(xRotation);
      this.p.scale(xScale, yScale, zScale);

      consumer.draw(t);

      this.p.pop();
    });
  }
}
