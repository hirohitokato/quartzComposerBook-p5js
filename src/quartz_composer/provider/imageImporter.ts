import p5 from "p5";
import { BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export class ImageImporter implements Provider {
  image: BindableOutput<p5.Image>;

  imagePath: string;

  private _image: p5.Image;

  constructor(private p: p5, imagePath: string) {
    this.imagePath = imagePath;
    this._image = p.loadImage(imagePath);
    this.image = new BindableOutput(this._image);
  }
}
