import p5 from "p5";
import { BindableInput, BindableOutput } from "../core/bindable";
import { ImageData, MipmappingType, TextureTargetType } from "../core/imageData";
import { Operator } from "../core/operator";

/**
 * This patch modifies the texturing properties of an image:
 *  texture target, mipmapping levels and texturing matrix.
 *
 * Those texturing properties only affect the image when used
 * as a texture by patches, while the actual contents of the image
 * is left untouched. Note however that some patches (e.g. Billboard)
 * may ignore those properties because of the way they use images.
 *
 * Also be aware that the mipmapping can only be activated
 * if the texture target is set to 2D.
 */
export class ImageTexturingProperties implements Operator {
  /** The original image */
  image: BindableInput<ImageData>;

  /** The texture target */
  target: BindableInput<TextureTargetType> = new BindableInput(TextureTargetType.TwoD);
  /** Controls mipmapping for the 2D texture target */
  mipmapping: BindableInput<MipmappingType> = new BindableInput(MipmappingType.Default);

  /** Scaling on the X-axis */
  matrixScalingX: BindableInput<number> = new BindableInput(1);
  /** Scaling on the Y-axis */
  matrixScalingY: BindableInput<number> = new BindableInput(1);
  /** Rotation amount */
  matrixRotation: BindableInput<number> = new BindableInput(0);
  /** Translation amount on the X-axis */
  matrixTranslationX: BindableInput<number> = new BindableInput(0);
  /** Translation amount on the Y-axis */
  matrixTranslationY: BindableInput<number> = new BindableInput(0);

  /** The resulting image */
  resultImage: BindableOutput<ImageData>;

  constructor(private p: p5) {
    this.image = new BindableInput(null!);
    this.resultImage = new BindableOutput<ImageData>(null!);

    this.resultImage.onRequestedValue = this._onRequestedValue.bind(this);
  }

  private _onRequestedValue(atTime: number): ImageData {
    let imageData = this.image.getValue(atTime);
    imageData.matrixTranslationX = this.matrixTranslationX.getValue(atTime);
    imageData.matrixTranslationY = this.matrixTranslationY.getValue(atTime);

    return imageData;
  }
}
