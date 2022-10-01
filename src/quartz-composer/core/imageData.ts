import p5 from "p5";

/** The texture target */
export const TextureTargetType = {
  TwoD: "2D",
  Rectangle: "rectangle",
} as const;
export type TextureTargetType = typeof TextureTargetType[keyof typeof TextureTargetType];

/** Controls mipmapping for the 2D texture target */
export const MipmappingType = {
  Default: "default",
  Disabled: "disabled",
  Enabled: "enabled",
} as const;
export type MipmappingType = typeof MipmappingType[keyof typeof MipmappingType];

export class ImageData {
  /** The original image */
  image: p5.Image;
  filePath: string = "";

  /** The texture target */
  target: TextureTargetType = TextureTargetType.TwoD;
  /** Controls mipmapping for the 2D texture target */
  mipmapping: MipmappingType = MipmappingType.Default;

  /** Scaling on the X-axis */
  matrixScalingX: number = 1;
  /** Scaling on the Y-axis */
  matrixScalingY: number = 1;
  /** Rotation amount */
  matrixRotation: number = 0;
  /** Translation amount on the X-axis */
  matrixTranslationX: number = 0;
  /** Translation amount on the Y-axis */
  matrixTranslationY: number = 0;

  constructor(private p: p5, image: p5.Image) {
    this.image = image;
  }
}
