import p5 from "p5";
import { BindableInput, BindableOutput } from "../../core/bindable";
import { Consumer } from "../../core/consumer";
import { InterpolationType } from "../../core/tween";

/**
 * This macro patch renders the specified number of copies of the subpatches,
 * applying a 3D transformation to each copy.
 *
 * Each copy's transformation allows, in that order, to scale the copy (scale),
 * rotate it (orientation), translate it to a new origin (origin),
 * rotate it again (rotation) and finally translate it again (translation).
 * The parameters to use for each transformation are determined by interpolation,
 * except the ones for the origin which remain constants. Interpolation is
 * made so that the first copy is not affected and the last one has the scale,
 * orientation, translation and rotation as specified by the values on the
 * corresponding patch inputs. The type of interpolation (linear, quadratic,
 * exponential...) can be set by the "Interpolation" input.
 *
 * Note that arbitrarily complex copies can be achieved by using the Iterator
 * macro patch instead of Replicate in Space.
 */
export class ReplicateInSpace implements Consumer {
  layer: number = 1;

  /** Number of copies */
  copies: BindableInput<number> = new BindableInput(1);
  /** The interpolation mode */
  interpolation: BindableInput<InterpolationType> = new BindableInput(InterpolationType.Linear);
  /** Final uniform scale */
  finalScale: BindableInput<number> = new BindableInput(1);
  /** Orientation angle on the X-axis */
  finalOrientationX: BindableInput<number> = new BindableInput(0);
  /** Orientation angle on the Y-axis */
  finalOrientationY: BindableInput<number> = new BindableInput(0);
  /** Orientation angle on the Z-axis */
  finalOrientationZ: BindableInput<number> = new BindableInput(0);

  /** Transformation origin on the X-axis */
  originX: BindableInput<number> = new BindableInput(0);
  /** Transformation origin on the Y-axis */
  originY: BindableInput<number> = new BindableInput(0);
  /** Transformation origin on the Z-axis */
  originZ: BindableInput<number> = new BindableInput(0);

  /** Rotation angle on the X-axis */
  finalRotationX: BindableInput<number> = new BindableInput(0);
  /** Rotation angle on the Y-axis */
  finalRotationY: BindableInput<number> = new BindableInput(0);
  /** Rotation angle on the Z-axis */
  finalRotationZ: BindableInput<number> = new BindableInput(0);

  /** Translation amount on the X-axis */
  finalTranslationX: BindableInput<number> = new BindableInput(0);
  /** Translation amount on the Y-axis */
  finalTranslationY: BindableInput<number> = new BindableInput(0);
  /** Translation amount on the Z-axis */
  finalTranslationZ: BindableInput<number> = new BindableInput(0);

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
  }

  draw(atTime: number): void {
    throw new Error("Method not implemented.");
  }
}
