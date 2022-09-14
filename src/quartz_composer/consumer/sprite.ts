import p5 from "p5";
import { BindableInput } from "../core/bindable";
import { Consumer } from "../core/consumer";

export class Sprite implements Consumer {
  layer: number = 1;

  x_position: BindableInput<number> = new BindableInput(0);
  y_position: BindableInput<number> = new BindableInput(0);

  x_rotation: BindableInput<number> = new BindableInput(0);
  y_rotation: BindableInput<number> = new BindableInput(0);
  z_rotation: BindableInput<number> = new BindableInput(0);

  widthScale: BindableInput<number> = new BindableInput(1);
  heightScale: BindableInput<number> = new BindableInput(1);

  image: BindableInput<p5.Image> = new BindableInput<p5.Image>();

  constructor(private p: p5) {}

  updateValue() {}

  draw() {
    const x = (this.p.width * (this.x_position.value + 1)) / 2;
    const y = (this.p.height * (this.y_position.value + 1)) / 2;

    const w = this.image.value.width * this.widthScale.value;
    const h = this.image.value.height * this.heightScale.value;

    this.p.push();
    this.p.translate(x, y);
    this.p.rotate(this.p.radians(this.z_rotation.value));
    this.p.imageMode(this.p.CENTER);
    this.p.image(this.image.value, 0, 0, w, h);
    this.p.pop();
  }
}
