import p5 from "p5";
import { BindableOutput } from "../core/bindable";
import { Provider } from "../core/provider";

export class ImageImporter implements Provider {
  image: BindableOutput<p5.Image>;

  imagePath: string;

  constructor(private p: p5, imagePath: string) {
    this.imagePath = imagePath;
    this.image = new BindableOutput(p.loadImage(imagePath));
  }
  update(elapsed: number): void {}
}
