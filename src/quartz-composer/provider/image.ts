import p5 from "p5";
import { BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

/**
 * This patch imports an image from a file. Most common image file formats
 * are supported: JPEG, TIFF, PNG, GIF, BMP, TGA, OpenEXR, JPEG 2000, PDF...
 *
 * Note that the image data is saved within the composition.
 */
export class Image implements Provider {
  /** The resulting image */
  image: BindableOutput<p5.Image>;

  /** The file(url) path of the resulting image */
  get imagePath(): string {
    return this._imagePath;
  }

  private _imagePath: string;
  private _image: p5.Image;

  constructor(private p: p5, imagePath: string) {
    this._imagePath = imagePath;
    this._image = p.loadImage(imagePath);
    this.image = new BindableOutput(this._image);
  }
}
